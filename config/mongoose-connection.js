
const config = require("config")
const dbgr = require("debug")("development:mongoose")


const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(`${config.get("MONGODB_URI")}/webapp`)
  .then(() => {
    dbgr("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Export the mongoose connection
module.exports = mongoose.connection;