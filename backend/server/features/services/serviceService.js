const serviceModel = require('./serviceModel');
const sanityChecks = require("../../../utils/sanityChecks");
const responseMessages = require("../../../utils/responseMessages");


module.exports = {
    getAllServices: (req, res) => {
        let response;
        const userId = req.query.uid;

        try {
            if (!sanityChecks.isValidId(userId)) {
                response = new responseMessages.payloadError();
                return res.status(response.code).send(response);
            }
            const query = {"createdBy.userId": userId, status: 'active'};

            serviceModel.find(query).then((getAllServicesRes) => {
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
        try {
            if (!(sanityChecks.isValidObject(body.createdBy))) {
                response = new responseMessages.payloadError();
                return res.status(response.code).send(response);
            }

            const serviceItemBody = new serviceModel(req.body);


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

    updateService: (req, res) => {
        let response, body = req.body;

        try {
            if (!sanityChecks.isValidId(body.serviceId) || sanityChecks.isValidObject(body.createdBy) || !sanityChecks.isValidId(body.createdBy.userId)) {
                response = new responseMessages.payloadError();
                return res.status(response.code).send(response);
            }

            const query = {_id: body.serviceId, "created.userId": body.createdBy.userId, status: 'open'};

            const options = {
                returnDocument: "after"
            }

            serviceModel.findOneAndUpdate(query, body, options).then((deleteCategoryItem) => {
                if (sanityChecks.isValidObject(deleteCategoryItem)) {
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

    updateServiceStatus: (req, res) => {
        let response;
        const categoryItemId = req.body.serviceId;
        const createdBy = req.body.createdBy;

        try {
            if (!sanityChecks.isValidId(categoryItemId) || sanityChecks.isValidObject(createdBy) || !sanityChecks.isValidId(createdBy.userId)) {
                response = new responseMessages.payloadError();
                return res.status(response.code).send(response);
            }

            const query = {_id: serivceId, "created.userId": createdBy.userId, status: 'open'};
            const body = {
                status: 'closed'
            }
            const options = {
                returnDocument: "after"
            }

            serviceModel.findOneAndUpdate(query, body, options).then((deleteCategoryItem) => {
                if (sanityChecks.isValidObject(deleteCategoryItem)) {
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
