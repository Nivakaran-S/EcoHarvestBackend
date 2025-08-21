

const Vendor = require('./vendors.mongo');
const User = require('./users.mongo');

const createVendor = async (data) => {
  try {
    const vendor = await Vendor.create({
        firstName: data.firstName,
        lastName: data.lastName,
        businessName: data.businessName,
        phoneNumber: data.phoneNumber,
        email: data.email,
    });

    return vendor._id.toString();
  } catch (error) {
    console.error("Error creating Vendor:", error);
    
  }
};

const getVendorDetailsById = async (id) => {
  try {
    const cleanId = id.replace(/^:/, '').trim(); // remove leading colon and trim whitespace
    const user = await User.findById(cleanId);
    console.log(id)
      
    if (!user) {
      console.error("User not found");
      return null;
    }

    const vendor = await Vendor.findById(user.entityId);

    return [vendor, user];
  } catch (err) {
    console.error("Error fetching admin by ID:", err);
    return null;
  }
};

module.exports = {
    createVendor,
    getVendorDetailsById
};