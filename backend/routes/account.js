const express = require("express")
const validateReq = require("../middleware/validateReq")
const { User, Account } = require("../db/mongoose")
const mongoose = require("mongoose")

const accountrouter = express.Router()
const crypto = require("crypto");
const razorpay = require("../razorpay/razorpayInstance")


accountrouter.get("/receiverdetails/:userId",validateReq, async (req,res) => {
    const userId = req.params.userId

    try {
        const receiver = await User.findById(userId)
        const name = receiver.firstname + " " + receiver.lastname

        return res.status(200).json({name})
    } catch (error) {
        return res.json({mssg: "Error while fetching receivers details",error})
    }
})

accountrouter.get("/balance",validateReq, async (req,res) => {
    const userId = req.userId

    try {
        const account = await Account.findOne({userId: req.userId}).populate('userId')
        const balance = account.balance
        const firstname = account.userId.firstname
        const lastname = account.userId.lastname

        return res.status(200).json({balance, firstname, lastname})
    } catch (error) {
        return res.json({mssg: "Error while fetching balance"})
    }
})

accountrouter.post("/add-money",validateReq, async (req,res) => {
    const userId = req.userId
    const {amount} = req.body

    try {

    if (!amount || amount <= 0) {
        return res.json({success: false, message : "Invalid amount"})
    }
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount, // already in paise
      key: process.env.RAZORPAY_KEY_ID,
    });

    } catch (err) {
    console.log("error is:",err);
    res.status(500).json({ success: false, message: "Some Server Error while addmoney" });
}
})

accountrouter.post("/verify-payment",validateReq, async (req,res) => {
    const userId = req.userId

    try {
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature,} = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid signature" });
    }

    // Get amount from DB or razorpay
    const paymentInfo = await razorpay.orders.fetch(razorpay_order_id);

    const amount = paymentInfo.amount / 100; // convert back to rupees
    const userId = req.user.id;

    // 1. Update wallet balance
    await Account.updateOne(
        { userId: userId },
        { $inc: { balance: amount } }
    );

    // 2. Record transaction
    // await prisma.transaction.create({
    //   data: {
    //     userId,
    //     amount,
    //     paymentId: razorpay_payment_id,
    //     type: "ADD_MONEY",
    //     status: "SUCCESS",
    //   },
    // });

    return res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
})

accountrouter.patch("/transfer",validateReq, async (req,res) => {
    const senderId = req.userId
    const {rId,amount} = req.body

    if (!rId || !amount) {
        return res.json({mssg : "Missing required fields"})
    }

    try {

    const session = await mongoose.startSession() //start session
    session.startTransaction()  //start transaction

    const senderAcc = await Account.findOne({userId: senderId}).session(session);
    const receiverAcc = await Account.findOne({userId: rId}).session(session);

    if (senderAcc.balance < amount) {
        await session.abortTransaction()  //abort transaction
        session.endSession();
        return res.json({mssg: "Not enough money"})
    } else if (!receiverAcc) {
        await session.abortTransaction()  //abort transaction
        session.endSession();
        return res.json({mssg: "Receiver account not found"})
    }

    await Account.updateOne({userId: senderId},{$inc: {balance: -amount}}).session(session)  //part of session
    await Account.updateOne({userId: rId},{$inc: {balance: amount}}).session(session)  //part of session

    await session.commitTransaction()
    session.endSession()
    return res.status(200).json({ mssg: "Transaction successful" }); 

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return res.status(500).json({mssg : "Transcation failed due to an error", error})
    }
})


module.exports = accountrouter