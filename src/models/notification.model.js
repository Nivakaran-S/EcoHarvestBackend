
const Notification = require('./notification.mongo')

const createNotification = async (data) => {
    try {
        const notification = await Notification.create({
            title: data.title,
            message: data.message,
            userId: data.userId,
        })
        return notification._id
    } catch (err) {
        console.error("Error creating notification:", err);
        return null;
    }
}


const getNotificationById = async (id) => {
    try {
        const cleanId = id.replace(/^:/, '').trim();
        const notification = await Notification.find({userId: cleanId})
        return notification
    } catch (err) {
        console.error("Error fetching notification by ID:", err);
        return null;
    }
}

const deleteNotificationById = async (id) => {
    try {
        const cleanId = id.replace(/^:/, '').trim();
        const notification = await Notification.findByIdAndDelete(cleanId)
        return notification
    } catch (err) {
        console.error("Error deleting notification by ID:", err);
        return null;
    }
}

module.exports = {
    createNotification,
    getNotificationById,
    deleteNotificationById
}
