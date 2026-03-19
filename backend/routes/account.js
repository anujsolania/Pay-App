const express = require("express");
const validateReq = require("../middleware/validateReq");
const { User, Account, Transaction } = require("../db/mongoose");

const accountrouter = express.Router();
const crypto = require("crypto");
const razorpay = require("../razorpay/razorpayInstance");
const { verifyWebhookSignature } = require("../utils/verifyWebhookSignature");
const { default: mongoose, Mongoose } = require("mongoose");

accountrouter.get("/receiverdetails/:userId", validateReq, async (req, res) => {
  const userId = req.params.userId;

  try {
    const receiver = await User.findById(userId);
    const name = receiver.firstname + " " + receiver.lastname;

    return res.status(200).json({ name });
  } catch (error) {
    return res.json({ mssg: "Error while fetching receivers details", error });
  }
});

accountrouter.get("/balance", validateReq, async (req, res) => {
  const userId = req.userId;

  try {
    //General case - expiring all pending transactions (if > 15 mins)
    await Transaction.updateMany(
      {
        status: "PENDING",
        createdAt: { $lt: new Date(Date.now() - 15 * 60 * 1000) },
      },
      { status: "EXPIRED" }
    );

    const account = await Account.findOne({ userId: req.userId }).populate(
      "userId"
    );
    const balance = account.balance;
    const firstname = account.userId.firstname;
    const lastname = account.userId.lastname;

    return res.status(200).json({ balance, firstname, lastname });
  } catch (error) {
    return res.json({ mssg: "Error while fetching balance" });
  }
});

accountrouter.post("/add-money", validateReq, async (req, res) => {
  const userId = req.userId;
  const { amount } = req.body;

  try {
    if (!amount || amount <= 0 || amount < 1) {
      return res.json({ success: false, message: "Invalid amount" });
    }
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `u_${userId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    //expires previous pending add money transactions of the user
    await Transaction.updateMany(
      { userId: userId, type: "ADD_MONEY", status: "PENDING" },
      { status: "EXPIRED" }
    );

    await Transaction.create({
      userId: userId,
      amount: amount,
      orderId: order.id,
      type: "ADD_MONEY",
      status: "PENDING",
    });

    // return res.json({
    //   success: true,
    //   orderId: order.id,
    //   amount: order.amount, // already in paise
    //   key: process.env.RAZORPAY_KEY_ID,
    // });

    return res.json({
      order: order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.log("error is:", err);
    res
      .status(500)
      .json({ success: false, message: "Some Server Error while addmoney" });
  }
});

accountrouter.post("/verify-payment", validateReq, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid signature" });
    }

    const txn = await Transaction.findOne({ orderId: razorpay_order_id });

    if (!txn) {
      return res.json({ success: false, message: "Transaction not found" });
    }

    await Transaction.updateOne(
      { orderId: razorpay_order_id },
      { status: "VERIFYING", rzpPaymentId: razorpay_payment_id }
    );

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

accountrouter.patch("/transfer", validateReq, async (req, res) => {
  const senderId = req.userId;
  const { rId, amount } = req.body;

  if (!rId || !amount) {
    return res.json({ mssg: "Missing required fields" });
  }

  try {
    const receiver = await User.findById(rId);
    if (!receiver) {
      return res.json({ mssg: "Receiver does not exist" });
    }

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
      status: "PENDING",
    });

    return res.json({
      order: order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log("error is:", error);
    res.status(500).json({
      success: false,
      message: "Some Server Error while transfer money",
    });
  }
});

accountrouter.post("/payment-cancel", validateReq, async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.json({ mssg: "Missing orderId" });
  }

  try {
    await Transaction.updateOne(
      { orderId: orderId, userId: req.userId, status: "PENDING" },
      { status: "FAILED" }
    );
    return res.json({ mssg: "Payment cancelled" });
  } catch (error) {
    console.log("error is:", error);
    res.status(500).json({
      success: false,
      message: "Some Server Error while cancelling payment",
    });
  }
});

accountrouter.get("/transactions", validateReq, async (req, res) => {
  const userId = req.userId;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const skip = (page - 1) * limit;

  try {
    const transactions = await Transaction.find({
      $or: [{ userId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("receiverId", "firstname lastname")
      .populate("userId", "firstname lastname");
    return res.json({
      transactions,
      hasMore: transactions.length === limit,
    });
  } catch (error) {
    console.log("error is:", error);
    res.status(500).json({
      success: false,
      message: "Some Server Error while fetching transactions",
    });
  }
});

//WEBHOOK
accountrouter.post("/payment/webhook", async (req, res) => {
  try {
    const verified = verifyWebhookSignature(req);

    if (!verified) {
      return res.status(400).send("Invalid Signature");
    }

    const body = JSON.parse(req.body.toString());

    console.log("rzpJSONBody-webhook", body);

    const paymentId = body.payload.payment.entity.id;
    const orderId = body.payload.payment.entity.order_id;
    const status = body.payload.payment.entity.status;

    const txn = await Transaction.findOne({ orderId });

    if (!txn) {
      return res.status(200).send("Txn not found");
    }

    const updateTxn = await Transaction.findOneAndUpdate(
      {
        orderId: orderId,
        credited: false,
      },
      {
        $set: {
          status: "SUCCESS",
          credited: true,
          rzpPaymentId: paymentId,
        },
      },
      { new: true }
    );

    //ATOMICITY - only one will process either webhook or cron
    if (updateTxn && status == "captured") {
      if (updateTxn.type == "ADD_MONEY") {
        await Account.updateOne(
          { userId: txn.userId },
          { $inc: { balance: txn.amount } }
        );
      }

      if (updateTxn.type == "TRANSFER") {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          await Account.updateOne(
            { userId: updateTxn.userId },
            { $inc: { balance: -updateTxn.amount } }
          ).session(session);

          await Account.updateOne(
            { userId: txn.receiverId },
            { $inc: { balance: updateTxn.amount } }
          ).session(session);

          await session.commitTransaction();
          session.endSession();
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          console.error(error);
          return res.status(500).send("Error while money transfer via webhook");
        }
      }
    }

    if (status == "failed") {
      await Transaction.updateOne(
        { orderId: orderId, status: { $ne: "SUCCESS" } },
        { status: "FAILED", rzpPaymentId: paymentId }
      );
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error");
  }
});

module.exports = accountrouter;
