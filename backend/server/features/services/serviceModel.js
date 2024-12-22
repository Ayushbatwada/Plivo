const mongoose = require('mongoose');
const serviceConfig = require('./serviceConfig.json');
const userSchema = require('../../userModel');

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    category: {
        type: String,
        default: serviceConfig.category.other,
        enum: serviceConfig.category.values
    },

    createdBy: {
        type: userSchema,
        required: true
    },

    status: {
        type: String,
        default: serviceConfig.status.operational,
        enum: serviceConfig.status.values
    },
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema, 'services');
