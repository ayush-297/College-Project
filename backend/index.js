import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
// import bodyParser from "body-parser"

// const cors = require("cors")
// const mongoose = require("mongoose")
// const dotenv = require("dotenv")
// const bodyParser = require("body-parser")
// const Routes = require("./routes/route.js")


import Routes from "./routes/route.js"

const app = express()
const PORT = process.env.PORT || 5000

dotenv.config();

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: '10mb' }))
app.use(cors())

mongoose
    .connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`)
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})