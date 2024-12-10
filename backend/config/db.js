const mongoose = require('mongoose');

if (NODE_ENV === 'production') {
    mongoose.connect(`mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_URI}/${MONGODB_NAME}?retryWrites=true&w=majority`);
} else {
    mongoose.connect(`mongodb://${MONGODB_URI}/${MONGODB_NAME}`);
}

module.exports = mongoose.connection
