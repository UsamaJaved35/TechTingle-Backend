const express = require('express')
const requestRouter = express.Router()
const {userAuth} = require('../middlewares/auth')
const {sendConnectionRequest} = require('../controllers/connectionController');

requestRouter.post('/sendConnection/:status/:receiverId',userAuth,sendConnectionRequest)
module.exports = requestRouter