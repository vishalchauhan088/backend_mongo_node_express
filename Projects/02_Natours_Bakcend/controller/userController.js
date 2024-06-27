
const User = require('../Models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


const filterObj = (body,...allowedFields)=>{
    let result = {};

    allowedFields.forEach( key =>{
        if(body[key] !== undefined){
            result[key] = body[key];  
        }
    })

    return result;
    
}

exports.getAllUsers =catchAsync( async (req,res,next)=>{
    const user = await User.find(req.query);
    res.status(200).json(
        {
            status:'success',
            length:user.length,
            data: user
        }
    );

});
exports.updateMe = catchAsync(async(req,res,next)=>{
    // here user can update only name and email

    // 1) check if user trying to update password, if yes, throw error
    if(req.body.password || req.body.confirmPassword){

        return next(new AppError('You can not update password here',400));
    }

    // 2) we can't use .save() here : as it require confirm password and other required field

    // 3) so best way to do it findByIdAndUpdate().
    // 4) but first filter out the req.body as it can contain role:admin -> security issue

    // const filterObj = {
    //     email:req.body.email || undefined,
    //     name: req.body.name || undefined,
    // }

    const filteredBody = filterObj(req.body,'name','email') // this also does the same;
    console.log(filteredBody);


    // since it's protected route | req.user contrains the user doc
    const updatedUser = await User.findByIdAndUpdate(req.user._id,filteredBody,{
        new:true,
        runValidators:true
    }).select("-__v -passwordChangedAt")

    res.status(200).json({
        status:"success",
        data:{
            user:updatedUser
        }
        
    })



})
exports.createNewUser = (req,res)=>{
    res.status(500).json(
        {
            'status':'error',
            'message':'This route is not yet defined'
        }
    );
    
}
exports.getSpecificUser = (req,res)=>{
    res.status(500).json(
        {
            'status':'error',
            'message':'This route is not yet defined'
        }
    );
    
}
exports.updateUser = (req,res)=>{
    res.status(500).json(
        {
            'status':'error',
            'message':'This route is not yet defined'
        }
    );
    
}
exports.deleteUser = (req,res)=>{
    res.status(500).json(
        {
            'status':'error',
            'message':'This route is not yet defined'
        }
    );
    
}