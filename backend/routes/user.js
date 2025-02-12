const express = require("express")
const {validateUser, signupSchema, signinSchema} = require("../middleware/validateUser")
const { jwt, jwtkey } = require("../jwt/jwt")
const validateReq = require("../middleware/validateReq")
const { User, Account } = require("../db/mongoose")
const userrouter = express.Router()


//SIGNUP
userrouter.post("/signup",validateUser(signupSchema), async(req,res) => {
    const {firstname,lastname,email,password} = req.body

    console.log(firstname,lastname,email,password)
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
        return res.json({mssg: "Error while creating user",error})
    }

})

//SIGNIN
userrouter.post("/signin",validateUser(signinSchema), async(req,res) => {
    const {email, password} = req.body
    console.log(email)
    
    const user = await User.findOne({email})

    try {
        if (user) {
            const userId = user._id
            const token = jwt.sign({userId},jwtkey,{ expiresIn: "1h" })
            return res.json({mssg: `Logged IN successfully as${user.firstname}`,token: token})
        } else if (!user) {
            return res.json({mssg: "User doesn't exists"})
        }
    } catch (error) {
        return res.json({mssg: "error while logginIN",error})
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
userrouter.get("/bulk",validateReq, async (req,res) => {
    const filter = req.query.filter

    try {
        if (!filter) {
            const allusers = await User.find({})
            return res.json({ allusers });
        }

        const result = await User.find({firstname: filter})
        if (result.length === 0) {
            return res.status(200).json({mssg: "No matching user found"})
        }
        return res.status(200).json({users: result})
    } catch (error) {
        return res.status(500).json({ error: "Error occurred while fetching users" });
    }

})

module.exports = userrouter