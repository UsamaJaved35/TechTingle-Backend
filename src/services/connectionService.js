const { UserModel } = require('../models/user');
const connectionRequest = require('../models/connectionRequest');
const mongoose = require('mongoose');

const createConnectionRequest = async (sender, receiverId) => {
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
            status: 'pending',
        });

        if (existingRequest) throw new Error("Connection request already sent");

        receiver.connections.push(sender._id);
        sender.connections.push(receiver._id);

        await Promise.all([
            receiver.save({ session }),
            sender.save({ session }),
        ]);

        const newConnectionRequest = new connectionRequest({
            sender: sender._id,
            receiver: receiver._id,
            status: 'pending',
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

module.exports = {
    createConnectionRequest,
};