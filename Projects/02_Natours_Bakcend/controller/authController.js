const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');


exports.signUp = catchAsync(async (req,res,next)=>{
    const user = await User.create({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm : req.body.passwordConfirm

    });

    //201 for created 
    res.status(201).json({
        status:"success",
        data:{
            user: user
        }

    })
});