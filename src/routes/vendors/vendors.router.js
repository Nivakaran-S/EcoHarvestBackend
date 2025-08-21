const express = require('express');
const verifyToken = require('../authMiddleware/authMiddleware');

const { registerVendor, getVendorById, httpGetVendorById, updateVendor, deleteVendor, loginVendor } = require('./vendors.controller');

const router = express.Router();

router.get('/vendor/:id',getVendorById);
router.get('/:id', httpGetVendorById);
router.put('/:id', updateVendor);  
router.delete('/:id', deleteVendor);


module.exports = router;
