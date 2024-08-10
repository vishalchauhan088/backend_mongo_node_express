const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const Tour = require("./tourModel");

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

reviewSchema.statics.calcAverageRatings = async function (tour) {
  const stats = await this.aggregate([
    {
      $match: {
        tour: tour,
      },
    },

    {
      $group: {
        _id: null,
        totalRatings: { $sum: 1 },
        ratingsAverage: {
          $avg: "$rating",
        },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tour, {
    ratingsQuantity: stats[0].totalRatings,
    ratingsAverage: stats[0].ratingsAverage,
  });

  console.log("after saving the document average ratings :", stats);
};
//--------------------------------------------virtual functions--------------------

//-------------------------------------------document  middleware------------

reviewSchema.post("save", async function (doc) {
  await this.constructor.calcAverageRatings(doc.tour); // or this.tour
  // Review.calcAverageRatings(this.tour);
});
//-----------------------------------------Query middlware------------
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  // }).populate({
  //   path:'tour',
  //   select:"_id name"
  // })

  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
