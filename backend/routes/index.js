const express = require("express")
const router = express.Router()
const z = require("zod")
const userrouter = require("./user")

router.use("/user", userrouter)



module.exports = router
