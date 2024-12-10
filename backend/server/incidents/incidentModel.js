const mongoose = require('mongoose');
const userSchema = require("../userModel");

const IncidentSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Open'
    },

    createdBy: {
        type: userSchema,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Incident', IncidentSchema);
