const express = require("express")
const validateReq = require("../middleware/validateReq")
const { User, Account } = require("../db/mongoose")
const mongoose = require("mongoose")
const accountrouter = express.Router()

accountrouter.get("/balance",validateReq, async (req,res) => {
    const userId = req.userId

    try {
        const account = await Account.findOne({userId})
        return res.status(200).json({balance: account.balance})
    } catch (error) {
        return res.json({mssg: "Error while fetching balance"})
    }
})

accountrouter.patch("/transfer",validateReq, async (req,res) => {
    const senderId = req.userId
    const {receiverId,amount} = req.body

    if (!receiverId || !amount) {
        return res.json({mssg : "Missing required fields"})
    }

    try {

    const session = await mongoose.startSession() //start session
    session.startTransaction()  //start transaction

    const senderAcc = await Account.findOne({userId: senderId}).session(session);
    const receiverAcc = await Account.findOne({userId: receiverId}).session(session);

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
    await Account.updateOne({userId: receiverId},{$inc: {balance: amount}}).session(session)  //part of session

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