const connectionService = require('../services/connectionService');

const sendConnectionRequest = async (req, res) => {
    try {
        const { status , receiverId } = req.params;
        allowedStatuses = ["interested","ignored"]
        if(!allowedStatuses.includes(status)) return res.status(400).send({ message: "Invalid Status" });
        const sender = req.user;

        await connectionService.createConnectionRequest(sender, receiverId, status);
        res.status(200).send({ message: "Connection Request Sent" });
    } catch (err) {
        res.status(500).send({ error: err.message, message: "Something went wrong!" });
    }
};

module.exports = {
    sendConnectionRequest,
};
