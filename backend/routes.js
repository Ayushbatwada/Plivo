const healthCheck = require('./utils/healthCheck');
const servicesRoutes = require('./server/services/serviceRoutes');
const incidentsRoutes = require('./server/incidents/incidentRoutes');

const isUsedAuthenticatedMW = require('./utils/middlewares').isUsedAuthenticated;

module.exports = (app) => {

    app.use('/v1/api/healthCheck', healthCheck);
    app.use('/v1/api/services', [isUsedAuthenticatedMW], servicesRoutes);
    app.use('/v1/api/incidents', [isUsedAuthenticatedMW], incidentsRoutes);

    app.get('**', (req, res) => {
        res.status(404).send({status: 'Not Found'});
    });

    app.post('**', (req, res) => {
        res.status(404).send({status: 'Not Found'});
    });

    app.put('**', (req, res) => {
        res.status(404).send({status: 'Not Found'});
    });
};
