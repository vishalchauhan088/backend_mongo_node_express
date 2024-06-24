import express from "express";
import fs from "fs";
import morgan from 'morgan';

const tours = JSON.parse(fs.readFileSync("./data/tours-simple.json"));

const app = express();


//morgan middleware

app.use(morgan('dev'));





//using middleware
app.use(express.json());

// dummy global middle ware
app.use((req, res , next )=>{
  console.log("Hello from middleware :🤚 ");
  next(); // don't forege to call it
});

// a middle ware which add request time to req object

app.use((req,res,next)=>{
  req.reqestTime = new Date().toISOString();
  next();
})


const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime:req.reqestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};

const getSpecificTour = (req, res) => {
  // console.log(req.params);

  // params value are in string, so changing it to int
  const id = req.params.id * 1; // multiplying changes to int

  //using implicit return

  const tour = tours.find((each) => each.id === id);

  // return
  // const tour = tours.find((each)=>{
  //     return each.id === id;
  // }) // find the tours

  // checking if param id is not greater than present tours
  // if(id > tours.length){
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    result: 1,
    data: {
      tour,
    },
  });
};

const createNewTour = (req, res) => {
  console.log(req.body);
  let newId = tours[tours.length - 1].id + 1;
  let newTour = Object.assign({ id: newId }, req.body);

  // pushing in fetched tour array
  tours.push(newTour);

  //writing new tour array in file || async file writing as we can't block loop
  fs.writeFile("./data/tours-simple.json", JSON.stringify(tours), (err) => {
    //sending the data when it is written to file
    res.status(201).send({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  });
};

const updateTour = (req, res) => {
  console.log(req.params);
  console.log(req.body);

  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: "< updated tour here > ",
    },
  });
};

const deleteTour = (req, res) => {
  // we have actually not implemented the deletion of data from file

  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: "failed",
      message: "Invalid ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: null, // specifies that data is deleted
  });
};

// creating server ||  or app

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours',createNewTour);
// app.get('/api/v1/tours/:id', getSpecificTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);

//chaining

app
  .route("/api/v1/tours")
  .get(getAllTours)
  .post(createNewTour);

  

app
  .route("/api/v1/tours/:id")
  .get(getSpecificTour)
  .patch(updateTour)
  .delete(deleteTour);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`app listening on port : ${PORT}`);
});
