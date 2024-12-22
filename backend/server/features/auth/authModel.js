const mongoose = require('mongoose');

const authConfig = require('./authConfig.json');

const authSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    roles: {
        type: Array,
        default: [authConfig.roles.user]
    },

    status: {
        type: String,
        default: authConfig.status.active,
        enum: authConfig.status.values
    },
},{
        timestamps: true
    });

module.exports = mongoose.model('AuthSchema', authSchema, 'auths')
