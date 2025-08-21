
const {httpCreateNotification, httpGetNotificationById, httpDeleteNotificationById} = require('./notification.controller')

const express = require('express')
const Notificationrouter = express.Router()

Notificationrouter.post('/', httpCreateNotification)
Notificationrouter.get('/:id', httpGetNotificationById)
Notificationrouter.delete('/:id', httpDeleteNotificationById)

module.exports = Notificationrouter
