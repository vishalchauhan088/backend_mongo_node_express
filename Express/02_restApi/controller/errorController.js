const AppError = require("../utils/appError");


const handleCastError = (err)=>{
  return new AppError(`Invalid ID  ${err.path} : ${err.value}` , 400)
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
    res.status(err.statusCode).json({
      status:err.status,
      message:err.message
    })
  }
  else {

    console.log('Something Went Wrong !!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    res.status(err.statusCode).json({

      status:err.status,
      message:'something went very wrong', // send a generic error message: as it may be programming error
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
      let error = {...err}
      
      if(error.path === '_id'){
       
        error =  handleCastError(error,res);
      }

      
      sendErroProd(error,res);
    }

    //console.log(err.stack);
      // we will create custom error handler class with these properties
      // but error.message will be present as in original Error class.
      
     
  
      
}

module.exports = errorController;