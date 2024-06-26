
const User = require('../Models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers =catchAsync( async (req,res,next)=>{
    const user = await User.find(req.query);
    res.status(500).json(
        {
            status:'success',
            length:user.length,
            data: user
        }
    );

});
exports.createNewUser = (req,res)=>{
    res.status(500).json(
        {
            'status':'error',
            'message':'This route is not yet defined'
        }
    );
    
}
exports.getSpecificUser = catchAsync (async(req,res,next)=>{
    
    
    res.status(500).json(
        {
            'status':'error',
            'message':'This route is not yet defined'
        }
    );
    
})
exports.updateUser =catchAsync( async (req,res,next)=>{
    //handling password change as custom validator will not run on update
    if(!(req.body.password && req.body.password && req.body.password === req.body.passwordConfirm)){
        return next(new AppError('Something Wrong with password and passwordConfirm',401));
    }

    const user = await User.findByIdAndUpdate(req.user._id,req.body,{new:true});

    if(!user){
        return next(new AppError('User not found by that ID',404));
    }
    res.status(200).json(
        {
            status:'success',
            data:{
                user:user
            }
        }
    );
    
})
exports.deleteUser = catchAsync( async(req,res,next)=>{

    const user = await User.findByIdAndDelete(req.params.id);

    //deleteOne -> returns null when successfully delete else  user.deletedCount === 0 else 0
    //findByIdAndDelete : returns user that have been deleted
    if(!user){
        return next(new AppError('No user found by that ID'),401);
    }
    res.status(500).json(
        {
            status:'success',
            message: user
        }
    );
    
});