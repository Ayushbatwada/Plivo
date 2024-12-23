const serviceService = require("./serviceService");
const responseMessages = require("../../../utils/responseMessages");

module.exports = {
    updateService: (req, res) => {
        let response;
        serviceService.updateService(req.body,(err, updateServiceRes) => {
            if (err) {
                response = new responseMessages.serverError();
                res.status(response.code).send(response);
            } else {
                res.status(updateServiceRes.code).send(updateServiceRes);
            }
        });
    },

    updateServiceStatus: (req, res) => {
        let response;
        serviceService.updateServiceStatus(req.body,(err, updateServiceStatusRes) => {
            if (err) {
                response = new responseMessages.serverError();
                res.status(response.code).send(response);
            } else {
                res.status(updateServiceStatusRes.code).send(updateServiceStatusRes);
            }
        });
    }
}
