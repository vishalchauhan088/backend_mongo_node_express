const mongoose = require("mongoose");
const slugify = require("slugify");

const validator = require("validator");
const User = require("./userModel");
const AppError = require("../utils/appError");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "A Tour must have a name"],
      unique: true,
      minLength: [10, "A Tour name should be minimun 10"],
      maxLength: [40, "A Tour name should be max size of 40"],
      // validate:[validator.isAlpha,"name must contain character"]
    },
    duration: {
      type: Number,
      require: [true, "A Tour must have Duration is required"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A Tour must have Group size is required"],
    },
    difficulty: {
      type: String,
      // enum:["easy","medium","difficult"]
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty can be either: easy, medium, difficult",
      },
    },

    rating: {
      type: Number,
      default: 3,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "A tour can have max 5 ratingAverage"],
      max: [5, "A tour can have max 5 ratingAverage"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: true,
    },
    priceDiscount: {
      type: Number,
      /**
       * Validates the priceDiscount field.
       * @param {number} val - The value to be validated.
       * @returns {boolean} - Returns true if the validation is correct, false otherwise.
       */
      // validate: function(val){
      //   // Check if the priceDiscount is less than the price
      //   return this.price >val; // return true if validation is correct
      // }

      validate: {
        validator: function (val) {
          //this only  points to current document being created || not work on update
          return this.price > val;
        },
        message: "priceDiscount {VALUE} should be less than price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A Tour must have Summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have cover Image"],
    },
    // guides:Array,
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    images: [String], // array of string
    // createAt:{
    //     type:Date, // converts millisends date in actual date
    //     default:Date.now() // js data in milliseconds
    // },
    startDates: [Date],
    startLocation: {
      //GeoJson
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number], // longtitude and latitude
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number], // longtitude and latitude
        address: String,
        descriptions: String,
        day: Number,
      },
    ],
    // Explicitly define the timestamps fields with select: false
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//-------------------------------Virtual Properties---------------------------------

//1> virtual properties:
// this are not saved in database but derived at the time of api call
//fat model thin controller

// tourSchema.index({ price: 1 }); // asc order // -1 means desc order

// compound index
tourSchema.index({ price: 1, ratingsAverage: -1 }); // asc order // -1 means desc order
tourSchema.index({ slug: 1 }); // asc order // -1 means desc order

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//this is virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

//-------------------------------Document MIddleWAre---------------------------------

// document middleware: pre and post
//works on .save() and .create() only
// has access to (this)
// has prameter access of next();
tourSchema.pre("save", function (next) {
  this.slug = slugify(`${this.name}`, { lower: true, trim: true }); // we need to have slug in schema else will not save in database

  next();
});

// inserting the guides in tour itself

// tourSchema.pre('save',async function(next){
//   const guidesPromise = this.guides.map( async (id)=>{
//     const user = await User.findById(id);
//     if(!user){
//       next(new AppError(`No guide found with id : ${id}`,401))
//     }
//     return user;
//   })
//   this.guides = await Promise.all(guidesPromise);
// })

tourSchema.pre("save", function (next) {
  console.log("inside pre save: document is being saved !!!!!");
  next();
});

// document middleaware : post middleware
// now access to (this) i.e., document to be saved
// but access to doc , which was saved as parameneter in callback
// has access to next()

tourSchema.post("save", function (doc, next) {
  // doc is finished document
  console.log("inside post save", doc.name);
  next();
});
tourSchema.post("save", function (doc, next) {
  console.log("inside post save");
  next();
});

//-------------------------------Query MIddleWAre---------------------------------

//------pre-----

// it has access to this: query object reference not doc reference
// find is query middleware
// will work only for find not findOne or findById etc

// tourSchema.pre('find',function(next){
//   this.find({secretTour:{$ne:true}}); // finding tour which are false only
//   next();
// })

//for findById do this
//simlilarly can be done  for findOne etc;
// or using regex

// tourSchema.pre('findById',function(){
//   this.find({secretTour:{$ne:true}});
// })

//Using regex for everyfunction starting with find
//it will work for all hook starting with find : find,findOne,findById etc

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });

  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next(); //don't forget to call the next() function in middleware
});

// ----post------

//post query middleare has access to docs,next as parameter
// docs are the docs return after executing query
// also access to the this : query

tourSchema.post(/^find/, function (docs, next) {
  console.log("excution time :", Date.now() - this.start);
  // console.log('doc are fetched ');
  next();
});

//

//----------------------------Aggregation Middleware ------------------------------------------
// this refers to aggregation array of  object which was created ,
// this will be executed before aggregation
//this.pipeline() is array of object which was stages
tourSchema.pre("aggregate", function (next) {
  //console.log(this.pipeline());
  // let add another stage in our aggregation object to exclude the docs having secretTour : true;
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // at first position of array
  //console.log(this.pipeline());

  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
