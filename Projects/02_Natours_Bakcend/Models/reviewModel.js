const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, "Review can have min 1 rating"],
      max: [10, "Review can have max 10 rating"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A review must belong to a user"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "A review must belong to  a tour"],
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// // populate the review
// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "tour",
//     select: "name",
//   }).populate({
//     path: "user",
//     select: "name"
//   });

//   next();
// });

//--------------------------------------------virtual functions--------------------


//-------------------------------------------document  middleware------------


//-----------------------------------------Query middlware------------
reviewSchema.pre(/^find/,function(next){

  this.populate({
    path:'user',
    select:'name photo'})
  // }).populate({
  //   path:'tour',
  //   select:"_id name"
  // })

  next();
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
