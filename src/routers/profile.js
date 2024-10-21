const express = require('express')
const profileRouter = express.Router()
const {userAuth} = require('../middlewares/auth')
const {UserModel} = require('../models/user')

profileRouter.get('/profile',userAuth, async (req,res)=>{
    const user = req.user
    res.status(200).send({message: "User Profile", user: user})
})

profileRouter.get('/users',userAuth, async (req,res)=>{
    try{
        const users = await UserModel.find()
        res.status(200).send(users)
    }
    catch(err){
        res.status(500).send({error:err.message, message: "Something went wrong!!"})
    }
})

profileRouter.get('/profile/:id',userAuth, async (req,res)=>{
    try{
        const {id} = req.params
        const user = await UserModel.findById(id)
        if(!user) return res.status(404).send({message: "User not found"})
        res.status(200).json({user: user})
    }
    catch(err){
        res.status(500).send({error:err.message, message: "Something went wrong!!"})
    }
})

profileRouter.patch('/user/:id',userAuth, async (req,res)=>{
    try{
        const {id} = req.params
        const {firstName, lastName, password, gender, photoUrl, skills} = req.body
        const user = await UserModel.findByIdAndUpdate(id, {firstName, lastName, password, gender, photoUrl, skills},
            { new: true, runValidators: true }
        )
        if(!user) return res.status(404).send({message: "User not found"})
        res.status(200).send({user:user , message: "User updated Successfully"})
    }
    catch(err){
        res.status(500).send({error:err.message, message: "Something went wrong!!"})
    }
})

profileRouter.delete('/user/:id',userAuth, async (req,res)=>{
    try{
        const {id} = req.params
        const user = await UserModel.findByIdAndDelete(id)
        if(!user) return res.status(404).send({message: "User not found"})
        res.status(200).send({user:user , message: "User deleted Successfully"})
    }
    catch(err){
        res.status(500).send({error:err.message, message: "Something went wrong!!"})
    }
})

module.exports = profileRouter