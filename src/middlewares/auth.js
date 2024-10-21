const jwt = require('jsonwebtoken');
const {UserModel} = require('../models/user');

const userAuth = async (req, res, next) => {
    const token = req.cookies.token
    if(!token) return res.status(401).send({message: "Please login first"})
    jwt.verify(token, "secret", async (err, decoded)=>{
        if(err) return res.status(401).send({message: "Please login first"})
        if(!decoded.id) return res.status(401).send({message: "Please login first"})
        const {id} = decoded
        const user = await UserModel.findById(id)
        if(!user) return res.status(404).send({message: "User not found"})
        req.user = user
        next()
    })
}

module.exports = {userAuth}
