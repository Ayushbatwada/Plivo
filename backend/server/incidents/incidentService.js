const incidentModel = require('./incidentModel');
const sanityChecks = require("../../utils/sanityChecks");
const responseMessages = require("../../utils/responseMessages");

module.exports = {
    getAllIncidents: (req, res) => {
        let response;
        const userId = req.query.uid;

        try {
            if (!sanityChecks.isValidId(userId)) {
                response = new responseMessages.payloadError();
                return res.status(response.code).send(response);
            }
            const query = {"createdBy.userId": userId, status: 'active'};

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

    createIncident: (req, res) => {
        let response, body = req.body;
        try {
            if (!(sanityChecks.isValidObject(body.createdBy))) {
                response = new responseMessages.payloadError();
                return res.status(response.code).send(response);
            }

            const incidentItemBody = new incidentModel(req.body);


            incidentItemBody.save().then((incidentItemBodyRes) => {
                if (sanityChecks.isValidObject(incidentItemBodyRes)) {
                    response = new responseMessages.successMessage();
                    response.data = incidentItemBodyRes;
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

    updateIncident: (req, res) => {
        let response, body = req.body;

        try {
            if (!sanityChecks.isValidId(body.incidentId) || sanityChecks.isValidObject(body.createdBy) || !sanityChecks.isValidId(body.createdBy.userId)) {
                response = new responseMessages.payloadError();
                return res.status(response.code).send(response);
            }

            const query = {_id: body.incidentId, "created.userId": body.createdBy.userId, status: 'open'};

            const options = {
                returnDocument: "after"
            }

            incidentModel.findOneAndUpdate(query, body, options).then((updateIncidentRes) => {
                if (sanityChecks.isValidObject(updateIncidentRes)) {
                    response = new responseMessages.successMessage();
                    return res.status(response.code).send(response);
                }  else {
                    response = new responseMessages.notFound();
                    return res.status(response.code).send(response);
                }
            }).catch((err) => {
                response = new responseMessages.serverError();
                return res.status(response.code).send(response);
            });
        } catch (err) {
            response = new responseMessages.serverError();
            return res.status(response.code).send(response);
        }
    },
}
