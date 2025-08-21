
const {httpGenerateOrdersPDF} = require('./pdf.controller');
const express = require('express');

const reportRouter = express.Router();


reportRouter.post('/generateorderreport', httpGenerateOrdersPDF) 


module.exports = reportRouter;