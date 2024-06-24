const express = require("express");

const Tour = require("../Models/tour.js");


exports.aliasTop5 = (req,res,next) => {
  //sort=price,-ratingsAverage&page=1&limit=5
  req.query.sort = "price,-ratingsAverage"
  req.query.page = '1';
  req.query.limit = '5';
  next();
}



// exports.checkId = (req,res,next,val) =>{

// }

// exports.checkBody = (req,res,next)=>{
//     console.log('inside body middlware')
//     if( !req.body.name || !req.body.price){
//       return res.status(400).json(
//         {
//           'status':'fail',
//           'message':'Missing name or price'
//         }
//       )
//     }

//     next();
//   }

exports.getAllTours = async (req, res) => {
  try {
    console.log("Query Object", req.query);
    console.log(typeof req.query);

    // Raw query Object
    // {
    //   difficulty: 'easy',
    //   sort: 'asc',
    //   page: '1',
    //   limit: '10',
    //   duration: { lt: '5' }
    // }

    // after filterQuery() // removing extra properties of req.query object and saving in another variable
    //{ difficulty: 'easy', duration: { lt: '5' } }

    // after advancedFilter() // adding $ here
    //{ difficulty: 'easy', duration: { '$lt': '5' } }

    //creating copy of query object
    let queryObj = { ...req.query };

    // 1)  removing extra thing in query object
    function filterQueryObj() {
      // directly assignment gives reference to same object
      let excludeObj = ["sort", "page", "limit", "fields"];
      excludeObj.forEach((el) => {
        delete queryObj[el];
      });

      console.log(
        "After filtering inside filterQuery fun",
        req.query,
        queryObj
      );
    }

    filterQueryObj();

    // 2) advanced filtering gte/lt etc
    // this will be query string : { difficulty: 'easy', duration: { gte: '5' } }
    // we want to add $ which is missing : { difficulty: 'easy', duration: { gte: '5' } }

    function advancedFilter() {
      let queryString = JSON.stringify(queryObj);

      console.log("Query string before advanced filer", queryString);

      //simple regex exp to replace gte/lt/lte etc with $gte/$lt etc
      queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (match) => `$${match}`
      );

      console.log("Query string after advancedFiler", queryString);

      return JSON.parse(queryString); // return the obj
    }

    queryObj = advancedFilter();
    console.log("Query OBject after advanced filer", queryObj);
    console.log(queryObj);

    // 3) doing sorting now sort=price

    console.log("BUilding Query");
    //02 >directly passing req.query
    query = Tour.find(queryObj);
    //can do extra filtering based on excludeObj || by chaining

    // execute the query
    function applySort() {
      let sortBy;
      if (req.query.sort) {
        // query = query.sort(req.query.sort);

        // let say if we want to short by price then by ratingsAverage .sort('price ratingsAverage');
        // as sort=price,ratingsAverage || we need to slit and join using space

        sortBy = req.query.sort.split(",").join(" "); // this will return the string
      } else {
        //adding a default sort

        sortBy = "-createdAt";
      }

      query = query.sort(sortBy);
    }

    applySort();

    //4) field limiting
    function applyFieldLimiting() {
      //fields will be supplied by command, field=name,duration,price,ratings
      //need to do : query = query.select("name duration price ratings")
      //prameters are seperated by space

      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" "); //string
        console.log("fields are :", fields);
        query = query.select(fields);
      } else {
        query = query.select("-__v"); // excluding __v field from document
      }
    }

     applyFieldLimiting();

    //5) pagination

    async function applyPagination() {
      let page = req.query.page * 1 || 1; // * 1 changes string to number
      let limit = req.query.limit * 1 || 2;

      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);
      //overflow handling
      if (req.query.page) {
        const tourCount = await Tour.countDocuments();

        if (skip >= tourCount) {
          throw new Error("This page doesn't exits");
        }
      }

      
    }

    await applyPagination();


    const tour = await query;

    // 01 > hardcoding for filtering
    // const tour = await Tour.find({
    //   difficulty:"easy",
    //   duration:5

    // })

    // 03 >> USING MONGOOSE

    // let tour = Tour.find()

    // if(req.query.duration){
    //   tour = tour.where('duration').equals(req.query.duration);

    // }
    // if(req.query.difficulty){
    //   tour = tour.where('difficulty').equals(req.query.difficulty);
    // }

    // tour = await tour;

    // save as above
    //let tour = Tour.find().where('duration').equals(req.query.duration).where('difficulty').equals(req.query.difficulty);
    //tour = await tour;

    // 04 >> without filter
    //const tour = await Tour.find({}); // returns all the data

    res.status(200).json({
      status: "success",
      length: tour.length,
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getSpecificTour = async (req, res) => {
  try {
    const resultTour = await Tour.findOne({ _id: req.params.id });
    //const resultTour = await Tour.findById(req.params.id); // same as above

    res.status(200).json({
      status: "success",
      data: {
        tour: resultTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createNewTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.deleteOne({ _id: req.params.id });
    //const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
