const express = require("express");
const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");

// mergeParams:true to get params from nested routes

// tour/:tourID/reviews
// /reviews
const router = express.Router({mergeParams:true});

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(authController.protect,authController.restrictTo('user'),reviewController.createReview);


module.exports = router;