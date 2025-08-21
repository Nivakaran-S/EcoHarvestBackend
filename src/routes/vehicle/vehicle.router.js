const router = require('express').Router();
const vc = require('./vehicle.controller');

router.post('/', vc.createVehicle);
router.get('/', vc.getAllVehicles);
router.put('/:id', vc.updateVehicle);
router.delete('/:id', vc.deleteVehicle);

module.exports = router;