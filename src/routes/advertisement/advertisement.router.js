
const express = require('express');
const { httpCreateAdvertisement, httpGetAllAdvertisements} = require('./advertisement.controller');
const AdvertisementRouter = express.Router();

AdvertisementRouter.get('/', httpGetAllAdvertisements);
AdvertisementRouter.post('/', httpCreateAdvertisement);
AdvertisementRouter.post('/update', httpCreateAdvertisement);


module.exports = AdvertisementRouter;