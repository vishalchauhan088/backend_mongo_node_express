
const catchAsync = fn =>{
    console.log("-------------------catch Async handler--------------------")
    return (req,res,next)=>{
        fn(req,res,next).catch(error => next(error));
    }
}

module.exports = catchAsync;