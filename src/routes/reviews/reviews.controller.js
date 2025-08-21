
const {createReview, getReviewsByProductId } = require('../../models/reviews.model')

const httpCreateReview = async (req, res) => {
    try {
        const review = await createReview(req.body);
        return res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const httpGetReviewsByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await getReviewsByProductId(productId);
        return res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews by product ID:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    httpCreateReview,
    httpGetReviewsByProductId
}