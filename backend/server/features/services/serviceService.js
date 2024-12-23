const serviceModel = require('./serviceModel');
const sanityChecks = require("../../../utils/sanityChecks");
const responseMessages = require("../../../utils/responseMessages");
const emailService = require("../../externalServices/emailService");
const authService = require("../../features/auth/authService");
const serviceConfig = require("./serviceConfig");

module.exports = {
    getServiceStatus: (req, res) => {
        let response;
        const serviceId = req.params.serviceId;
        if (!sanityChecks.isValidId(serviceId)) {
            console.log('Info ::: Missing info in serviceService inside getServiceStatus, serviceId: ', serviceId);
            response = new responseMessages.payloadError();
            return res.status(response.code).send(response);
        }

        try {
            serviceModel.findById({_id: serviceId}).then((getServiceStatusRes) => {
                if (sanityChecks.isValidObject(getServiceStatusRes)) {
                    response = new responseMessages.successMessage();
                    response.message = `Service - ${getServiceStatusRes.name} status is ${getServiceStatusRes.status}`;
                    return res.status(response.code).send(response);
                } else {
                    response = new responseMessages.notFound();
                    return res.status(response.code).send(response);
                }
            }).catch(() => {
                response = new responseMessages.serverError();
                return res.status(response.code).send(response);
            })
        } catch (err) {
            response = new responseMessages.serverError();
            return res.status(response.code).send(response);
        }
    },

    getAllServices: (req, res) => {
        let response;
        try {
            serviceModel.find({}).then((getAllServicesRes) => {
                if (sanityChecks.isValidArray(getAllServicesRes) && sanityChecks.isValidArray(getAllServicesRes)) {
                    response = new responseMessages.successMessage();
                    response.data = getAllServicesRes;
                    return res.status(response.code).send(response);
                } else {
                    response = new responseMessages.notFound();
                    return res.status(response.code).send(response);
                }
            }).catch(() => {
                response = new responseMessages.serverError();
                return res.status(response.code).send(response);
            })
        } catch (err) {
            response = new responseMessages.serverError();
            return res.status(response.code).send(response);
        }
    },

    createNewService: (req, res) => {
        let response, body = req.body;
        const createdBy = body.createdBy;
        const name = body.name;
        const description = body.description;
        const category = body.category;

        try {
            if (!sanityChecks.isValidObject(createdBy) || !sanityChecks.isValidId(createdBy.userId) || !sanityChecks.isValidString(name)) {
                console.log('Info ::: Missing info in serviceService inside createNewService, createdBy: ', JSON.stringify(createdBy) + '. name: ', name);
                response = new responseMessages.payloadError();
                return res.status(response.code).send(response);
            }

            const payload = {
                createdBy: createdBy,
                name: name
            }
            if (sanityChecks.isValidString(description)) {
                payload.description = description;
            }
            if (sanityChecks.isValidString(category) && serviceConfig.category.values.includes(category)) {
                payload.category = category;
            }
            const serviceItemBody = new serviceModel(payload);

            serviceItemBody.save().then((serviceItemBodyRes) => {
                if (sanityChecks.isValidObject(serviceItemBodyRes)) {
                    response = new responseMessages.successMessage();
                    response.data = serviceItemBodyRes;
                    return res.status(response.code).send(response);
                } else {
                    response = new responseMessages.notFound();
                    return res.status(response.code).send(response);
                }
            }).catch((err) => {
                response = new responseMessages.serverError();
                return res.status(response.code).send(response);
            })
        } catch (err) {
            response = new responseMessages.serverError();
            return res.status(response.code).send(response);
        }
    },

    updateService: (body, callback) => {
        let response;
        const name = body.name;
        const description = body.description;
        const category = body.category;
        const serviceId = body.serviceId;

        try {
            if (!sanityChecks.isValidId(body.serviceId)) {
                console.log('Info ::: Missing info in serviceService inside updateService, serviceId: ', serviceId);
                response = new responseMessages.payloadError();
                return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
            }

            const query = {_id: serviceId};

            const payload = {};
            if (sanityChecks.isValidString(name)) {
                payload.description = description;
            }
            if (sanityChecks.isValidString(description)) {
                payload.description = description;
            }
            if (sanityChecks.isValidString(category) && serviceConfig.category.values.includes(category)) {
                payload.category = category;
            }

            const options = {
                returnDocument: "after"
            }

            serviceModel.findOneAndUpdate(query, body, options).then((updateServiceRes) => {
                if (sanityChecks.isValidObject(updateServiceRes)) {
                    response = new responseMessages.successMessage();
                    response.data = updateServiceRes;
                    return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
                } else {
                    response = new responseMessages.notFound();
                    return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
                }
            }).catch((err) => {
                response = new responseMessages.serverError();
                return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
            });
        } catch (err) {
            response = new responseMessages.serverError();
            return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
        }
    },

    updateServiceStatus: (body, callback) => {
        let response;
        const serviceId = body.serviceId;
        const status = body.status;

        try {
            if (!sanityChecks.isValidId(serviceId) || !serviceConfig.status.values.includes(status)) {
                console.log('Info ::: Missing info in serviceService inside updateServiceStatus, serviceId: ', serviceId + '. status', status);
                response = new responseMessages.payloadError();
                return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;

            }

            const body = {}
            if (serviceConfig.status.values.includes(status)) {
                body.status = status || serviceConfig.status.operational;
            }

            const query = {_id: serviceId, status: {$not: {$eq: body.status}}};

            const options = {
                returnDocument: "before"
            }

            serviceModel.findOneAndUpdate(query, body, options).then((updateServiceStatusRes) => {
                if (sanityChecks.isValidObject(updateServiceStatusRes)) {
                    response = new responseMessages.successMessage();

                    // Send mail
                    authService.getUserEmails((getUserEmailsRes) => {
                        if (sanityChecks.isValidObject(getUserEmailsRes) && sanityChecks.isValidArray(getUserEmailsRes.data)) {
                            let userEmails = [];
                            getUserEmailsRes.data.forEach((user) => {
                                userEmails.push(user.email);
                            });
                            const mailOptions = {
                                userEmails: userEmails.join(','),
                                message: `Your service - <b>${updateServiceStatusRes.name}</b> status has been changed from <b>${updateServiceStatusRes.status}</b> to <b>${body.status}</b>`
                            }
                            emailService.sendEmail(mailOptions);
                        }
                    });

                    updateServiceStatusRes.status = body.status;
                    response.data = updateServiceStatusRes;
                    return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
                } else {
                    response = new responseMessages.notFound();
                    return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
                }
            }).catch((err) => {
                response = new responseMessages.serverError();
                return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
            });
        } catch (err) {
            response = new responseMessages.serverError();
            return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
        }
    },
}
