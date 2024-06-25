
const User = require('../Models/userModel');
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