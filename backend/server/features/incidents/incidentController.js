const incidentService = require("./incidentService");
const responseMessages = require("../../../utils/responseMessages");

module.exports = {
    updateIncident: (req, res) => {
        let response;
        incidentService.updateIncident(req.body,(err, updateIncidentRes) => {
            if (err) {
                response = new responseMessages.serverError();
                res.status(response.code).send(response);
            } else {
                res.status(updateIncidentRes.code).send(updateIncidentRes);
            }
        });
    },

    updateIncidentStatus: (req, res) => {
        let response;
        incidentService.updateIncidentStatus(req.body,(err, updateIncidentStatusRes) => {
            if (err) {
                response = new responseMessages.serverError();
                res.status(response.code).send(response);
            } else {
                res.status(updateIncidentStatusRes.code).send(updateIncidentStatusRes);
            }
        });
    }
}
