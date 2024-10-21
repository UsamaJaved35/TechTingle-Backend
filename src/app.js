const express = require("express")
const connectDb = require("./config/database")
const db=require('./config/config').get(process.env.NODE_ENV);
const cookieParser = require('cookie-parser')
const authRouter = require("./routers/auth")
const profileRouter = require("./routers/profile")
const requestRouter = require("./routers/request")
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRouter)
app.use("/", profileRouter)
app.use("/",requestRouter)

connectDb(db.DATABASE).then(()=>{
    console.log("Connected to DB");
    app.listen(7777,()=>{
        console.log("Connected to server");
    })
}).catch(()=>{
    console.log("DB is not connected");
})