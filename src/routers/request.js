const express = require('express')
const requestRouter = express.Router()
const {userAuth} = require('../middlewares/auth')
const {sendConnectionRequest,reviewConnectionRequest} = require('../controllers/connectionController');

requestRouter.post('/sendConnection/:status/:receiverId',userAuth,sendConnectionRequest)
requestRouter.post('/review/:status/:requestId',userAuth,reviewConnectionRequest)
module.exports = requestRouter