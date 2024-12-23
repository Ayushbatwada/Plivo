const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const socketService = require('./server/externalServices/socketService');

const app = express();

const httpServer = http.createServer(app);

require('./config/global');
require('dotenv').config();
const dbConnection = require('./config/db');

// Parse the request
app.use(express.urlencoded({extended: false}))
app.use(express.json());

// Handling CORS related errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,X-Access-Token, X-Caller-Id');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    if('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        console.log(`${req.ip} ${req.method} ${req.url}`);
        next();
    }
});

// Connect with socket
const socketIO = new Server(httpServer, {
    path: '/user',
    pingInterval: 60 * 1000,
    pingTimeout: 30 * 1000,
    cors: {
        origin: "*"
    }
});

app.use(express.static("public"));

// Db connection
dbConnection.on('connected', ()=> {
    console.log('Mongo connection established')
});
dbConnection.on('error', ()=> {
    console.log('Mongo connection failed')
});

const pubClient = createClient({
    password: REDIS_PASSOWRD,
    socket: {
        host: REDISURL,
        port: 14286
    }
});
const subClient = pubClient.duplicate();

Promise.allSettled([pubClient.connect(), subClient.connect()]).then(() => {
    console.log('Connected to redis');
    global.redisClient = pubClient;
    socketIO.adapter(createAdapter(pubClient, subClient));
    global.socketIO = socketIO;
    socketService.initiateSocketConnection();
}).catch((err) => {
    console.log('Redis connection failed with following error', JSON.stringify(err));
});

// Import routes
require('./routes')(app);

httpServer.listen(3200, () => console.log('Server running on port 3200'));
