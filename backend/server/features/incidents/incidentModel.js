const mongoose = require('mongoose');
const incidentConfig = require('./incidentConfig.json');
const userSchema = require("../../userModel");

const IncidentSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },

    updates: {
        type: Array
    },

    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },

    resoledAt: {
        type: Date,
    },

    // In seconds
    duration: {
        type: Number,
        default: 0
    },

    createdBy: {
        type: userSchema,
        required: true,
    },

    status: {
        type: String,
        default: incidentConfig.status.open,
        enum: incidentConfig.status.values
    },
}, { timestamps: true });

module.exports = mongoose.model('Incident', IncidentSchema, 'incidents');
