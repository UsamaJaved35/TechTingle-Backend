const mongoose = require("mongoose")
const connectionRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
        required: true,
    }
});
connectionRequestSchema.index({ first: 1, last: -1 }, { unique: true })

connectionRequestSchema.pre("save", async function (next) {
    const sender = await mongoose.model("User").findById(this.sender)
    const receiver = await mongoose.model("User").findById(this.receiver)
    if(!sender || !receiver) return next(new Error("User not found"))
    if(sender.connections.includes(receiver._id) || receiver.connections.includes(sender._id)) return next(new Error("Already connected"))
    if(sender._id.equals(receiver._id)) return next(new Error("You can't connect yourself"))
    next()
})

const connectionRequest = mongoose.model("connectionRequest", connectionRequestSchema)
module.exports = connectionRequest