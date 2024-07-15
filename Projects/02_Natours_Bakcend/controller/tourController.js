const express = require("express");

const Tour = require("../Models/tourModel.js");
const APIFeatures = require("../utils/apiFeatures.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");
const reviewController = require("./reviewController.js");
const factory = require("./handlerFactory.js");

exports.aliasTop5 = (req, res, next) => {
  //sort=price,-ratingsAverage&page=1&limit=5
  req.query.sort = "price,-ratingsAverage";
  req.query.page = "1";
  req.query.limit = "5";
  next();
};

exports.getAllTours = factory.getAll(Tour);

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   //uncomment this console to see how it is being handled
//   //console.log(x);
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filterQueryObj()
//     .sort()
//     .fieldLimiting()
//     .pagination();
//   //features.filterQueryObj();
//   const tour = await features.query;

//   //const tour = await Tour.find({}); // returns all the data save as above

//   res.status(200).json({
//     status: "success",
//     length: tour.length,
//     data: {
//       tour: tour,
//     },
//   });
// });
exports.getSpecificTour = factory.getOne(Tour, {
  path: "reviews",
  select: "-__v -passwordChangedAt",
});
// exports.getSpecificTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate("reviews");
//   // 1 way to populate

//   // const tour = await Tour.findOne({ _id: req.params.id }).populate('guides');

//   // 2 way to populate
//   // const tour = await Tour.findOne({ _id: req.params.id }).populate({
//   //   path:'guides',
//   //   select:'-__v -passwordChangedAt'
//   // });

//   // ---------------------3 way move to model

//   //const resultTour = await Tour.findById(req.params.id); // same as above

//   //adding a 404 not found  as without this json will output status success

//   if (!tour) {
//     return next(new AppError("No result found with that ID", 404)); // callling our custom error function
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       tour: tour,
//     },
//   });
// });

exports.createNewTour = factory.createOne(Tour);
// exports.createNewTour = catchAsync(async (req, res, next) => {
//   //1 way to create tour and save it

//   // const newTour = new Tour(req.body);
//   // await newTour.save();

//   // 2nd way to create tour and save it

//   const newTour = await Tour.create(req.body); // this promise return document saved in database;

//   res.status(200).json({
//     status: "success",
//     data: {
//       tour: newTour,
//     },
//   });
// });

exports.updateTour = factory.updateOne(Tour);
// exports.updateTour = catchAsync( async (req, res,next) => {

//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if(!tour){
//       return  next(new AppError('No document found with that ID',404));
//     }
//     res.status(200).json({
//       status: "success",
//       data: {
//         tour: tour,
//       },
//     });

// });

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync( async (req, res,next) => {

//     const tour = await Tour.deleteOne({ _id: req.params.id });

//     // check tour.deleteCount : it will return 0 if no document was found to delete
//     //const tour = await Tour.findByIdAndDelete(req.params.id);

//     //adding a 404 tour in case tour to be deleted is not found
//     console.log(tour);
//     if( tour.deletedCount===0 ){

//       return next(new AppError('No document found with that ID',404)); //calling next to go to global error handler middleware
//     }

//     res.status(200).json({
//       status: "success",
//       length:tour.length,
//       data: null,
//     });

// });

exports.getTourStats = catchAsync(async (req, res, next) => {
  const tour = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: {
          $gte: 4.5,
        },
      },
    },
    {
      $group: {
        _id: "$difficulty",
        totalTour: {
          $sum: 1,
        },
        totalRatings: {
          $sum: "$rating",
        },
        avgRating: {
          $avg: "$ratingsAverage",
        },
        avgPrice: {
          $avg: "$price",
        },
        minPrice: {
          $min: "$price",
        },
        maxPrice: {
          $max: "$price",
        },
      },
    },
    {
      $sort: {
        avgPrice: -1,
      },
    },
    // ,
    // {
    //   $match:{_id:{$ne:'easy'}}
    // }
  ]);

  res.status(200).json({
    status: "success",
    length: tour.length,
    data: {
      tour: tour,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const tour = await Tour.aggregate([
    {
      $unwind: { path: "$startDates" },
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        tourCount: {
          $sum: 1,
        },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },

    {
      $sort: {
        tourCount: -1,
      },
    },
    {
      $project: { _id: 0 },
    },
  ]);

  res.status(200).json({
    status: "success",
    length: tour.length,
    data: {
      tour: tour,
    },
  });
});
