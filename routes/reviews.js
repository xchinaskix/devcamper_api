const express = require('express');
const { getReviews, getReview } = require('../controllers/reviews');
const { protect, authorize } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedReults');
const Review = require('../models/Review');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Review, { path: 'bootcamp', select: 'name description' }),
    getReviews
  );

router.route('/:id').get(getReview);

// router
//   .route('/:id')

module.exports = router;
