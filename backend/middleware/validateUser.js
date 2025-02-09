const z = require("zod")

function validateUser(req,res,next) {

    const zodSchema = z.object({
        username: z.string().min(2,{message: "Username must be at least 3 characters long"}),
        password: z.string().min(6,{message: "Password must be at least 6 characters long"} )
    })

    const result = zodSchema.safeParse(req.body)

    if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message)
        return res.status(400).json({error: errors[0]})
    } 
    next()
}

module.exports = validateUser