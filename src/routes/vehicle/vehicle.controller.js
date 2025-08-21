const Vehicle = require('../../models/vehicle.model');

/* CREATE */
exports.createVehicle = async (req, res) => {
  try {
    // Log the incoming payload for debugging
    console.log('Create vehicle payload:', req.body);

    // Validate payload
    const { plateNumber, type, capacityKg, status } = req.body;
    if (!plateNumber || !type || capacityKg == null || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for duplicate plateNumber
    const existingVehicle = await Vehicle.findOne({ plateNumber });
    if (existingVehicle) {
      return res.status(409).json({ message: `Plate number "${plateNumber}" already exists` });
    }

    // Fallback: Attempt to drop problematic indexes
    try {
      await Vehicle.dropProblematicIndexes();
    } catch (indexError) {
      console.warn('Could not drop problematic indexes:', indexError.message);
    }

    // Create the vehicle
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json({ message: 'Vehicle added', vehicle });
  } catch (err) {
    console.error('Error creating vehicle:', err.message);
    res.status(500).json({ message: 'Error creating vehicle', error: err.message });
  }
};

/* READ ALL */
exports.getAllVehicles = async (_req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('assignedInventories', 'productName status');
    res.status(200).json({ vehicles });
  } catch (err) {
    console.error('Error fetching vehicles:', err.message);
    res.status(500).json({ message: 'Error fetching vehicles', error: err.message });
  }
};

/* UPDATE */
exports.updateVehicle = async (req, res) => {
  try {
    const { plateNumber } = req.body;
    // If updating plateNumber, check for duplicates
    if (plateNumber) {
      const existingVehicle = await Vehicle.findOne({ plateNumber, _id: { $ne: req.params.id } });
      if (existingVehicle) {
        return res.status(409).json({ message: `Plate number "${plateNumber}" already exists` });
      }
    }

    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle updated', vehicle: updated });
  } catch (err) {
    console.error('Error updating vehicle:', err.message);
    res.status(500).json({ message: 'Error updating vehicle', error: err.message });
  }
};

/* DELETE */
exports.deleteVehicle = async (req, res) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle deleted' });
  } catch (err) {
    console.error('Error deleting vehicle:', err.message);
    res.status(500).json({ message: 'Error deleting vehicle', error: err.message });
  }
};