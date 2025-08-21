const company = require("./company.mongo");

async function createCompany(data) {
  return await company.create({
    firstName: data.firstName,
    lastName: data.lastName,
    companyName: data.companyName,
    phoneNumber: data.phoneNumber,
    email: data.email,
    category: data.category,
    lastLogin: Date.now(),
  });
}

async function findCompany(query) {
  return await company.find({
    companyName: query,
  });
}

async function updateCompany(data) {
  return await company.find(
    {
      _id: data.id,
    },
    data,
    {
      upsert: true,
    }
  );
}

async function deleteCompany(id) {
  return await company.deleteOne({
    _id: id,
  });
}

async function getAllCompany() {
  return await company.find({});
}

module.exports = {
  createCompany,
  findCompany,
  updateCompany,
  deleteCompany,
  getAllCompany,
};

module.exports = company;
