const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');

router.post('/ping', iotController.testConnection);
router.post('/data', iotController.receiveSensorData);
// routes/iot.js
router.get('/history', iotController.getSensorHistory);

module.exports = router;

