const mongoose = require("mongoose")

// const connectDb = async (connString) =>{
//     await mongoose.connect(connString);
// }
// module.exports = connectDb

const connectDb = (connString,app) => {
  mongoose.connect(connString)
    .then(() => {
      console.log('Connected to DB');
      app.listen(7777,()=>{
                console.log("Connected to server");
            })
    })
    .catch((err) => {
      console.error('Failed to connect to DB, retrying in 5 seconds...', err);
      setTimeout(connectDb, 5000); // Retry after 5 seconds
    });
};

module.exports = connectDb