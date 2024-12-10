const jwt = require('jsonwebtoken');
const sanityChecks = require('./sanityChecks');
const responseMessages = require('./responseMessages');

module.exports = {
    isUsedAuthenticated: (req, res, next) => {
        let response;
        const token = req.headers['x-access-token'] || req.headers['X-Access-Token'];
        const callerId = req.headers['x-caller-id'] || req.headers['X-Caller-Id'];

        if (!sanityChecks.isValidString(token) || !sanityChecks.isValidString(callerId) ) {
            console.log('Info ::: Missing info in middleware inside isUsedAuthenticated, token: ', token + '. callerId: ', callerId);
            response = new responseMessages.unauthorised();
            return res.status(response.code).send(response);
        }

        try {
            jwt.verify(token, jwtSecretKey, function(err, decoded) {
                if (sanityChecks.isValidObject(decoded) && decoded.userId === callerId) {
                    req.query.uid = decoded.userId;
                    req.body.userId = decoded.userId;
                    next();
                } else {
                    console.log('ERROR ::: found in middleware inside isUsedAuthenticated catch block', err);
                    response = new responseMessages.unauthorised();
                    res.status(response.code).send(response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in middleware inside isUsedAuthenticated catch block', err);
            response = new responseMessages.serverError();
            res.status(response.code).send(response);
        }
    }
}
