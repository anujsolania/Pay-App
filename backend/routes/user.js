const express = require("express")
const validateUser = require("../middleware/validateUser")
const { jwt, jwtkey } = require("../jwt/jwt")
const validateReq = require("../middleware/validateReq")
const { User, Account } = require("../db/mongoose")
const userrouter = express.Router()


//SIGNUP
userrouter.post("/signup",validateUser, async(req,res) => {
    const {firstname,lastname,email,password} = req.body


    try {
        const result = await User.findOne({email})
        if (result) {
            return res.json({mssg : "User with this username already exists"})
        } else {
            const user = await User.create({
                firstname,
                lastname,
                email,
                password})
            const userId = user._id

            await Account.create({
                userId: userId,
                balance: Math.round(1 + Math.random() * 10000)
            })

            const token = jwt.sign({userId},jwtkey,{ expiresIn: "1h" })
            return res.json({mssg: "User created successfully",token: token})
        } 
    } catch (error) {
        return res.json({mssg: "Error while creating user"})
    }

})

//SIGNIN
userrouter.post("/signin",validateUser, async(req,res) => {
    const {email, password} = req.body
    
    const user = await User.findOne({email,password})
    const userId = user._id

    if (user) {
        const token = jwt.sign({userId},jwtkey,{ expiresIn: "1h" })
        return res.json({mssg: `Logged IN successfully as${user.firstname}`,token: token})
    } else if (!user) {
        return res.json({mssg: "User doesn't exists"})
    }
})

//UPDATE INFO(USERNAME,PASS,)
userrouter.patch("/updateinfo",validateReq, async (req,res) => {
    const {newemail,newpassword}= req.body

    const userId = req.userId

    try {

        const existingUser = await User.findOne({email: newemail})
        if (existingUser) {
            return res.json({mssg: "Username already taken. Choose another"})
        }
        if (newemail && newpassword) {
            await User.findByIdAndUpdate(userId,{$set: {email: newemail, password: newpassword}})
            return res.json({mssg: "Username & password updated"})

        } 
        if (newemail && !newpassword) {
            await User.findByIdAndUpdate(userId,{$set: {email: newemail}})
            return res.json({mssg: "Username updated"})

        } 
        if (!newemail && newpassword) {
            await User.findByIdAndUpdate(userId,{$set: {email: newemail}})
            return res.json({mssg: "Password updated"})
        }
    } catch (error) {
        return res.json({mssg: "Error while updating",error: error.message})
    }
})

//SEARCH USER
userrouter.get("/bulk", validateReq, async (req,res) => {
    const filter = req.query.filter

    try {
        const result = await User.find({firstname: filter})
        if (result.length === 0) {
            return res.json({ mssg: "No users found with the given username." });
        }
        return res.status(200).json({users: result})
    } catch (error) {
        return res.status(500).json({ error: "Error occurred while fetching users" });
    }

})

module.exports = userrouter