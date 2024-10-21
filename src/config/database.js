const mongoose = require("mongoose")

const connectDb = async (connString) =>{
    await mongoose.connect(connString);
}
module.exports = connectDb