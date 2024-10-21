const connectionService = require('../services/connectionService');

const sendConnectionRequest = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const sender = req.user;

        await connectionService.createConnectionRequest(sender, receiverId);
        res.status(200).send({ message: "Connection Request Sent" });
    } catch (err) {
        res.status(500).send({ error: err.message, message: "Something went wrong!" });
    }
};

module.exports = {
    sendConnectionRequest,
};
