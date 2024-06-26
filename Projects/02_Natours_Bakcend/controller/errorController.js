const AppError = require("../utils/appError");
const mongoose = require('mongoose');

const handleCastError = (err)=>{
  return new AppError(`Invalid ID  ${err.path} : ${err.value}` , 400)
}

const handleDuplicateFieldsDB = (err)=>{
  return new AppError(`Duplicate Key Value :  ${err.keyValue.name} , Please enter another value` , 400)
}


const handleValidationError = (err)=>{
  
  console.log(err);
  let message = Object.values(err.errors).map(el => el.message);
  message = message.join('. ');


  return new AppError(`${message} validation error` , 400)
}

function sendErrorDev (err,res){
  res.status(err.statusCode).json({
    status:err.status,
    error:err,
    errStack:err.stack,
    message:err.message
  })
}



function sendErroProd (err,res){
  
  

  if(err.isOperational === true){
    console.log('error found : ',err,err.stack,err.message);

    res.status(err.statusCode).json({
      status:err.status,
      message:err.message
    })
  }
  else {

    console.log('Something Went Wrong !!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    res.status(err.statusCode).json({

      status:err.status,
      message:'something went very wrong', // send a generic error message: as it may be programming error,
      error:err
     
    })

  }




}





const errorController = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(process.env.NODE_ENV === 'development'){



      sendErrorDev(err,res);



    }


    else if( process.env.NODE_ENV === 'production'){

      //handling Cast error
      
      console.log(err);
      let error = {...err,message: err.message,stack:err.stack }
     
      
      // if( error.path === '_id'){
      // error.name === 'casteError' > not present in production env error object

      if(err instanceof mongoose.Error.CastError && err.kind === 'ObjectId'){
       
        error =  handleCastError(error);
      }

      if(error.code === 11000){
        error = handleDuplicateFieldsDB(error);
      }

      if(err instanceof mongoose.Error.ValidationError){
        error = handleValidationError(error);
      }

      if(err.name === 'JsonWebTokenError'){
        error = new AppError('JsonWebTokenError error !. Please relogin',404);
      }
      if(err.name === 'TokenExpiredError'){
        error = new AppError('Session Expired !. Login Again. ',401);
      }


      
      sendErroProd(error,res);
    }

    //console.log(err.stack);
      // we will create custom error handler class with these properties
      // but error.message will be present as in original Error class.
      
     
  
      
}

module.exports = errorController;