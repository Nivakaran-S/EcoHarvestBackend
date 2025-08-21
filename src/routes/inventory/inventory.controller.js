const Inventory = require('../../models/inventory.model');
const Vehicle = require('../../models/vehicle.model'); // To validate vehicle ID

// Create new inventory
exports.createInventory = async (req, res) => {
  try {
    // Log the incoming payload for debugging
    console.log('Create inventory payload:', req.body);

    // Validate payload
    const {
      productName,
      category,
      quantity,
      vendorName,
      collectedFertilizerCompany,
      collectedTime,
      status,
      dispatchedTime,
      vehicle,
    } = req.body;

    if (!productName || !category || quantity == null || !vendorName) {
      return res.status(400).json({ message: 'Missing required fields: productName, category, quantity, vendorName' });
    }

    // Validate category
    if (!['Resale', 'Recycle', 'Fertilizer'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category. Must be Resale, Recycle, or Fertilizer' });
    }

    // Validate status (if provided)
    if (status && !['Active', 'Dispatched'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Active or Dispatched' });
    }

    // Validate vehicle ID (if provided)
    if (vehicle) {
      const vehicleExists = await Vehicle.findById(vehicle);
      if (!vehicleExists) {
        return res.status(400).json({ message: 'Invalid vehicle ID' });
      }
    }

    // Fallback: Attempt to drop problematic indexes
    try {
      await Inventory.dropProblematicIndexes();
    } catch (indexError) {
      console.warn('Could not drop problematic indexes:', indexError.message);
    }

    // Create a new inventory item
    const newInventory = new Inventory({
      productName,
      category,
      quantity,
      vendorName,
      collectedFertilizerCompany,
      collectedTime: collectedTime || Date.now(),
      status: status || 'Active',
      dispatchedTime,
      vehicle,
    });

    // Save to the database
    await newInventory.save();

    // Respond with the created inventory
    res.status(201).json({ message: 'Inventory created successfully!', inventory: newInventory });
  } catch (error) {
    console.error('Error creating inventory:', error.message);
    res.status(500).json({ message: 'Error creating inventory', error: error.message });
  }
};

// Get all inventories
exports.getAllInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find().populate('vehicle', 'plateNumber type');
    res.status(200).json({ inventories });
  } catch (error) {
    console.error('Error fetching inventories:', error.message);
    res.status(500).json({ message: 'Error fetching inventories', error: error.message });
  }
};

// Get a specific inventory by ID
exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate('vehicle', 'plateNumber type');
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.status(200).json({ inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error.message);
    res.status(500).json({ message: 'Error fetching inventory', error: error.message });
  }
};

// Update an inventory
exports.updateInventory = async (req, res) => {
  try {
    const {
      productName,
      category,
      quantity,
      vendorName,
      status,
      vehicle,
    } = req.body;

    // Validate category (if provided)
    if (category && !['Resale', 'Recycle', 'Fertilizer'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category. Must be Resale, Recycle, or Fertilizer' });
    }

    // Validate status (if provided)
    if (status && !['Active', 'Dispatched'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Active or Dispatched' });
    }

    // Validate vehicle ID (if provided)
    console.log('vehicle :>> ', vehicle);
    if (vehicle) {
      const vehicleExists = await Vehicle.findById(vehicle);
      if (!vehicleExists) {
        return res.status(400).json({ message: 'Invalid vehicle ID' });
      }
    }

    const updatedInventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedInventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.status(200).json({ message: 'Inventory updated', inventory: updatedInventory });
  } catch (error) {
    console.error('Error updating inventory:', error.message);
    res.status(500).json({ message: 'Error updating inventory', error: error.message });
  }
};

// Delete an inventory
exports.deleteInventory = async (req, res) => {
  try {
    const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedInventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.status(200).json({ message: 'Inventory deleted' });
  } catch (error) {
    console.error('Error deleting inventory:', error.message);
    res.status(500).json({ message: 'Error deleting inventory', error: error.message });
  }
};