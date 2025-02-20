require("dotenv").config()

const jwt = require("jsonwebtoken")
const jwtkey = process.env.JWT_KEY

module.exports = {jwt,jwtkey}
