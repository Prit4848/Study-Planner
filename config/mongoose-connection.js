
const dbgr = require("debug")("development:mongoose")


const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(`${process.env.Mongodb_uri}/webapp`)
  .then(() => {
    dbgr("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Export the mongoose connection
module.exports = mongoose.connection;
