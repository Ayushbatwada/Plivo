const express = require('express');
const incidentService = require('./incidentService');

const router = express.Router();

router.get('/get/all', incidentService.getAllIncidents);
router.post('/create/new', incidentService.createIncident);
router.patch('/update', incidentService.updateIncident);

module.exports = router;
