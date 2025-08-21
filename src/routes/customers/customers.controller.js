
const { createCustomer, getCustomerDetailsById, updateCustomer, deleteCustomer, findCustomer, getAllCustomers } = require('../../models/customers.model');

const httpGetCustomerDetailsById = async (req, res) => {
    try {
        const customerId = req.params.userId; // Assuming the ID is passed as a URL parameter
        const customer = await getCustomerDetailsById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ message: 'Error fetching customer', error });
    }
}

const httpGetAllCustomers = async (req, res) => {
    try {
        return res.status(201).json(await getAllCustomers());
    } catch(err) {
        return res.status(500).send('Error in getting all customers', err);
    }
}

const httpCreateCustomer = async (req, res) => {
    try {
        return res.status(201).json(await createCustomer(req.body));
    } catch(err) {
        return res.status(500).send('Error in creating customer', err);
    }
}

const httpUpdateCustomer = async (req, res) => {
    try {
        return res.status(200).json(await updateCustomer(req.body));
    } catch(err) {
        return res.status(500).send('Error in updating customer', err);
    }
}

const httpDeleteCustomer = async (req, res) => {
    try {
        return res.status(200).json(await deleteCustomer(req.params.id));
    } catch(err) {
        return res.status(500).send('Error in deleting customer', err);
    }
}

const httpFindCustomer = async (req, res) => {
    try {
        return res.status(200).json(await findCustomer(req.query.firstName));
    } catch(err) {
        return res.status(500).send('Error in finding customer', err);
    }
}


module.exports = {
    httpCreateCustomer,
    httpUpdateCustomer,
    httpDeleteCustomer,
    httpFindCustomer,
    httpGetAllCustomers,
    httpGetCustomerDetailsById
}