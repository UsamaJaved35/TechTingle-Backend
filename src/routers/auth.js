const express = require('express')
const authRouter = express.Router()
const bcrypt = require('bcrypt')
const {UserModel} = require("../models/user")

authRouter.post('/signup', async (req,res)=>{
    try{
        const {firstName, lastName, password, age, gender, email, photoUrl, skills} = req.body
        const passwordHash = await bcrypt.hash(password, 10)
        const userExists = await UserModel.findOne({email})
        if(userExists) return res.status(400).send({message: "User already exists"})
        const user = new UserModel({firstName, lastName, password: passwordHash, age, gender, email, photoUrl, skills})
        await user.save()
        res.status(200).send({message: "User created Successfully"})   
    }
    catch(err){
        res.status(500).send({error:err.message, message: "Something went wrong!!"})
    }
})

authRouter.post('/login', async (req,res)=>{
    try{
        const {email, password} = req.body
        const user = await UserModel.findOne({email})
        if(!user) return res.status(404).send({message: "User not found"})
        const isPasswordValid = await user.validatePassword(password)
        if(!isPasswordValid) return res.status(400).send({message: "Invalid Credentials"})
        const token = user.getJWT()
        res.cookie("token", token).status(200).send({user: user ,message: "User logged in Successfully"})
    }
    catch(err){
        res.status(500).send({error:err.message, message: "Something went wrong!!"})
    }
})

authRouter.post('/logout', async (req,res)=>{
    try{
        res.cookie('token', null , { expires: new Date(Date.now()), httpOnly: true }).status(200).send({message: "User logged out Successfully"})
        // res.clearCookie("token").status(200).send({message: "User logged out Successfully"})
        // res.cookie("token").status(200).send({message: "User logged out Successfully"})
    }
    catch(err){
        res.status(500).send({error:err.message, message: "Something went wrong!!"})
    }
})

module.exports = authRouter