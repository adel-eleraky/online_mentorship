import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config({ path: ".env" })
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use((err, req, res, next) => {

    return res.status(409).json({
        status: "fail",
        message: err.message
    })
})



mongoose.connect("mongodb://127.0.0.1:27017/mentorship")
    .then(conn => {
        console.log("DB connected Successfully")

        const port = process.env.PORT || 3000
        const server = app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })
    })