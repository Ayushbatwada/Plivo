const developmentConfig = require("../environment/development");

const NODE_ENV = process.env.NODE_ENV || 'development';
let mongodbName, mongodbUri, mongodbUserName, mongodbPassword, jwtSecretKey

if (NODE_ENV === 'production') {
    mongodbName = process.env.MONGODB_NAME;
    mongodbUri = process.env.MONGODB_URI;
    jwtSecretKey = process.env.JWT_SECRET_KEY;
    mongodbUserName = process.env.MONGODB_USERNAME;
    mongodbPassword = process.env.MONGODB_PASSWORD;
} else {
    mongodbName = developmentConfig.mongodbName;
    mongodbUri = developmentConfig.mongodbUri;
    jwtSecretKey = developmentConfig.jwtSecretKey;
    mongodbUserName = developmentConfig.mongodbUserName;
    mongodbPassword = developmentConfig.mongodbPassword;
}

global.NODE_ENV = NODE_ENV;
global.MONGODB_NAME = mongodbName;
global.MONGODB_URI = mongodbUri;
global.MONGODB_USERNAME = mongodbUserName;
global.MONGODB_PASSWORD = mongodbPassword;
global.jwtSecretKey = jwtSecretKey;
