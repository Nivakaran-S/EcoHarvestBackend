const Fertilizercompany = require('../../models/fertilizercompany.model');

// Create new Fertilizer Company
exports.createFertilizerCompany = async (req, res) => {
    try {
        const { firstName, lastName, businessName, phoneNumber } = req.body;

        // Create a new fertilizer company record
        const newCompany = new Fertilizercompany({
            firstName,
            lastName,
            businessName,
            phoneNumber
        });

        // Save to the database
        await newCompany.save();

        // Respond with success message and the created company
        res.status(201).json({ message: 'Fertilizer company registered successfully!', company: newCompany });
    } catch (error) {
        res.status(500).json({ message: 'Error registering fertilizer company', error: error.message });
    }
};

// Get all Fertilizer Companies
exports.getAllFertilizerCompanies = async (req, res) => {
    try {
        const companies = await Fertilizercompany.find();
        res.status(200).json({ companies });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fertilizer companies', error: error.message });
    }
};

// Get a specific Fertilizer Company by ID
exports.getFertilizerCompanyById = async (req, res) => {
    try {
        const company = await Fertilizercompany.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Fertilizer company not found' });
        }
        res.status(200).json({ company });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fertilizer company', error: error.message });
    }
};

// Update a Fertilizer Company
exports.updateFertilizerCompany = async (req, res) => {
    try {
        const updatedCompany = await Fertilizercompany.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Fertilizer company not found' });
        }
        res.status(200).json({ message: 'Fertilizer company updated successfully!', company: updatedCompany });
    } catch (error) {
        res.status(500).json({ message: 'Error updating fertilizer company', error: error.message });
    }
};

// Delete a Fertilizer Company
exports.deleteFertilizerCompany = async (req, res) => {
    try {
        const deletedCompany = await Fertilizercompany.findByIdAndDelete(req.params.id);
        if (!deletedCompany) {
            return res.status(404).json({ message: 'Fertilizer company not found' });
        }
        res.status(200).json({ message: 'Fertilizer company deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting fertilizer company', error: error.message });
    }
};
