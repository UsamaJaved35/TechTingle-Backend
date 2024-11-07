const connectionService = require('../services/connectionService');

const sendConnectionRequest = async (req, res) => {
    try {
        const { status , receiverId } = req.params;
        ALLOWED_STATUSES = ["interested","ignored"]
        if(!ALLOWED_STATUSES.includes(status)) return res.status(400).send({ message: "Invalid Status" });
        const sender = req.user;

        await connectionService.createConnectionRequest(sender, receiverId, status);
        res.status(200).send({ message: "Connection Request Sent" });
    } catch (err) {
        res.status(500).send({ error: err.message, message: "Something went wrong!" });
    }
};

const reviewConnectionRequest = async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const ALLOWED_STATUSES = ["accepted","rejected"]
        const {status,requestId} = req.params
        if(!ALLOWED_STATUSES.includes(status)) return res.status(400).send({message: "Invalid Status"})
        const data = await connectionService.reviewConnectionRequest(loggedInUser,requestId,status)
        res.status(200).send({data: data,message: "Connection Request "+ status + " Successfully"})
    }
    catch(err){
        res.status(400).send({error:err.message, message: "Something went wrong!!"})
    }
}

module.exports = {
    sendConnectionRequest,
    reviewConnectionRequest
};
