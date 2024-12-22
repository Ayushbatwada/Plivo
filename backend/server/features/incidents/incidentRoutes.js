const express = require('express');
const incidentService = require('./incidentService');
const isUserAdminMW = require('../../../utils/middlewares').isUserAdmin;

const router = express.Router();

router.post('/create/new', [isUserAdminMW], incidentService.createIncident);
router.get('/get/all', incidentService.getAllIncidents);
router.put('/edit', [isUserAdminMW], incidentService.updateIncident);
router.put('/status/change', [isUserAdminMW], incidentService.updateIncidentStatus);

module.exports = router;
