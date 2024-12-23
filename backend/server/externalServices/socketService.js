const jwt = require('jsonwebtoken');
const responseMessages = require('../../utils/responseMessages');
const sanityChecks = require('../../utils/sanityChecks');
const serviceConfig = require("../features/services/serviceConfig.json");
const serviceService = require('../features/services/serviceService');
const incidentService = require('../features/incidents/incidentService');

let socketIdsMap = {}, connectedUsers = {};

function authenticateUser(token, next) {
    try {
        jwt.verify(token, jwtSecretKey, {},(err, decoded) => {
            if (err) {
                return next(err, null);
            }
            next(null, decoded);
        });
    } catch(err) {
        return next(err, null);
    }
}

module.exports = {
    initiateSocketConnection: () => {
        let response;
        socketIO.of('/user').use((socket, next) => {
            const userInfo = socket.handshake.auth;
            if (userInfo && userInfo.token && userInfo.userId) {
                authenticateUser(userInfo.token, (err, decoded) => {
                    if (err) {
                        response = new responseMessages.unauthorised()
                        return socket.emit(response)
                    }
                    next();
                });
            } else {
                response = new responseMessages.unauthorised()
                return socket.emit(response)
            }
        });

        socketIO.of('/user').on('connection', (socket) => {
            const userId = socket.handshake.auth.userId;
            console.log(`User ${userId} is connected with socket ID: ${socket.id}`);
            socketIdsMap[socket.id] = userId;

            if (sanityChecks.isValidArray(connectedUsers[userId])) {
                connectedUsers[userId].push(socket.id);
            } else {
               connectedUsers[userId] = [socket.id];
            }

            // Handle disconnection
            socket.on('disconnect', () => {
                console.log(`User ${userId} is disconnected with socket Id: ${socket.id}`);
                socket.leave(socket.id);
                connectedUsers[userId] = connectedUsers[userId].filter((socketId) => {
                    return socket.id !== socketId;
                })
            });

            // Status change
            let response;
            socket.on('service_status_change', (data, callback) => {
                if (!sanityChecks.isValidId(data.serviceId) || !serviceConfig.status.values.includes(data.status)) {
                    response = new responseMessages.payloadError();
                    return callback(response);
                }
                serviceService.updateServiceStatus(data);
                response = new responseMessages.successMessage();
                socket.broadcast.emit('service_status_change', data);
                return callback(response);
            });

            // incident update
            socket.on('incident_create', (data, callback) => {
                if (!sanityChecks.isValidId(data.serviceId) || !sanityChecks.isValidString(data.description) ||
                    !sanityChecks.isValidObject(data.createdBy) || !sanityChecks.isValidId(data.createdBy.userId)) {
                    response = new responseMessages.payloadError();
                    return callback(response);
                }
                incidentService.createIncident(data);
                response = new responseMessages.successMessage();
                socket.broadcast.emit('incident_create', data);
                return callback(response);
            });

            // incident update
            socket.on('incident_update', (data, callback) => {
                if (!sanityChecks.isValidId(data.incidentId) || !sanityChecks.isValidString(data.update)) {
                    response = new responseMessages.payloadError();
                    return callback(response);
                }
                incidentService.updateIncident(data);
                response = new responseMessages.successMessage();
                socket.broadcast.emit('incident_update', data);
                return callback(response);
            });

            // incident update
            socket.on('incident_resolve', (data, callback) => {
                if (!sanityChecks.isValidId(data.incidentId) || !sanityChecks.isValidDate(data.incidentCreatedAt)) {
                    response = new responseMessages.payloadError();
                    return callback(response);
                }
                incidentService.updateIncidentStatus(data);
                response = new responseMessages.successMessage();
                socket.broadcast.emit('incident_resolve', data);
                return callback(response);
            });
        });
    }
}
