const {
  createCompany,
  findCompany,
  updateCompany,
  deleteCompany,
  getAllCompany,
} = require("../../models/company.model");

const httpGetAllCompanies = async (req, res) => {
  try {
    return res.status(201).json(await getAllCompany());
  } catch (err) {
    return res.status(500).send("Error in getting all companies", err);
  }
};

const httpCreateCompany = async (req, res) => {
  try {
    return res.status(201).json(await createCompany(req.body));
  } catch (err) {
    return res.status(500).send("Error in creating company", err);
  }
};

const httpUpdateCompany = async (req, res) => {
  try {
    return res.status(200).json(await updateCompany(req.body));
  } catch (err) {
    return res.status(500).send("Error in updating company", err);
  }
};

const httpDeleteCompany = async (req, res) => {
  try {
    return res.status(200).json(await deleteCompany(req.params.id));
  } catch (err) {
    return res.status(500).send("Error in deleting company", err);
  }
};

const httpFindCompany = async (req, res) => {
  try {
    return res.status(200).json(await findCompany(req.query.companyName));
  } catch (err) {
    return res.status(500).send("Error in finding company", err);
  }
};

module.exports = {
  httpCreateCompany,
  httpUpdateCompany,
  httpDeleteCompany,
  httpFindCompany,
  httpGetAllCompanies,
};
