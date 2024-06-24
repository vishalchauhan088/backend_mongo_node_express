const dotenv = require('dotenv').config();
const app = require("./index");
const PORT = process.env.PORT  || 3000;
const mongoose = require('mongoose');
const Tour = require('./Models/tour');
//console.log(process.env);

console.log("starting connection with database !!");
const uri = process.env.DATABASE_URI.replace('<password>',process.env.DATABASE_PASSWORD);
// console.log(uri);
mongoose.connect(uri).then(con =>{
  //console.log(con.connection);
  console.log('database connection succesfull');
}).catch(e=>{
  console.log("database connection error",e);
})

// const testTour = new Tour({
//   name:"tour 11",
//   rating:4,
//   price:300
// })
// testTour.save()
//   .then(doc =>{
//     console.log("Document successfully saved to data base ",doc);
//   })
//   .catch(e=>{
//     console.log("error while saving the testTour",e.message);
//   })


app.listen(PORT, () => {
  console.log(`app listening on port : ${PORT}`);
});
