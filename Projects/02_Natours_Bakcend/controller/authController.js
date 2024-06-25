const User = require("../Models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

const getToken = (id) => {
  const token = jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return token;
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = getToken(user._id);

  //201 for created
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1: check if email and password is present in body :else> send error

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 404));
  }

  // we can't directly provide password in .find({email:email,password:password}) as select:false in model
  // so we use .select()
  const user = await User.findOne({ email: email }).select("+password");

  // if !user then user.password will be null/undefiled so we directly move below line in conditional check

  // const correct = user.isCorrectPassword(password,user.password);
  console.log(user);

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new AppError("Either email or password is incorrect", 401));
  }

  //payload only contain _id object of mongodb
  let token = getToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
