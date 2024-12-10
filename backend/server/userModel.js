const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: false,
    userName: {
        type: String,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
});

module.exports = userSchema
