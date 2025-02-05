const express = require("express")
const router = express.Router()
const { User } = require("./db/mongoose")
const z = require("zod")

const zodschema = z.object({
    username: z.string().unique().min(2),
    password: z.string().min(6)
})

//SIGNUP
router.post("/signup", async(req,res) => {
    const {username, password} = req.body

    if ((!username) && (!password)) {
        return res.json({mssg : "Enter username and pasword"})
    } else if (!username) {
        return res.json({mssg : "Enter username"})
    } else if (!password) {
        return res.json({mssg : "Enter username"})
    }

    try {
        const result = await User.findOne({username})
        if (result) {
            return res.json({mssg : "User with this username already exists"})
        } else {
            await User.create({username: username,password: password})
            return res.json({mssg: "User created successfully"})
        } 
    } catch (error) {
        return res.json({mssg: "Error while creating user"})
    }

})

//SIGNIN
router.post("/signin", async(req,res) => {
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
router.patch("/updateinfo", async (req,res) => {
    const newusername = req.body.username
    const newpassword = req.body.password

    try {
        const result = await User.findOne({username})
    } catch (error) {
        
    }


})

module.exports = router
