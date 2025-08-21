
const {createAdvertisement, updateAdvertisement, getAllAdvertisements} = require('../../models/advertisement.model');

const httpUpdateAdvertisement = async (req, res) => {
    try {
        const advertisement = await updateAdvertisement(req.body);
        return res.status(200).json(advertisement);
    } catch (error) {
        console.error('Error updating advertisement:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const httpCreateAdvertisement  = async (req, res) => {
    try {
        const advertisement = await createAdvertisement(req.body);
        return res.status(201).json(advertisement);
    } catch (error) {
        console.error('Error creating advertisement:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const httpGetAllAdvertisements = async (req, res) => {
    try {
        const advertisements = await getAllAdvertisements();
        return res.status(200).json(advertisements);
    } catch (error) {
        console.error('Error fetching advertisements:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    httpCreateAdvertisement,
    httpGetAllAdvertisements,
    httpUpdateAdvertisement
}