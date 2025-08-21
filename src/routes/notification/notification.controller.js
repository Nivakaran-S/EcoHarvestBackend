
const {createNotification, getNotificationById, deleteNotificationById} = require('../../models/notification.model')


const httpCreateNotification = async (req, res) => {
    try {
        const notificationId = await createNotification(req.body)
        res.status(201).json({message: 'Notification created successfully', notificationId})
    } catch (err) {
        console.log("Error in creating notification", err);
        return res.status(500).json({message: err})
    }
}

const httpGetNotificationById = async (req, res) => {
    try {
        const notification = await getNotificationById(req.params.id)
        if (!notification) {
            return res.status(404).json({message: 'Notification not found'})
        }
        res.status(200).json(notification)
    } catch (err) {
        console.log("Error in getting notification by ID", err);
        return res.status(500).json({message: err})
    }
}

const httpDeleteNotificationById = async (req, res) => {
    try {
        const notification = await deleteNotificationById(req.params.id)
        if (!notification) {
            return res.status(404).json({message: 'Notification not found'})
        }
        res.status(200).json({message: 'Notification deleted successfully'})
    } catch (err) {
        console.log("Error in deleting notification by ID", err);
        return res.status(500).json({message: err})
    }
}

module.exports = {
    httpCreateNotification,
    httpGetNotificationById,
    httpDeleteNotificationById
}