
const { httpCreateCustomer, httpGetCustomerDetailsById, httpUpdateCustomer, httpGetAllCustomers, httpDeleteCustomer, httpFindCustomer } = require('./customers.controller');

const express = require('express');

const CustomerRouter = express.Router();

CustomerRouter.get('/', httpGetAllCustomers);
CustomerRouter.post('/create', httpCreateCustomer);
CustomerRouter.post('/update', httpUpdateCustomer);
CustomerRouter.delete('/:id', httpDeleteCustomer);
CustomerRouter.get('/:firstName', httpFindCustomer);
CustomerRouter.get('/details/:userId', httpGetCustomerDetailsById); 


module.exports = CustomerRouter;