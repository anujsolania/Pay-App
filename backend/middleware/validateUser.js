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
            const errors = result.error.issues.map(issue => {
                // Customize error message for clarity
                return `${issue.path[0]} is ${issue.message}`; // e.g., "email is Required"
            });
        } 
        next()
    }
}

module.exports = {signupSchema, signinSchema,validateUser}