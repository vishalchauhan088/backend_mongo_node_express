const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>{
   return catchAsync( async (req, res,next) => {
  
        const doc = await Model.deleteOne({ _id: req.params.id });
        console.log('deleted doc',doc);
       
        if( doc.deletedCount === 0){
          
          return next(new appError('No document found with that ID',404)); //calling next to go to global error handler middleware
        }
    
        res.status(200).json({
          status: "success",
          data: null,
        });
     
    });

}



