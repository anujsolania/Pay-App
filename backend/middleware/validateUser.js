const z = require("zod")

const signupSchema = z.object({
    firstname: z.string().trim().min(3,{message: "Firstname must be atleast 3 characters long"}),
    lastname: z.string().trim().min(3,{message: "Lastname must be atleast 3 characters long"}),
    email: z.string().trim().email({message: "invalid email"}),
    password: z.string().trim().min(6,{message: "Password must be at least 6 characters long"} )
})

const signinSchema = z.object({
    email: z.string().trim().email({message: "invalid email"}),
    password: z.string().trim().min(6,{message: "Password must be at least 6 characters long"} )
})

function validateUser(schema) {
    return function(req,res,next) {
        const result = schema.safeParse(req.body)
        if (!result.success) {
                return res.status(400).json({ error: result.error.errors[0].message });
        } 
        next()
    }
}

module.exports = {signupSchema, signinSchema,validateUser}