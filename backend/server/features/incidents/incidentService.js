const incidentModel = require('./incidentModel');
const incidentConfig = require('./incidentConfig');
const serviceConfig = require("../services/serviceConfig.json");
const sanityChecks = require("../../../utils/sanityChecks");
const responseMessages = require("../../../utils/responseMessages");

module.exports = {
    getAllIncidents: (req, res) => {
        let response;
        const serviceId = req.query.serviceId;

        try {
            if (!sanityChecks.isValidId(serviceId)) {
                console.log('Info ::: Missing info in incidentService inside getAllIncidents, serviceId: ', serviceId);
                response = new responseMessages.payloadError();
                return res.status(response.code).send(response);
            }
            const query = {serviceId: serviceId, status: incidentConfig.status.open};

            incidentModel.find(query).then((getAllIncidentsRes) => {
                if (sanityChecks.isValidArray(getAllIncidentsRes) && sanityChecks.isValidArray(getAllIncidentsRes)) {
                    response = new responseMessages.successMessage();
                    response.data = getAllIncidentsRes;
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

    createIncident: (body, callback) => {
        let response;
        const description = body.description;
        const serviceId = body.serviceId;
        const createdBy = body.createdBy;

        try {
            if (!sanityChecks.isValidId(serviceId) || !sanityChecks.isValidString(description) ||
                !sanityChecks.isValidObject(createdBy) || !sanityChecks.isValidId(createdBy.userId)) {
                console.log('Info ::: Missing info in incidentService inside createIncident, createdBy: ', JSON.stringify(createdBy) + '. serviceId: ', serviceId +
                '. description: ', description);
                response = new responseMessages.payloadError();
                return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
            }

            const payload = {
                description: description,
                createdBy: createdBy,
                serviceId: serviceId,
                updates: [description]
            }

            const incidentItemBody = new incidentModel(payload);
            incidentItemBody.save().then((incidentItemBodyRes) => {
                if (sanityChecks.isValidObject(incidentItemBodyRes)) {
                    response = new responseMessages.successMessage();
                    response.data = incidentItemBodyRes;
                    return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
                } else {
                    response = new responseMessages.notFound();
                    return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
                }
            }).catch((err) => {
                response = new responseMessages.serverError();
                return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
            })
        } catch (err) {
            response = new responseMessages.serverError();
            return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
        }
    },

    updateIncident: (body, callback) => {
        let response;
        const description = body.description;
        const update = body.update;
        const incidentId = body.incidentId

        try {
            if (!sanityChecks.isValidId(incidentId)) {
                console.log('Info ::: Missing info in incidentService inside updateIncident, incidentId: ', incidentId);
                response = new responseMessages.payloadError();
                return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
            }

            const query = {_id: incidentId, status: incidentConfig.status.open};

            const body = {};

            if (sanityChecks.isValidString(description)) {
                body.description = description;
            }

            if (sanityChecks.isValidString(update)) {
                body.$push = { updates: update };
            }

            const options = {
                returnDocument: "after"
            }

            incidentModel.findOneAndUpdate(query, body, options).then((updateIncidentRes) => {
                if (sanityChecks.isValidObject(updateIncidentRes)) {
                    response = new responseMessages.successMessage();
                    response.data = updateIncidentRes;
                    return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
                }  else {
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

    updateIncidentStatus: (body, callback) => {
        let response;
        const incidentId = body.incidentId;
        const incidentCreatedAt = body.incidentCreatedAt;

        try {
            if (!sanityChecks.isValidId(incidentId) || !sanityChecks.isValidDate(incidentCreatedAt)) {
                console.log('Info ::: Missing info in incidentService inside updateIncidentStatus, incidentId: ', incidentId + '. incidentCreatedAt', incidentCreatedAt);
                response = new responseMessages.payloadError();
                return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
            }

            const query = {_id: incidentId, status: incidentConfig.status.open };

            const body = {
                resolvedAt: new Date().toISOString(),
                duration: new Date().getTime() - new Date(incidentCreatedAt).getTime(),
                status: incidentConfig.status.resolved
            };

            const options = {
                returnDocument: "after"
            }

            incidentModel.findOneAndUpdate(query, body, options).then((updateIncidentStatusRes) => {
                if (sanityChecks.isValidObject(updateIncidentStatusRes)) {
                    response = new responseMessages.successMessage();
                    response.data = updateIncidentStatusRes;
                    return sanityChecks.isValidFunction(callback) ? callback(null, response) : response;
                }  else {
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
