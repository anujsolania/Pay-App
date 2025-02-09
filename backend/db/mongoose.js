
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://anujsolania:scam2022@cluster0.kvu08ja.mongodb.net/Pay-App")
.then(() => {console.log("connected to mongoDB")})
.catch((error) => {console.error("connection error", error)})

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true}
})

const accountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User",required: true },
    balance: { type:Number, required: true }
})

const User = mongoose.model("user",userSchema)
const Account = mongoose.model("account",accountSchema)

module.exports = { User,Account } 