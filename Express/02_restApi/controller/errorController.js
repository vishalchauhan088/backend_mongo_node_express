


function sendErrorDev (res,err){
  res.status(err.statusCode).json({
    status:err.status,
    error:err,
    errStack:err.stack,
    message:err.message
  })
}



function sendErroProd (res,err){

  if(err.isOperational === true){
    res.status(err.statusCode).json({
      status:err.status,
      message:err.message
    })
  }

  else {
    console.log('Something Went Wrong !!!!!!!!!!!!!!!!!!!!!!!!!!!!');


    res.status(err.statusCode).json({

      status:err.status,
      message:'something went very wrong' // send a generic error message: as it may be programming error
    })

  }




}





const errorController = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(process.env.NODE_ENV === 'development'){
      sendErrorDev(res,err);
    }
    else if( process.env.NODE_ENV === 'production'){
      sendErroProd(res,err);
    }

    //console.log(err.stack);
      // we will create custom error handler class with these properties
      // but error.message will be present as in original Error class.
      
     
  
      
}

module.exports = errorController;