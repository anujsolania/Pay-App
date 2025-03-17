const express = require("express")
const bcrypt = require("bcrypt")
const {validateUser, signupSchema, signinSchema, updateinfoSchema} = require("../middleware/validateUser")
const { jwt, jwtkey } = require("../jwt/jwt")
const validateReq = require("../middleware/validateReq")
const { User, Account } = require("../db/mongoose")
const userrouter = express.Router()


//SIGNUP
userrouter.post("/signup",validateUser(signupSchema), async(req,res) => {
    const {firstname,lastname,email,password} = req.body

    const hashedPass = await bcrypt.hash(password, 10)

    try {
        const result = await User.findOne({email})
        if (result) {
            return res.json({mssg : "User with this username already exists"})
        } else {
            const user = await User.create({
                firstname,
                lastname,
                email,
                password: hashedPass})
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
    
    const user = await User.findOne({email})
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    try {
        const userId = user._id
        const token = jwt.sign({userId},jwtkey,{ expiresIn: "1h" })
        return res.status(200).json({mssg: `Logged IN successfully as ${user.firstname}`,token: token})
    } catch (error) {
        return res.json({mssg: "error while logginIN",error})
    }

})

//UPDATE INFO(USERNAME,PASS,)
userrouter.patch("/updateinfo",validateUser(updateinfoSchema), validateReq, async (req,res) => {
    const {newfirstname,newlastname,newemail,newpassword}= req.body
    
    const updateFields = {};

    // Only add fields to update if they are not undefined or empty
    if (newfirstname) updateFields.firstname = newfirstname;
    if (newlastname) updateFields.lastname = newlastname;
    if (newemail) updateFields.email = newemail;
    if (newpassword) {
        const hashedPass = await bcrypt.hash(newpassword, 10)
        updateFields.password = hashedPass;
    } 

    if (Object.keys(updateFields).length === 0) {
        return res.json({mssg: "No input received"})
    }

    const userId = req.userId

    try {

        const existingUser = await User.findOne({$or: [
            { firstname: newfirstname },
            { lastname: newlastname },
            { email: newemail },
        ]})

        if (existingUser) {
            if (newfirstname == existingUser.firstname) {
                return res.json({mssg: "Firstname already taken. Choose another"})
            }
            if (newlastname == existingUser.lastname) {
                return res.json({mssg: "Lastname already taken. Choose another"})
            }
            if (newemail == existingUser.newemail) {
                return res.json({mssg: "Email already taken. Choose another"})
            }
        }

        await User.findByIdAndUpdate(userId, {$set: updateFields})
        return res.json({mssg: "Updated successfully"})

    } catch (error) {
        return res.json({mssg: "Error while updating",error: error.message})
    }
})

//SEARCH USER
userrouter.get("/bulk",validateReq, async (req,res) => {
    const filter = req.query.filter

    try {

        if (!filter) {
            const allusers = await User.find({_id: {$ne: req.userId}})
            return res.json({ allusers });
        }

        const result = await User.find({firstname: {$regex: filter, $options: "i"}})
        if (result.length === 0) {
            return res.status(200).json({mssg: "No matching user found"})
        }
        return res.status(200).json({users: result})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error occurred while fetching users" });
    }

})

module.exports = userrouter