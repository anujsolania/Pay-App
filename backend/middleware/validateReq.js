const { jwt } = require("../jwt/jwt")

function validateReq(req,res,next) {
    const username = req.body.username

    const token = jwt.sign({username},jwtkey)
    res.json({ message: `User signedin succesfully as ${username}`,token })
}