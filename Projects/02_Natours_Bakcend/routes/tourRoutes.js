const express = require("express");
const tourControllers = require("../controller/tourController");
const authController = require("../controller/authController");
const reviewRouter = require("../routes/reviewRoutes");
const AppError = require("../utils/appError");

const reviewController = require("../controller/reviewController");

const router = express.Router();

// redirecting the review related task to review router
router.use("/:tourID/reviews", reviewRouter);

router.get(
  "/get-top-5",
  tourControllers.aliasTop5,
  tourControllers.getAllTours
);
router.get("/tour-stats", tourControllers.getTourStats);
router.get(
  "/monthly-plan/:year",
  authController.protect,
  authController.restrictTo("admin", "lead-guide", "user"),
  tourControllers.getMonthlyPlan
);

router
  .route("/")
  .get(tourControllers.getAllTours)
  // .post(tourControllers.checkBody,tourControllers.createNewTour);
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourControllers.createNewTour
  );

router
  .route("/:id")
  .get(tourControllers.getSpecificTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourControllers.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourControllers.deleteTour
  );

module.exports = router;
