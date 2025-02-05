const { error } = require("console")
const mongoose = require("mongoose")

mongoose.connect("anujsolania:scam2022@cluster0.kvu08ja.mongodb.net/Pay-App")
.then(() => {console.log("connected to mongoDB")})
.catch(() => {console.error("connection error", error)})

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
})

const User = mongoose.model("user",userSchema)

module.exports = { User } 