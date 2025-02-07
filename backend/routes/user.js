const express = require("express")
const validateUser = require("../middleware/validateUser")
const userrouter = express.Router()


//SIGNUP
userrouter.post("/signup",validateUser, async(req,res) => {

    try {
        const result = await User.findOne({username})
        if (result) {
            return res.json({mssg : "User with this username already exists"})
        } else {
            await User.create({
                username: req.body.username,
                password: req.body.password})
            return res.json({mssg: "User created successfully"})
        } 
    } catch (error) {
        return res.json({mssg: "Error while creating user"})
    }

})

//SIGNIN
userrouter.post("/signin",validateUser, async(req,res) => {
    const {username, password} = req.body

    try {
        const result = await User.findOne({username,password})
        if (result) {
            return res.json({mssg: "Logged IN successfully"})
        } else if (!result) {
            return res.json({mssg: "User doesn't exists"})
        }
    } catch (error) {
        return res.json({mssg: "Error while LoggingIN"})
    }
})

//UPDATE INFO(USERNAME,PASS,)
userrouter.patch("/updateinfo", async (req,res) => {
    const newusername = req.body.username
    const newpassword = req.body.password

    try {
        const result = await User.findOne({username})
    } catch (error) {
        
    }
})

module.exports = userrouter