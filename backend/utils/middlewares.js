const jwt = require('jsonwebtoken');
const sanityChecks = require('./sanityChecks');
const authModel = require('../server/features/auth/authModel');
const responseMessages = require('./responseMessages');

module.exports = {
    isUsedAuthenticated: (req, res, next) => {
        let response;
        const token = req.headers['x-access-token'] || req.headers['X-Access-Token'];
        const callerId = req.headers['x-caller-id'] || req.headers['X-Caller-Id'];

        if (!sanityChecks.isValidString(token) || !sanityChecks.isValidString(callerId) ) {
            console.log('Info ::: Missing info in middleware inside isUsedAuthenticated, token: ', token + '. callerId: ', callerId);
            response = new responseMessages.payloadError();
            return res.status(response.code).send(response);
        }

        try {
            jwt.verify(token, jwtSecretKey, function(err, decoded) {
                if (sanityChecks.isValidObject(decoded) && decoded.userId === callerId) {
                    req.query.uid = decoded.userId;
                    req.body.userId = decoded.userId;
                    req.body.roles = decoded.roles;
                    next();
                } else {
                    console.log('ERROR ::: found in middleware inside isUsedAuthenticated error block', err);
                    response = new responseMessages.unauthorised();
                    res.status(response.code).send(response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in middleware inside isUsedAuthenticated catch block', err);
            response = new responseMessages.serverError();
            res.status(response.code).send(response);
        }
    },

    isUserAdmin: (req, res, next) => {
        let response
       if (sanityChecks.isValidArray(req.body.roles) && req.body.roles.includes('admin')) {
           next();
       } else {
           console.log('ERROR ::: found in middleware inside isUserAdmin error block');
           response = new responseMessages.serverError();
           res.status(response.code).send(response);
       }
    },

    isUserExist: (req, res, next) => {
        let response;
        const email = req.body.email

        if (!sanityChecks.isValidEmail(email)) {
            console.log('Info ::: Missing info in middleware inside isUserExist, email: ', email);
            response = new responseMessages.payloadError();
            return res.status(response.code).send(response);
        }

        try {
            authModel.findOne({ email: email }).then( (isUserExistRes) => {
                console.log(isUserExistRes);
                if (sanityChecks.isValidObject(isUserExistRes)) {
                    const response = new responseMessages.alreadyExist();
                    response.message = `User is already exist with ${email}`
                    return res.status(response.code).send(response);
                } else {
                    next();
                }
            }).catch((err) => {
                console.log('ERROR ::: found in middleware inside isUserExist then catch block with err: ', err);
                const response = new responseMessages.serverError();
                return res.status(response.code).send(response);
            })
        } catch(err) {
            console.log('ERROR ::: found in middleware inside isUserExist try catch block with err: ', err);
            const response = new responseMessages.serverError();
            return res.status(response.code).send(response);
        }
    }
}
