
const errorController = (err,req,res,next)=>{

    //console.log(err.stack);
      // we will create custom error handler class with these properties
      // but error.message will be present as in original Error class.
      console.log("inside global handler")
      err.statusCode = err.statusCode || 500;
      err.status = err.status || "error";
  
      res.status(err.statusCode).json({
        status:err.status,
        message:"hello"
      })
}

module.exports = errorController;