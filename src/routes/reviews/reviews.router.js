
const express = require('express');
const { httpCreateReview, httpGetReviewsByProductId } = require('./reviews.controller');

const ReviewsRouter = express.Router();

ReviewsRouter.get('/:productId', httpGetReviewsByProductId);
ReviewsRouter.post('/', httpCreateReview);

module.exports = ReviewsRouter;