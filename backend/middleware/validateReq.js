const { jwt, jwtkey } = require("../jwt/jwt")

function validateReq(req,res,next) {
    const token = req.headers.authorization

    if (!token) {
        return res.json({mssg: "Signup/Signin first"})
    }
    try {
        const verified = jwt.verify(token,jwtkey) 

        req.userId = verified.userId
        next()
    } catch (error) {  //throws error if not verified
        res.status(403).json({mssg: "INVALID TOKEN",error: error.message})
    }
}

module.exports = validateReq