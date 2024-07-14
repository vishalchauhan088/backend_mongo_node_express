const Review = require('../Models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync.js');
const factory = require('./handlerFactory.js');


exports.getAllReview = catchAsync(async(req,res,next)=>{

    let filter = {};
    if(req.params.tourID){
        filter = {tour:req.params.tourID};
    }

    let query = Review.find(filter);

    // if(req.params.tourID){
    //     query = query.find({tour:req.params.tourID});
    // }

    let features = new APIFeatures(query,req.query).filterQueryObj().sort().fieldLimiting().pagination();

    const review = await features.query;

    res.status(200).json({
        status:"success",
        length:review.length,
        data:{
            review:review
        }
    })
});

exports.createReview = catchAsync(async (req,res,next) =>{

    
   if(!req.body.user){ req.body.user = req.user._id;}
   if(!req.body.tour){ req.body.tour = req.params.tourID;}

    const review = await Review.create(req.body);

    res.status(200).json({
        status:"success",
        data:{
            review : review
        }
    })

});


exports.deleteReview = factory.deleteOne(Review);