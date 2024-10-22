const { UserModel } = require('../models/user');
const connectionRequest = require('../models/connectionRequest');
const mongoose = require('mongoose');

const createConnectionRequest = async (sender, receiverId, status) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const receiver = await UserModel.findById(receiverId);
        if (!receiver) throw new Error("Receiver not found");

        if (receiver.connections.includes(sender._id) || sender.connections.includes(receiver._id)) {
            throw new Error("Already connected");
        }

        const existingRequest = await connectionRequest.findOne({
            sender: sender._id,
            receiver: receiver._id,
        });

        if (existingRequest) throw new Error("Connection request already sent");

        const newConnectionRequest = new connectionRequest({
            sender: sender._id,
            receiver: receiver._id,
            status: status,
        });

        await newConnectionRequest.save({ session });
        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};

const reviewConnectionRequest = async (loggedInUser, requestId, status) => {
    try {
        const request = await connectionRequest.findOne({
            _id: requestId,
            receiver: loggedInUser._id,
            status: "interested",
        }).populate('sender','connections');
        if (!request) throw new Error("Connection request not found");
        request.status = status;
        if (status === "accepted") {
            loggedInUser.connections.push(request.sender._id);
            request.sender.connections.push(loggedInUser._id);
        }
        const data = await request.save();
        await loggedInUser.save();
        await request.sender.save();

        if (status === "rejected") {
            await connectionRequest.deleteOne({ _id: requestId });
        }
        return data;
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    createConnectionRequest,
    reviewConnectionRequest
};