
const {register, login} = require('./auth.controller');
const {httpRegisterIndividualCustomer,httpUpdateVendor, httpUpdateAdmin, httpGetAllUsers, httpRegisterVendor, httpRegisterAdmin, httpRegisterCompanyCustomer} = require('./auth.controller')

const express = require('express');

const Userrouter = express.Router();


Userrouter.post('/register', register)
Userrouter.post('/login', login)
Userrouter.post('/registerIndividualCustomer', httpRegisterIndividualCustomer)
Userrouter.post('/registerCompanyCustomer', httpRegisterCompanyCustomer)
Userrouter.post('/registerAdmin', httpRegisterAdmin)
Userrouter.post('/registerVendor', httpRegisterVendor)
Userrouter.get('/', httpGetAllUsers)
Userrouter.post('/updateAdmin', httpUpdateAdmin)
Userrouter.post('/updateVendor', httpUpdateVendor)

module.exports = Userrouter;

