
const Review = require('./reviews.mongo')
const Product = require('./products.mongo')
const User = require('./users.mongo')
const Individual = require('./individual.mongo')


const createReview = async (reviewData) => {
  try {
    const { productId, userId, rating } = reviewData;

    
    const reviewResult = await Review.findOneAndUpdate(
      { userId, productId },
      { $set: reviewData },
      { upsert: true, new: true, rawResult: true } 
    );

    
    const isNewReview = reviewResult.upsertedCount === 1;

    if (isNewReview) {
      
      await Product.findOneAndUpdate(
        { _id: productId },
        [
          {
            $set: {
              numberOfReviews: { $add: ["$numberOfReviews", 1] },
              averageRating: {
                $cond: [
                  { $eq: ["$numberOfReviews", 0] },
                  rating, 
                  { 
                    $divide: [
                      { $add: [
                        { $multiply: ["$averageRating", "$numberOfReviews"] },
                        rating
                      ]},
                      { $add: ["$numberOfReviews", 1] }
                    ]
                  }
                ]
              }
            }
          }
        ]
      );
    }

    return reviewResult.value;

  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};


const getAllReviews = async () => {
    try {
        const reviews = await Review.find({});
        return reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
}

const getReviewsByProductId = async (productId) => {
  try {
    
    const reviews = await Review.find({ productId });

    
    const userIds = [...new Set(reviews.map(review => review.userId))];

    
    const users = await User.find(
      { _id: { $in: userIds } },
      'entityId'
    );

    
    const entityIds = users.map(user => user.entityId);
    const individuals = await Individual.find(
      { _id: { $in: entityIds } },
      'firstName lastName'
    );

    
    return reviews.map(review => {
      const user = users.find(u => u._id.equals(review.userId));
      const individual = individuals.find(i => i._id.equals(user?.entityId));
      
      return {
        ...review._doc,
        userName: individual 
          ? `${individual.firstName} ${individual.lastName}`
          : 'Unknown User'
      };
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};


module.exports = {
    createReview,
    getReviewsByProductId
}