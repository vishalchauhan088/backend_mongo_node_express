const User = require("../Models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("../controller/handlerFactory");

const filterObj = (body, ...allowedFields) => {
  let result = {};

  allowedFields.forEach((key) => {
    if (body[key] !== undefined) {
      result[key] = body[key];
    }
  });

  return result;
};

// creating this middleware to set params id to user id and call getOne on user
exports.setUserID = (req, res, next) => {
  req.params.id = req.user._id;

  next();
};
exports.getMe = factory.getOne(User);

exports.getAllUsers = factory.getAll(User);
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const user = await User.find();
//   res.status(200).json({
//     status: "success",
//     length: user.length,
//     data: {
//       user: user,
//     },
//   });
// });
exports.updateMe = catchAsync(async (req, res, next) => {
  // here user can update only name and email

  // 1) check if user trying to update password, if yes, throw error
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError("You can not update password here", 400));
  }

  // 2) we can't use .save() here : as it require confirm password and other required field

  // 3) so best way to do it findByIdAndUpdate().
  // 4) but first filter out the req.body as it can contain role:admin -> security issue

  // const filterObj = {
  //     email:req.body.email || undefined,
  //     name: req.body.name || undefined,
  // }

  const filteredBody = filterObj(req.body, "name", "email"); // this also does the same;
  console.log(filteredBody);

  // since it's protected route | req.user contrains the user doc
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  }).select("-__v -passwordChangedAt");

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // we will not actually delete the user instead we will set teh property active: false;
  // it's a protected route | user doc is present in req

  await User.findByIdAndUpdate(req.user._id, { active: false }); // sets active to false;

  // now we want only active usr to show in any query include find like findOne, find, findById,findByIdAndUpdate etc
  // so , make a query middleware for this userSchema.pre(/^find/,callback); check user model

  res.status(200).json({
    status: "success",
    data: null,
  });
});
exports.createNewUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

exports.getSpecificUser = factory.getOne(User);
// exports.getSpecificUser = catchAsync(async (req, res, next) => {
//   const user = await User.find({ _id: req.params.id });
//   res.status(200).json({
//     status: "success",
//     length: user.length,
//     data: {
//       user: user,
//     },
//   });
// });
//for using factory reset here we need to write a middleware to remove critical field update
// like , role, password, etc

// we will pass which field we want to keep while updating
// bodyRestrictTo('name','email') // only name and email will be in body to be updated

// --------------use filter body
// exports.bodyRestrictTo = (...fields) => {
//   return (req, res, next) => {
//     let newBody = {};

//     fields.forEach((el) => {
//       newBody[el] = req.body[el];
//     });

//     req.body = newBody;

//     next();
//   };
// };

exports.updateUser = factory.updateOne(User);
// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "This route is not yet defined",
//   });
// };

exports.deleteUser = factory.deleteOne(User);
// exports.deleteUser = (req,res)=>{
//     res.status(500).json(
//         {
//             'status':'error',
//             'message':'This route is not yet defined'
//         }
//     );

// }
