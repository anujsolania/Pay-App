const express = require("express")
const router = express.Router()
const z = require("zod")
const userrouter = require("./user")
const accountrouter = require("./account")

router.use("/user", userrouter)
router.use("/account", accountrouter)


module.exports = router
