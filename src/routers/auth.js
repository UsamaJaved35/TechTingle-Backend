const express = require('express')
const authRouter = express.Router()
const bcrypt = require('bcrypt')
const {UserModel} = require("../models/user")
const REQUIRED_FIELDS = ['_id','firstName', 'lastName', 'age', 'gender', 'email', 'photoUrl', 'skills','about'];

authRouter.post('/signup', async (req,res)=>{
    try{
        const {firstName, lastName, password, age, gender, email, photoUrl, skills , about} = req.body
        const userExists = await UserModel.findOne({email})
        if(userExists) return res.status(400).send({message: "User already exists"})
        const user = new UserModel({firstName, lastName, password, age, gender, email, photoUrl, skills, about})
        const savedUser =  await user.save()
        if(!savedUser) return res.status(500).send({message: "Something went wrong!!"})
        const token = savedUser.getJWT()
        const userObj = savedUser.toObject()
        const userWithoutPassword = {}
        REQUIRED_FIELDS.forEach(field => {
            userWithoutPassword[field] = userObj[field]
        })        
        res.cookie("token", token,{ secure: true, sameSite: 'None'}).status(200).send({user: userWithoutPassword, message: "User created Successfully"})
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
        const userObj = user.toObject()
        const userWithoutPassword = {}
        REQUIRED_FIELDS.forEach(field => {
            userWithoutPassword[field] = userObj[field]
        })        
        res.cookie("token", token,{ secure: true, sameSite: 'None'}).status(200).send({user: userWithoutPassword, message: "User logged in Successfully"})
    }
    catch(err){
        res.status(500).send({error:err.message, message: "Something went wrong!!"})
    }
})

authRouter.post('/logout', async (req,res)=>{
    try{
        res.cookie("token", null, {
            httpOnly: true,
            expires: new Date(Date.now()),      // Expire immediately
            sameSite: "None",          // Required for cross-origin
            secure: true               // Required if you're using HTTPS
        }).status(200).send({ message: "User logged out Successfully" });
    }
    catch(err){
        res.status(500).send({error:err.message, message: "Something went wrong!!"})
    }
})

module.exports = authRouter