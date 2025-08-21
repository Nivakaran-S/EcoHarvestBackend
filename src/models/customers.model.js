

const Customer = require('./customers.mongo');
const Individual = require('./individual.mongo');
const Company = require('./company.mongo');
const User = require('./users.mongo')
const {createNotification} = require('./notification.model')
const bcrypt = require('bcrypt');

const getCustomerDetailsById = async (id) => {
  try {
    const cleanId = id.replace(/^:/, '').trim(); // remove leading colon and trim whitespace
    const user = await User.findById(cleanId);

    
    if (!user) {
      console.error("User not found");
      return null;
    }


    const customer = await Customer.findById(user.entityId);

    if(!customer) {
        console.error("Customer not found");
        return null;
    }

    if(customer.type === 'Individual') {
        const individual = await Individual.findById(customer.customerId);
        return [user, customer,  individual];
    } else if(customer.type === 'Company') {
        const company = await Company.findById(customer.customerId);
        return [user, customer, company];
    } else {
        console.error("Customer type not found");
        return 'Customer not found';
    }

  } catch (err) {
    console.error("Error fetching customer by ID:", err);
    return null;
  }
};


async function createIndividualCustomer(data) {
    let individual;

    try {
        const individual = await Individual.create({
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            email: data.email,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            address: data.address
        });

        const customer = await Customer.create({
            type: 'Individual',
            customerId: individual._id
        });


        return customer._id

    } catch(err) {
        console.log("Error in creating individual customer", err)
        if (individual) {
            await Individual.deleteOne({ _id: individual._id })
                .catch(cleanupErr => 
                    console.error("Cleanup failed:", cleanupErr)
                );
        }
        throw new Error(`Failed to create customer: ${err.message}`);
    }   
}


async function createCompanyCustomer(data) {
    try {
        const company = await Company.create({
            firstName: data.firstName,
            lastName: data.lastName,
            companyName: data.companyName,
            phoneNumber: data.phoneNumber, 
            email: data.email,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            category: data.category,
            address: data.address
        });

        const customer = await Customer.create({
            type: 'Company',
            customerId: company._id
        });


        return customer._id

    } catch(err) {
        console.log("Error in creating individual customer", err)
    }
}

async function findCustomer(query) {
    return await Customer.find({
        firstName: query
    })
}

const updateCustomer = async ( updatedData) => {
    try {
      const customerUser = await User.findById(updatedData.id);
      if (!customerUser) {
        return "User not found";
      }
  
      const id = updatedData.id;
      const customerEntityId = customerUser.entityId;
  
      const customer = await Customer.findById(customerEntityId);
      if (!customer) {
        return "Customer not found";
      }
  
      // Update customer fields if provided
      if (customer.type === 'Individual') {
        const individual = await Individual.findById(customer.customerId);
        if (!individual) {
          return "Individual customer not found";
        }
  
        if (updatedData.firstName) individual.firstName = updatedData.firstName;
        if (updatedData.lastName) individual.lastName = updatedData.lastName;
        if (updatedData.email) individual.email = updatedData.email;
        if (updatedData.phoneNumber) individual.phoneNumber = updatedData.phoneNumber;
        if (updatedData.address) individual.address = updatedData.address;
        if (updatedData.dateOfBirth) individual.dateOfBirth = updatedData.dateOfBirth;
  
        
        await individual.save();
      } else if (customer.type === 'Company') {
        const company = await Company.findById(customer.customerId);
        if (!company) {
          return "Company customer not found";
        }
  
        if (updatedData.firstName) company.firstName = updatedData.firstName;
        if (updatedData.lastName) company.lastName = updatedData.lastName;
        if (updatedData.email) company.email = updatedData.email;
        if (updatedData.phoneNumber) company.phoneNumber = updatedData.phoneNumber;
        if (updatedData.address) company.address = updatedData.address;
        if (updatedData.dateOfBirth) company.dateOfBirth = updatedData.dateOfBirth;
  

        await company.save();
      }
  
      // Update user fields if provided
      const user = await User.findOne({ entityId: customerEntityId, role: "Customer" });
      if (!user) {
        return "User record for customer not found";
      }
  
      if (updatedData.username) user.username = updatedData.username;
      if (updatedData.password) {
        const hashedPassword = await bcrypt.hash(updatedData.password, 10);
        user.password = hashedPassword;
      }
  
      await user.save();
  
      
      await createNotification({
        title: "Account Information Updated Successfully",
        message: "Account information updated",
        userId: id
      });
  
      return "Customer updated successfully";
    } catch (err) {
      console.error("Error updating customer:", err);
      return "Error updating customer";
    }
  };

async function deleteCustomer(id) {
    return await Customer.deleteOne({
        _id: id
    })
}

async function getAllCustomers() {
    return await Customer.find({})
}


module.exports = {
    createIndividualCustomer,
    createCompanyCustomer,
    findCustomer,
    updateCustomer,
    deleteCustomer,
    getAllCustomers,
    getCustomerDetailsById
}