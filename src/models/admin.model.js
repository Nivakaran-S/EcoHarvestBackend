const User = require("./users.mongo");
const Admin = require('./admin.mongo')


const createAdmin = async (data) => {
  try {
    const admin = await Admin.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
    });

    return admin._id;
  } catch (error) {
    console.error("Error creating admin:", error);
    
  }
};


const getAdminDetailsById = async (id) => {
  try {
    const cleanId = id.replace(/^:/, '').trim(); // remove leading colon and trim whitespace
    const user = await User.findById(cleanId);
    
    if (!user) {
      console.error("User not found");
      return null;
    }

    const admin = await Admin.findById(user.entityId);

    return [admin, user];
  } catch (err) {
    console.error("Error fetching admin by ID:", err);
    return null;
  }
};





module.exports = {
  createAdmin,
  getAdminDetailsById
};
