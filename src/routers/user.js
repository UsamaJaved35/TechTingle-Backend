const express = require('express')
const { userAuth } = require('../middlewares/auth')
const connectionRequest = require('../models/connectionRequest')
const { UserModel } = require('../models/user')
const userRouter = express.Router()

const REQUIRED_FIELDS = ['firstName', 'lastName', 'age', 'gender', 'email', 'photoUrl', 'skills','about'];
userRouter.get('/user/requests/received',userAuth, async (req,res)=>{

    try{
        const loggedInUser = req.user
        const requests = await connectionRequest.find({
            receiver:loggedInUser._id,
            status: "interested"
        }).populate('sender',REQUIRED_FIELDS)    
        res.status(200).send({data: requests, message: "Received Requests fetched Successfully"})
    }
    catch(err){
        res.status(500).send({error:err.message, message: "Something went wrong!!"})
    }
})

userRouter.get('/user/connections',userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user
        const connections = await connectionRequest.find({
            $or: [
                { sender: loggedInUser._id, status: "accepted"},
                { receiver: loggedInUser._id, status: "accepted"},
            ],
        }).populate('sender',REQUIRED_FIELDS).populate('receiver',REQUIRED_FIELDS)

        const connectionsData = connections.map(connection => {
            if(connection.sender._id.toString() === loggedInUser._id.toString()){
                return connection.receiver
            }
            return connection.sender
        })
        res.status(200).send({connections: connectionsData, message: "Connections fetched Successfully"})
    }
    catch(err){
        res.status(500).send({error:err.message, message: "Something went wrong!!"})
    }  
})

userRouter.get('/user/feed',userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit
        limit = limit > 50 ? 50 : limit
        const connections = await connectionRequest.find({
            $or: [
                { sender: loggedInUser._id},{ receiver: loggedInUser._id},
            ],
        }).select("sender receiver")

        const hiddenUsers = new Set()
        connections.forEach(connection => {
           hiddenUsers.add(connection.sender.toString())
           hiddenUsers.add(connection.receiver.toString())
        })

        const users = await UserModel.find({
            $and: [
                {_id:{$ne: loggedInUser._id}},
                {_id:{$nin: Array.from(hiddenUsers)}},
            ]
        }).select(REQUIRED_FIELDS).skip(skip).limit(limit)
        res.status(200).send({users: users, message: "Users fetched Successfully"})
    }
    catch(err){
        res.status(500).send({error:err.message, message: "Something went wrong!!"})
    }
})

module.exports = userRouter