const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authConfig = require('./authConfig.json');

const authModel  = require("./authModel");
const sanityChecks = require("../../../utils/sanityChecks");
const responseMessages = require("../../../utils/responseMessages");

function getJWTToken(payload, secretKey, options, callback) {
    jwt.sign(payload, secretKey, options, (error, token) => {
        if (sanityChecks.isValidString(token)) {
            callback(null, token)
        } else {
            callback(null, null);
        }
    });
}

module.exports = {
    signup: async (req, res) => {
        let response;
        const email = req.body.email;
        const password = req.body.password;

        if (!sanityChecks.isValidString(password) || !sanityChecks.isValidEmail(email)) {
            console.log('Info ::: Missing info in authService inside signup, email: ', email + '. password: ', password);
            response = new responseMessages.payloadError();
            return res.status(response.code).send(response);
        }

        try {
            const hashPassword = await bcrypt.hash(password, authConfig.saltRound);
            const user = new authModel();
            user.email = email;
            user.password = hashPassword;

            user.save().then((authRes) => {
                if (sanityChecks.isValidObject(authRes)) {
                    const jwtPayload = {
                        userId: authRes._id,
                        email: authRes.email,
                        roles: authRes.roles
                    }
                    const jwtOptions = {
                        expiresIn: authConfig.jwtValidityDuration
                    }

                    getJWTToken(jwtPayload, jwtSecretKey, jwtOptions, (error, token) => {
                        if (sanityChecks.isValidString(token)) {
                            response = new responseMessages.successMessage();
                            response.data = authRes.toJSON();
                            response.data.userId = authRes._id;
                            response.data.jwtToken = token;
                            delete response.data?.password;
                            return res.status(response.code).send(response);
                        } else {
                            response = new responseMessages.serverError();
                            return res.status(response.code).send(response);
                        }
                    })
                } else {
                    response = new responseMessages.serverError();
                    res.status(response.code).send(response);
                }
            }).catch((err) => {
                console.log('ERROR ::: found in authService inside signup db catch block', err);
                response = new responseMessages.serverError();
                res.status(response.code).send(response);
            })
        } catch (err) {
            console.log('ERROR ::: found in authService inside signup catch block', err);
            response = new responseMessages.serverError();
            res.status(response.code).send(response)
        }
    },

    signIn: async (req, res) => {
        let response;
        const email = req.body.email;
        const password = req.body.password;

        if (!sanityChecks.isValidString(password) || !sanityChecks.isValidEmail(email)) {
            console.log('Info ::: Missing info in authService inside signIn, email: ', email + '. password: ', password);
            response = new responseMessages.payloadError();
            return res.status(response.code).send(response);
        }

        try {
            const query = { email: email, status: authConfig.status.active };
            authModel.findOne(query).then(async (authRes) => {
                const isPasswordMatched = await bcrypt.compare(password, authRes?.password);
                if (sanityChecks.isValidObject(authRes) && isPasswordMatched) {
                    response = new responseMessages.successMessage();
                    const jwtPayload = {
                        userId: authRes._id,
                        email: authRes.email,
                        roles: authRes.roles
                    }
                    const jwtOptions = {
                        expiresIn: authConfig.jwtValidityDuration
                    }
                    getJWTToken(jwtPayload, jwtSecretKey, jwtOptions, (error, token) => {
                        if (sanityChecks.isValidString(token)) {
                            response = new responseMessages.successMessage();
                            response.data = authRes.toJSON();
                            response.data.userId = authRes._id;
                            response.data.jwtToken = token;
                            delete response.data?.password;
                            res.status(response.code).send(response);
                        } else {
                            response = new responseMessages.serverError();
                            res.status(response.code).send(response);
                        }
                    })
                } else {
                    response = new responseMessages.payloadError();
                    response.message = 'Email or password is incorrect';
                    res.status(response.code).send(response);
                }
            }).catch((err) => {
                console.log('ERROR ::: found in authService inside signIn db catch block', err);
                response = new responseMessages.serverError();
                res.status(response.code).send(response);
            })
        } catch (err) {
            console.log('ERROR ::: found in authService inside signIn catch block', err);
            response = new responseMessages.serverError();
            res.status(response.code).send(response)
        }
    }
}
