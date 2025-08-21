const express = require('express');
const router = express.Router();
const fertilizerCompanyController = require('./fertilizercompany.controller');

// CRUD routes for Fertilizer Company
router.post('/', fertilizerCompanyController.createFertilizerCompany);
router.get('/', fertilizerCompanyController.getAllFertilizerCompanies);
router.get('/:id', fertilizerCompanyController.getFertilizerCompanyById);
router.put('/:id', fertilizerCompanyController.updateFertilizerCompany);
router.delete('/:id', fertilizerCompanyController.deleteFertilizerCompany);

module.exports = router;
