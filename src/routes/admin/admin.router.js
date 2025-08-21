
const {httpGetAdminById} = require('./admin.controller')

const express = require('express')

const AdminRouter = express.Router()

AdminRouter.get('/:id', httpGetAdminById)


module.exports = AdminRouter