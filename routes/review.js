const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");


// Post review router

router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.postReviews));
  
  //Delete Review router
  
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReviews)
  );

  module.exports = router;