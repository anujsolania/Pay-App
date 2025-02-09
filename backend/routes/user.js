const express = require("express")
const validateUser = require("../middleware/validateUser")
const { jwt, jwtkey } = require("../jwt/jwt")
const validateReq = require("../middleware/validateReq")
const { User, Account } = require("../db/mongoose")
const userrouter = express.Router()


//SIGNUP
userrouter.post("/signup",validateUser, async(req,res) => {
    const username = req.body.username

    try {
        const result = await User.findOne({username})
        if (result) {
            return res.json({mssg : "User with this username already exists"})
        } else {
            const user = await User.create({
                username: req.body.username,
                password: req.body.password})
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
    const {username, password} = req.body
    
    const user = await User.findOne({username,password})
    const userId = user._id

    if (user) {
        const token = jwt.sign({userId},jwtkey,{ expiresIn: "1h" })
        return res.json({mssg: `Logged IN successfully ${username}`,token: token})
    } else if (!user) {
        return res.json({mssg: "User doesn't exists"})
    }
})

//UPDATE INFO(USERNAME,PASS,)
userrouter.patch("/updateinfo",validateReq, async (req,res) => {
    const {newusername,newpassword}= req.body

    const userId = req.userId

    try {

        const existingUser = await User.findOne({username: newusername})
        if (existingUser) {
            return res.json({mssg: "Username already taken. Choose another"})
        }
        if (newusername && newpassword) {
            await User.findByIdAndUpdate(userId,{$set: {username: newusername, password: newpassword}})
            return res.json({mssg: "Username & password updated"})

        } 
        if (newusername && !newpassword) {
            await User.findByIdAndUpdate(userId,{$set: {username: newusername}})
            return res.json({mssg: "Username updated"})

        } 
        if (!newusername && newpassword) {
            await User.findByIdAndUpdate(userId,{$set: {username: newusername}})
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
        const result = await User.find({username: filter})
        if (result.length === 0) {
            return res.json({ mssg: "No users found with the given username." });
        }
        return res.status(200).json({users: result})
    } catch (error) {
        return res.status(500).json({ error: "Error occurred while fetching users" });
    }

})

module.exports = userrouter