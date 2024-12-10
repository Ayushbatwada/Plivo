const mongoose = require('mongoose');
const userSchema = require('../userModel');

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    createdBy: {
        type: userSchema,
        required: true
    },

    status: {
        type: String,
        default: 'active'
    },
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
