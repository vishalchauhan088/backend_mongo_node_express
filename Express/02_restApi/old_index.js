import express from "express";
import fs from "fs";

const tours = JSON.parse(fs.readFileSync("./data/tours-simple.json"));

const app = express();

app.use(express.json());

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});
// specific tour

app.get("/api/v1/tours/:id", (req, res) => {
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
});

// //optional params
// app.get('/api/v1/tours/:id/:y/:z?',(req,res)=>{

//     console.log(req.params);

//     res.json(
//         {
//             "status":"success"

//         }
//     )
// })

app.post("/api/v1/tours", (req, res) => {
  console.log(req);
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
});

// patch requrest

app.patch("/api/v1/tours/:id", (req, res) => {
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
});

//delete

app.delete("/api/v1/tours/:id", (req, res) => {
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
});

const port = 5000;

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
