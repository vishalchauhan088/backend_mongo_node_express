const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');


exports.signUp = catchAsync(async (req,res,next)=>{
    const user = await User.create(req.body);

    //201 for created 
    res.status(201).json({
        status:"success",
        data:{
            user: user
        }

    })
});