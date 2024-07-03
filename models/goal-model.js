const mongoose = require("mongoose")


const goalSchema = new mongoose.Schema({
    goalTitle: {
        type: String,
        required: true,
        trim: true,
    },
    goalDescription: {
        type: String,
        required: true,
        trim: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("goal",goalSchema)