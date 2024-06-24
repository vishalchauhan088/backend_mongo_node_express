const express = require("express");
const tourControllers = require('../controller/tourController');
const AppError = require("../utils/appError");

const router = express.Router();
const {ObjectId} = require('mongoose').Types


// param middleware
// router.param('id',(req,res,next,val)=>{
//     console.log(`Tour id is: ${val}`);
//     next();
// })

// router.param('id',tourControllers.checkId);



router.get('/get-top-5',tourControllers.aliasTop5,tourControllers.getAllTours);
router.get('/tour-stats',tourControllers.getTourStats);
router.get('/monthly-plan/:year',tourControllers.getMonthlyPlan)

router
  .route("/")
  .get(tourControllers.getAllTours)
  // .post(tourControllers.checkBody,tourControllers.createNewTour);
  .post(tourControllers.createNewTour);


router
  .route("/:id")
  .get(tourControllers.getSpecificTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = router;
