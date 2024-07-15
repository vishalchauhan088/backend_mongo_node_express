const express = require("express");
const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");

// mergeParams:true to get params from nested routes

// tour/:tourID/reviews
// /reviews
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setTourUserIDs,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getSpecificReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
