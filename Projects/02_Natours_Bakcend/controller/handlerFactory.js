const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.deleteOne({ _id: req.params.id });
    console.log("deleted doc", doc);

    if (doc.deletedCount === 0) {
      return next(new AppError("No document found with that ID", 404)); //calling next to go to global error handler middleware
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  });
};
exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        tour: doc,
      },
    });
  });
};

exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        tour: doc,
      },
    });
  });
};

exports.getOne = (Model, populateOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const doc = await query;
    //const tour = await Tour.findById(req.params.id).populate("reviews");

    if (!doc) {
      return next(new AppError("No result found with that ID", 404)); // callling our custom error function
    }

    res.status(200).json({
      status: "success",
      data: {
        tour: doc,
      },
    });
  });
};

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    // handling special case of getting all review , where we also need to get review for spcific tour

    let filter = {};
    if (req.params.tourID) {
      filter = { tour: req.params.tourID };
    }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filterQueryObj()
      .sort()
      .fieldLimiting()
      .pagination();
    //features.filterQueryObj();
    const doc = await features.query;
    // const doc = await features.query.explain();

    res.status(200).json({
      status: "success",
      length: doc.length,
      data: {
        data: doc,
      },
    });
  });
};
