const mongoose = require("mongoose")

require("dotenv").config()
mongoose.connect(`${process.env.MONGO_URL}`)
.then(() => {console.log("connected to mongoDB")})
.catch((error) => {console.error("connection error", error)})

const userSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname : {type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
})

const accountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user",required: true },
    balance: { type:Number, required: true }
})

const User = mongoose.model("user",userSchema)
const Account = mongoose.model("account",accountSchema)

module.exports = { User,Account } 