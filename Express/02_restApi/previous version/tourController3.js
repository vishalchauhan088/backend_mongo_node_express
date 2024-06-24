const express = require("express");
const catchAsync = require("../../utils/catchAsync.js");
const Tour = require("../Models/tour.js");

const APIFeatures = require("../utils/apiFeatures.js");

exports.aliasTop5 = (req, res, next) => {
  //sort=price,-ratingsAverage&page=1&limit=5
  req.query.sort = "price,-ratingsAverage";
  req.query.page = "1";
  req.query.limit = "5";
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filterQueryObj()
    .sort()
    .fieldLimiting()
    .pagination();
  //features.filterQueryObj();
  const tour = await features.query;

  //const tour = await Tour.find({}); // returns all the data save as above

  res.status(200).json({
    status: "success",
    length: tour.length,
    data: {
      tour: tour,
    },
  });
});

exports.getSpecificTour = catchAsync(async (req, res, next) => {
  const resultTour = await Tour.findOne({ _id: req.params.id });
  //const resultTour = await Tour.findById(req.params.id); // same as above

  res.status(200).json({
    status: "success",
    data: {
      tour: resultTour,
    },
  });
});

exports.createNewTour = catchAsync(async (req, res, next) => {
    console.log("--------------inside create new tour--------------");
    const newTour = await Tour.create(req.body); // this promise return document saved in database;
  
    res.status(200).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  
    
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.deleteOne({ _id: req.params.id });
  //const tour = await Tour.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: null,
  });
});

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
