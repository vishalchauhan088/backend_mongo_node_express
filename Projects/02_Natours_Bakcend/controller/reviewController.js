const Review = require("../Models/reviewModel");
const APIFeatures = require("../utils/apiFeatures");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync.js");
const factory = require("./handlerFactory.js");

exports.getAllReview = factory.getAll(Review);

exports.setTourUserIDs = (req, res, next) => {
  // we need to create middleware to add user and tour ids in body to create revieww
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  if (!req.body.tour) {
    req.body.tour = req.params.tourID;
  }

  next();
};

exports.getSpecificReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

// in review we need to handle of gettting all reviews and also all review of spcific tour if request is
//coming from nested route //
// hack for this problem
// just add filter object of {tour : req.params.tourID} in factory
// as tourID will be be in req object in only case where it is from nested route

// exports.getAllReview = catchAsync(async (req, res, next) => {
//   // this handle the nested route where it gets all teh revieww of a specific tour
//   let filter = {};
//   if (req.params.tourID) {
//     filter = { tour: req.params.tourID };
//   }

//   let query = Review.find(filter);

//   // if(req.params.tourID){
//   //     query = query.find({tour:req.params.tourID});
//   // }

//   let features = new APIFeatures(query, req.query)
//     .filterQueryObj()
//     .sort()
//     .fieldLimiting()
//     .pagination();

//   const review = await features.query;

//   res.status(200).json({
//     status: "success",
//     length: review.length,
//     data: {
//       review: review,
//     },
//   });
// });

// exports.createReview = catchAsync(async (req, res, next) => {
//   if (!req.body.user) {
//     req.body.user = req.user._id;
//   }
//   if (!req.body.tour) {
//     req.body.tour = req.params.tourID;
//   }

//   const review = await Review.create(req.body);

//   res.status(200).json({
//     status: "success",
//     data: {
//       review: review,
//     },
//   });
// });
