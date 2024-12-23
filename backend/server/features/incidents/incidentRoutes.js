const express = require('express');
const incidentService = require('./incidentService');
const incidentController = require('./incidentController');
const isUserAdminMW = require('../../../utils/middlewares').isUserAdmin;

const router = express.Router();

router.post('/create/new', [isUserAdminMW], incidentService.createIncident);
router.get('/get/all', incidentService.getAllIncidents);
router.put('/edit', [isUserAdminMW], incidentController.updateIncident);
router.put('/status/change', [isUserAdminMW], incidentController.updateIncidentStatus);

module.exports = router;
