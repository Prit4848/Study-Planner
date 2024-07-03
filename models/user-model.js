const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      phone_no:{
        type: Number,
        unique: true,
        trim: true
      },
      password: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      image:{
      type:  Buffer,
      require:true
      },
      Background_image:{
        type:  Buffer,
        require:true
        },
      Bio:String,
})

module.exports = mongoose.model("user",userSchema)