const express = require("express")
const cors = require("cors")
const Router = require("./routes")
const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/v1", Router)

app.use((err,req,res,next)=> {
    return res.json({
        err: err.message
    })
})
    
app.listen(3000)