const express = require("express");
const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");

// mergeParams:true to get params from nested routes

// tour/:tourID/reviews
// /reviews
const router = express.Router({ mergeParams: true });
router.use(authController.protect);
router
  .route("/")
  .get(reviewController.getAllReview)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserIDs,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getSpecificReview)
  .delete(
    authController.restrictTo("admin", "user"),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo("admin", "user"),
    reviewController.updateReview
  );

module.exports = router;
