const { error } = require("console")
const mongoose = require("mongoose")
const { type } = require("os")
const { Schema } = require("zod")

mongoose.connect("anujsolania:scam2022@cluster0.kvu08ja.mongodb.net/Pay-App")
.then(() => {console.log("connected to mongoDB")})
.catch(() => {console.error("connection error", error)})

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    account : { type: Schema.Types.ObjectId, ref: "Account" }
})

const accountSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User",required: true },
    balance: { type:Number, required: true }
})

const User = mongoose.model("user",userSchema)
const Account = mongoose.model("account",accountSchema)

module.exports = { User,Account } 