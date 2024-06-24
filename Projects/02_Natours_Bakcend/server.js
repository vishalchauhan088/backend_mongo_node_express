const dotenv = require("dotenv").config();
const app = require("./index");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const Tour = require("./Models/tour");

// this will handled synchronous code exceptioin/error

process.on("uncaughtException", (err) => {
  console.log(
    "---------------------uncaughtException:------shutting down server-------------------------"
  );
  console.log("Error:", err.name, err.message);
 
  console.log('------shutting down server-------------------------');

  //process.exti(1) : abrupt way

  server.close(() => {
    process.exit(1);
  });
});

console.log("starting connection with database !!");
const uri = process.env.DATABASE_URI.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(uri).then((con) => {
  console.log("database connection succesfull");
});

// handling in unhandled error event at global level
// .catch((e) => {
//   console.log("database connection error", e);
// });



const server = app.listen(PORT, () => {
  console.log(`app listening on port : ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(
    "Unhandled REJECTION :-------------shutting down server------------------"
  );
  console.log("Error:", err.name, err.message);
 

  //process.exti(1) : abrupt way

  server.close(() => {
    process.exit(1);
  });
});

//creates synchronous uncaughtException error
// console.log(x);







