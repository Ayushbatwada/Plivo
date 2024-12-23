const express = require('express');
const servicesService = require('./serviceService');
const serviceController = require('./serviceController');
const isUserAdminMW = require('../../../utils/middlewares').isUserAdmin;

const router = express.Router();

router.post('/create/new',[isUserAdminMW], servicesService.createNewService);
router.get('/get/all', servicesService.getAllServices);
router.put('/edit', [isUserAdminMW], serviceController.updateService);
router.put('/status/change', [isUserAdminMW], serviceController.updateServiceStatus);
router.get('/status/:serviceId', servicesService.getServiceStatus);

module.exports = router;
