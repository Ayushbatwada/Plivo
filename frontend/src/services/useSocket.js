import {useContext, useEffect} from 'react';
import io from 'socket.io-client';
import {EventEmitter} from "events";
import {AuthContext} from "./AuthProvider";

const SOCKET_SERVER_URL = process.env.REACT_APP_SERVER_BASE_URL // Replace with your server URL
const eventEmitter = new EventEmitter();
let socket;
const eventName = 'mainEvent'

const useSocket = () => {
    const {userInfo} = useContext(AuthContext);

    useEffect(() => {
        if (!socket && userInfo && userInfo.userId) {
            socket = io(`${SOCKET_SERVER_URL}/user`, {
                path: '/user',
                auth: {
                    userId: userInfo.userId,
                    token: userInfo.jwtToken,
                },
                transports: ['websocket'],
                pingInterval: 60 * 60 * 1000,
                pingTimeout: 30 * 60 * 1000,
            });

            socket?.on('connect', () => {
                listenEvents();
            });

            socket?.on('disconnect', () => {
                socket.disconnect();
            });
        }
    }, [userInfo])

    const listenEvents = () => {
        socket.on('service_status_change', (data) => {
            data.event = 'service_status_change'
            eventEmitter.emit(eventName, data);
        });

        socket.on('incident_create', (data) => {
            data.event = 'incident_create'
            eventEmitter.emit(eventName, data);
        });

        socket.on('incident_update', (data) => {
            data.event = 'incident_update'
            eventEmitter.emit(eventName, data);
        });

        socket.on('incident_resolve', (data) => {
            data.event = 'incident_resolve'
            eventEmitter.emit(eventName, data);
        });
    }

    return {
        serviceStatusChange: (payload) => {
            if (socket) {
                socket.emit('service_status_change', payload, (response) => {
                    console.log(response);
                });
            }
        },

        createIncident: (payload) => {
            if (socket) {
                socket.emit('incident_create', payload, (response) => {
                    console.log(response);
                });
            }
        },

        updateIncident: (payload) => {
            if (socket) {
                socket.emit('incident_update', payload, (response) => {
                    console.log(response);
                });
            }
        },

        incidentResolve: (payload) => {
            if (socket) {
                socket.emit('incident_resolve', payload, (response) => {
                    console.log(response);
                });
            }
        },

        eventEmitter: eventEmitter,
        eventName: eventName
    }
};

export default useSocket;
