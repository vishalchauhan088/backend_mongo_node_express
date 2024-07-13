const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const AppError = require('./utils/appError');
const errorController = require('./controller/errorController.js')
const rateLimit = require('express-rate-limit');
const { default: helmet } = require("helmet");


// in this we will create user route:

const app = express();



//morgan middleware

// setting up headers using helmet || security practices

app.use(helmet()); //helmet() return a function || check documentation


console.log(process.env.NODE_ENV);  

if(process.env.NODE_ENV === 'development'){
  app.use(morgan("dev"));
}


//global middleware

const limiter = rateLimit({
  max:100,
  windowMs : 60*60*1000, // time in milliseconds
  message :"too many request !! try after sometimes"
})

app.use('/api',limiter);

//using middleware
app.use(express.json({limit:'10kb'})); //with option object
//app.use(express.json());

// dummy global middle ware
app.use((req, res, next) => {
  console.log("Hello from middleware :🤚 ");
  next(); // don't forege to call it
});

// a middle ware which add request time to req object

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews",reviewRouter);


// to handle unhandled routes5
app.all('*',(req,res,next)=>{

  // one way to do it

  // res.status(404).json({
  //   status:'fail',
  //   message:`Can''t find the url : ${req.originalUrl} on this server`
  // })


  // 2> handling erorr using global error handler middleware

  // const err = new Error(`an't find the url : ${req.originalUrl} on this server`)
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err); // this will call the global error handler


  //3 > using our custom error class : appError 

  next(new AppError(`an't find the url : ${req.originalUrl} on this server`,404));


})


// global error handling middleware
// just provide an argument in next function , express will know it as a error handling middleware next(error);

app.use(errorController);

module.exports = app;
