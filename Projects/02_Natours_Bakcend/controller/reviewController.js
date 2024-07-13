const Review = require('../Models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync.js');


exports.getAllReview = catchAsync(async(req,res,next)=>{

    let query = Review.find();

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

    const userId = req.user._id;
    req.body.user = userId;

    const review = await Review.create(req.body);

    res.status(200).json({
        status:"success",
        data:{
            review : review
        }
    })

});