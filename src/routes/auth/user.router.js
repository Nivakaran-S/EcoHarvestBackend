
const express = require('express');
const verifyToken = require('../authMiddleware/authMiddleware');
const authorizeRoles = require('../authMiddleware/roleMiddleware');
const UserRouter = express.Router();

// Only admin can access this route
UserRouter.get('/admin', verifyToken, authorizeRoles("Admin"), (req, res) => {
    res.json({message: 'Welcome Admin'});
})



// Both admin and vendor can access this route
UserRouter.get('/vendor', verifyToken, authorizeRoles("Vendor"), (req, res) => {
    res.json({message: 'Welcome Vendor'});
})


// All users can access this route
UserRouter.get('/user', verifyToken, authorizeRoles("Customer", "manager", "Admin"), (req, res) => {
    res.json({message: 'Welcome User'});
})


module.exports = UserRouter;
