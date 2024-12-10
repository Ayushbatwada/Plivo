const express = require('express');
const path = require("path");
const app = express();

require('./config/global');
require('dotenv').config();
const dbConnection = require('./config/db');

// Parse the request
app.use(express.urlencoded({extended: false}))
app.use(express.json());

// Handling CORS related errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,X-Access-Token');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    if('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        console.log(`${req.ip} ${req.method} ${req.url}`);
        next();
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

// Import routes
require('./routes')(app);

const http = require('http').createServer(app);
http.listen(6000, () => console.log('Server running on port 6000'));
