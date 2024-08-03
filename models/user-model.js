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
        type: String,
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
      
      },
      Background_image:{
        type:  Buffer, 
        },
      Bio:String,
      streak: {
        type: Number,
        default: 0
      },
      lastPlanDate: {
        type: Date,
      }
})

module.exports = mongoose.model("user",userSchema)