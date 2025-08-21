
const Advertisement = require('./advertisement.mongo')

const createAdvertisement = async (advertisementData) => {
    try {
        const advertisement = new Advertisement(advertisementData);
        await advertisement.save();
        return advertisement;
    } catch (error) {
        console.error('Error creating advertisement:', error);
        throw error;
    }
}

const getAllAdvertisements = async () => {
    try {
        const advertisements = await Advertisement.find({});
        return advertisements;
    } catch (error) {
        console.error('Error fetching advertisements:', error);
        throw error;
    }
}

const updateAdvertisement = async (advertisementdata) => {
    try {
        const advertisement = await Advertisement.findByIdAndUpdate(advertisementdata.advertisementId, advertisementdata, { new: true });
        return advertisement;
    } catch (error) {
        console.error('Error updating advertisement:', error);
        throw error;
    }
}

module.exports = {
    createAdvertisement,
    getAllAdvertisements,
    updateAdvertisement,
}