const z = require("zod")

function validateUser(req,res,next) {

    const zodSchema = z.object({
        firstname: z.string().trim().min(3,{message: "Firstname must be atleast 3 characters long"}),
        lastname: z.string().trim().min(3,{message: "Firstname must be atleast 3 characters long"}),
        email: z.string().trim().email({message: "invalid email"}),
        password: z.string().trim().min(6,{message: "Password must be at least 6 characters long"} )
    })

    const result = zodSchema.safeParse(req.body)

    if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message)
        return res.status(400).json({error: errors[0]})
    } 
    next()
}

module.exports = validateUser