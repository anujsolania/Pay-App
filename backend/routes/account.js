const express = require("express")
const validateReq = require("../middleware/validateReq")
const { User, Account, Transaction } = require("../db/mongoose")
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
        //General case - expiring all pending transactions (if > 15 mins)
        await Transaction.updateMany(
        {
            status: "PENDING",
            createdAt: {$lt: new Date(Date.now() - 15 * 60 * 1000)}
        },
        { status: "EXPIRED" }
        )

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

    if (!amount || amount <= 0 || amount < 1) {
        return res.json({success: false, message : "Invalid amount"})
    }
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `u_${userId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    //expires previous pending add money transactions of the user
    await Transaction.updateMany({userId: userId, type: "ADD_MONEY", status: "PENDING"}, {status: "EXPIRED"})

    await Transaction.create({
        userId: userId,
        amount: amount,
        orderId: order.id,
        type: "ADD_MONEY",
        status: "PENDING"
    })

    // return res.json({
    //   success: true,
    //   orderId: order.id,
    //   amount: order.amount, // already in paise
    //   key: process.env.RAZORPAY_KEY_ID,
    // });

    return res.json({
        order: order,
        key: process.env.RAZORPAY_KEY_ID,
    })

    } catch (err) {
    console.log("error is:",err);
    res.status(500).json({ success: false, message: "Some Server Error while addmoney" });
}
})

accountrouter.post("/verify-payment",validateReq, async (req,res) => {

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

    const txn = await Transaction.findOne({orderId: razorpay_order_id})

    if (!txn) {
        return res.json({ success: false, message: "Transaction not found" });
    }

    if (txn.status === "SUCCESS") {
        return res.json({ success: true });
    }

    if (txn.type == "ADD_MONEY") {
        await Account.updateOne({userId: req.userId},{$inc: { balance: txn.amount }});
    }

    if (txn.type == "TRANSFER") {
        
        const session = await mongoose.startSession() //start session
        session.startTransaction()  //start transaction

        try {
            await Account.updateOne({userId: txn.userId},{$inc: { balance: -txn.amount }}).session(session)  //part of session
            await Account.updateOne({userId: txn.receiverId},{$inc: { balance: txn.amount }}).session(session)  //part of session

            await session.commitTransaction()
            session.endSession()
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            return res.status(500).json({mssg : "Transcation failed due to an error", error})
        }
        
    }

    // txn.status = "SUCCESS" //1 method
    // txn.rzpPaymentId = razorpay_payment_id
    // await txn.save()

    await Transaction.updateOne({orderId: razorpay_order_id},{status: "SUCCESS", rzpPaymentId: razorpay_payment_id}) //2 methods

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
        const options = {
            amount: amount * 100,
            currency: "INR",
            // receipt: `t_${senderId}_${rId}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        await Transaction.create({
            userId: senderId,
            receiverId: rId,
            amount: amount,
            orderId: order.id,
            type: "TRANSFER",
            status: "PENDING"
        })

        return res.json({
            order: order,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.log("error is:",err);
        res.status(500).json({ success: false, message: "Some Server Error while transfer money" });
    }
})

accountrouter.post("/payment-cancel",validateReq, async (req,res) => {
    const {orderId} = req.body

    if (!orderId) {
        return res.json({mssg : "Missing orderId"})
    }

    try {
        await Transaction.updateOne({orderId: orderId, userId: req.userId, status: "PENDING"}, {status: "FAILED"})
        return res.json({mssg : "Payment cancelled"})

    } catch (error) {
        console.log("error is:",err);
        res.status(500).json({ success: false, message: "Some Server Error while cancelling payment" });
    }
})

accountrouter.get("/transactions",validateReq, async (req,res) => {
    const userId = req.userId

    try {
        const transactions = await Transaction.find({$or: [{userId: userId}, {receiverId: userId}]}).sort({createdAt: -1}).populate("receiverId", "firstname lastname").populate("userId", "firstname lastname")
        return res.json({transactions})
    } catch (error) {
        console.log("error is:",err);
        res.status(500).json({ success: false, message: "Some Server Error while fetching transactions" });
    }
})


module.exports = accountrouter