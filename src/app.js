const express = require("express")
const connectDb = require("./config/database")
require('dotenv').config()
const db=require('./config/config').get(process.env.NODE_ENV);
const cookieParser = require('cookie-parser')
const authRouter = require("./routers/auth")
const profileRouter = require("./routers/profile")
const requestRouter = require("./routers/request")
const userRouter = require('./routers/user')
const app = express()
const cors = require("cors")

app.use(cors(
    {
        origin: process.env.ORIGIN_URL ||  "http://localhost:5173" ,
        credentials:true
    }
))
app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRouter)
app.use("/", profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)

connectDb(db.DATABASE,app)
//.then(()=>{
//     console.log("Connected to DB");
//     app.listen(7777,()=>{
//         console.log("Connected to server");
//     })
// }).catch(()=>{
//     console.log("DB is not connected");
//})