const express = require("express");

const Tour = require("../Models/tour.js");

const APIFeatures = require("../utils/apiFeatures.js");
const catchAsync = require('../utils/catchAsync.js')


exports.aliasTop5 = (req, res, next) => {
  //sort=price,-ratingsAverage&page=1&limit=5
  req.query.sort = "price,-ratingsAverage";
  req.query.page = "1";
  req.query.limit = "5";
  next();
};

// class APIFeatures {
//   //query = Tour.find() is a query
//   //queryString = Object parsed from req.query

//   constructor(query, queryObj) {
//     this.query = query;
//     this.queryObj = queryObj;
//   }

//   filterQueryObj() {
//     // directly assignment gives reference to same object
//     //let queryObj = { ...req.query };
//     let queryObj = { ...this.queryObj };

//     let excludeObj = ["sort", "page", "limit", "fields"];
//     excludeObj.forEach((el) => {
//       delete queryObj[el];
//     });

//     let queryString = JSON.stringify(queryObj);
//     //simple regex exp to replace gte/lt/lte etc with $gte/$lt etc
//     queryString = queryString.replace(
//       /\b(gte|gt|lt|lte)\b/g,
//       (match) => `$${match}`
//     );

//     this.query = this.query.find(JSON.parse(queryString));

//     return this; // causes chaining of methods;
//   }

//   sort() {
//     let sortBy;
//     if (this.queryObj.sort) {
//       sortBy = this.queryObj.sort.split(",").join(" ");
//     } else {
//       //adding a default sort
//       sortBy = "-createdAt";
//     }

//     this.query = this.query.sort(sortBy);

//     return this; // for chaining
//   }

//   fieldLimiting() {
//     //fields will be supplied by command, field=name,duration,price,ratings
//     //need to do : query = query.select("name duration price ratings")
//     //prameters are seperated by space

//     if (this.queryObj.fields) {
//       const fields = this.queryObj.fields.split(",").join(" "); //string
//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select("-__v"); // excluding __v field from document
//     }

//     return this; // return this classs instance for chaining
//   }

//   pagination() {
//     let page = this.queryObj.page * 1 || 1; // * 1 changes string to number
//     let limit = this.queryObj.limit * 1 || 2;
//     const skip = (page - 1) * limit;
//     this.query =  this.query.skip(skip).limit(limit);

//     return this;
//   }
// }

exports.getAllTours = catchAsync(async (req, res) => {
 
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

exports.getSpecificTour = catchAsync (async (req, res) => {
 
    const resultTour = await Tour.findOne({ _id: req.params.id });
    //const resultTour = await Tour.findById(req.params.id); // same as above

    res.status(200).json({
      status: "success",
      data: {
        tour: resultTour,
      },
    });
  
});

exports.createNewTour = catchAsync( async (req, res) => {
 
    //1 way to create tour and save it

    // const newTour = new Tour(req.body);
    // await newTour.save();

    // 2nd way to create tour and save it

    const newTour = await Tour.create(req.body); // this promise return document saved in database;

    res.status(200).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  
});

exports.updateTour = catchAsync( async (req, res) => {

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

exports.deleteTour = catchAsync( async (req, res) => {
  
    await Tour.deleteOne({ _id: req.params.id });
    //const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: null,
    });
 
});

exports.getTourStats = catchAsync( async (req, res) => {
  
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
          _id: '$difficulty',
          totalTour: {
            $sum: 1,
          },
          totalRatings:{
            $sum:"$rating"
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
        $sort:{
          avgPrice:-1
        }
      }
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

exports.getMonthlyPlan = catchAsync( async(req,res)=>{


    const year = req.params.year * 1;

    const tour = await Tour.aggregate([
      {
        $unwind:{path:"$startDates"}
      },
      {
        $match:{
          startDates:{
            $gte:new Date(`${year}-01-01`),
            $lte:new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group:{
          _id:{$month:"$startDates"},
          tourCount:{
            $sum:1
          },
          tours:{$push:"$name"}
        }
      },
      {
        $addFields:{
          month:"$_id"
        }
      },
      
      {
        $sort:{
          tourCount:-1,
          
        }
      },
      {
        $project:{_id:0}
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