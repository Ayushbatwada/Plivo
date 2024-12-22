const jwt = require('jsonwebtoken');
const responseMessages = require('../../utils/responseMessages');
const sanityChecks = require('../../utils/sanityChecks');

let socketIdsMap, connectedUsers = {};

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
            const userId = socket.handshake.query.userId;
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
        });
    }
}
