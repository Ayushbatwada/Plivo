const express = require('express');
const servicesService = require('./serviceService');
const isUserAdminMW = require('../../../utils/middlewares').isUserAdmin;

const router = express.Router();

router.post('/create/new',[isUserAdminMW], servicesService.createNewService);
router.get('/get/all', servicesService.getAllServices);
router.put('/edit', [isUserAdminMW], servicesService.updateService);
router.put('/status/change', [isUserAdminMW], servicesService.updateServiceStatus);

module.exports = router;
