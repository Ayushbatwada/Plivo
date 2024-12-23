const healthCheck = require('./utils/healthCheck');
const serviceRoutes = require('./server/features/services/serviceRoutes');
const incidentRoutes = require('./server/features/incidents/incidentRoutes');
const authRoutes = require('./server/features/auth/authRoutes');
const serviceServices = require('./server/features/services/serviceService');

const isUsedAuthenticatedMW = require('./utils/middlewares').isUsedAuthenticated;

module.exports = (app) => {

    app.use('/v1/api/healthCheck', healthCheck);
    app.use('/v1/api/auth', authRoutes);
    app.use('/v1/api/services', [isUsedAuthenticatedMW], serviceRoutes);
    app.use('/v1/api/incidents', [isUsedAuthenticatedMW], incidentRoutes);
    app.use('/serviceStatus/:serviceId', serviceServices.getServiceStatus);

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
