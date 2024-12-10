const express = require('express');
const servicesService = require('./servicesService');

const router = express.Router();

router.get('/get/all', servicesService.getAllServices);
router.post('/create/new', servicesService.createNewService);
router.patch('/update', servicesService.updateService);
router.delete('/delete', servicesService.deleteService);

module.exports = router;
