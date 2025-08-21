

const { getAdminDetailsById } = require('../../models/admin.model');



const httpGetAdminById = async (req, res) => {
    try {
        const adminId = req.params.id;
        const adminDetails = await getAdminDetailsById(adminId);
        if (!adminDetails) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.status(200).json(adminDetails);
    } catch (err) {
        console.error("Error in getting admin details", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    httpGetAdminById,
    
}
