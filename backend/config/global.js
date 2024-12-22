const nodemailer = require('nodemailer');
const developmentConfig = require("../environment/development");

const NODE_ENV = process.env.NODE_ENV || 'development';
let mongodbName, mongodbUri, mongodbUserName, mongodbPassword, jwtSecretKey;
let redisUrl, redisPassword;
let email, emailPassWord;


if (NODE_ENV === 'production') {
    mongodbName = process.env.MONGODB_NAME;
    mongodbUri = process.env.MONGODB_URI;
    jwtSecretKey = process.env.JWT_SECRET_KEY;
    mongodbUserName = process.env.MONGODB_USERNAME;
    mongodbPassword = process.env.MONGODB_PASSWORD;
    email = process.env.EMAIL;
    emailPassWord = process.env.EMAIL_PASSWORD;
    redisUrl = process.env.REDIS_URL;
    redisPassword = process.env.REDIS_PASSWORD;
} else {
    mongodbName = developmentConfig.mongodbName;
    mongodbUri = developmentConfig.mongodbUri;
    jwtSecretKey = developmentConfig.jwtSecretKey;
    mongodbUserName = developmentConfig.mongodbUserName;
    mongodbPassword = developmentConfig.mongodbPassword;
    email = developmentConfig.email;
    emailPassWord = developmentConfig.emailPassword;
    redisUrl = developmentConfig.redisUrl;
    redisPassword = developmentConfig.redisPassword;
}

// Create a transporter object
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: emailPassWord
    },
});

global.NODE_ENV = NODE_ENV;
global.MONGODB_NAME = mongodbName;
global.MONGODB_URI = mongodbUri;
global.MONGODB_USERNAME = mongodbUserName;
global.MONGODB_PASSWORD = mongodbPassword;
global.jwtSecretKey = jwtSecretKey;
global.EMAIL = email;
global.emailTransporter = emailTransporter
global.REDISURL = redisUrl;
global.REDIS_PASSOWRD = redisPassword;
