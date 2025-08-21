const express = require('express');
const router = express.Router();

const { generateSalesReport } = require('./reports.controller');

router.get('/vendor/:vendorId/report/sales', generateSalesReport);

module.exports = router;
