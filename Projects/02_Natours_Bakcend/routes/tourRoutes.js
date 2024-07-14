const express = require("express");
const tourControllers = require("../controller/tourController");
const authController = require("../controller/authController");
const reviewRouter = require('../routes/reviewRoutes');
const AppError = require("../utils/appError");

const reviewController = require("../controller/reviewController");

const router = express.Router();
// const { ObjectId } = require("mongoose").Types;

// // create review : POST tour/:tourID/reviews
// // get all reviews : GET tour/:tourID/reviws
// // get review : GET tour/:tourID/reviews/:reviewID
// router
//   .route("/:tourID/reviews")
//   .post(authController.protect, authController.restrictTo("user"), reviewController.createReview)
//   .get(reviewController.getAllReview);


// redirecting the review related task to review router
router.use('/:tourID/reviews',reviewRouter);





// param middleware
// router.param('id',(req,res,next,val)=>{
//     console.log(`Tour id is: ${val}`);
//     next();
// })

// router.param('id',tourControllers.checkId);

router.get(
  "/get-top-5",
  tourControllers.aliasTop5,
  tourControllers.getAllTours
);
router.get("/tour-stats", tourControllers.getTourStats);
router.get("/monthly-plan/:year", tourControllers.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, tourControllers.getAllTours)
  // .post(tourControllers.checkBody,tourControllers.createNewTour);
  .post(tourControllers.createNewTour);

router
  .route("/:id")
  .get(tourControllers.getSpecificTour)
  .patch(tourControllers.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourControllers.deleteTour
  );



module.exports = router;
