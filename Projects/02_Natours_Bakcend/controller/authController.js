const { promisify } = require("util");
const User = require("../Models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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


const createSendToken = (user, statusCode, res) => {
  const token = getToken(user._id);

  const cookieOptions =  {
    //keep it in milllisceconds
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure:true, // can be send only on https
    httpOnly:true // can't be accessed and modified by brower 
  }
  if(process.env.NODE_ENV === 'production'){
    cookieOptions.secure = true;
  }

  //password is coming while signup and login in user object
  // 1. we have set password : select:false but still present
  // 1. while sinup we are creating document no fetching from db, so password is present
  // 2. while login, we are explicitly fetching password to verify so it is present in document

  // let's remove password from the user object
  user.password = undefined;

  res.cookie("jwt", token,cookieOptions);
  //201 for created
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  createSendToken(user, 200, res);
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
  createSendToken(user, 200, res); //sending res object also
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // authorization: 'Bearer asdfasdflkjf'
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in. Please login"));
  }

  console.log(token);

  //2) verify the token | if it has been manipulated
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  //3) check if the user is present by that id present in token
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("User belonging to token no longer exists!", 401));
  }

  //4) check if password has not been updated after token was issued
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("Password has changed !. Relogin", 401));
  }

  req.user = user;

  //Grant ACESS TO ROUTER
  next();
});

// create a highorder function which will returna middleware
// we will do it as instance method

exports.restrictTo = (...roles) => {
  return function (req, res, next) {
    //now we have access to rest parameter(role)
    // user is available from protect middlware is adding logged in user
    if (!roles.includes(req.user.role)) {
      // if not authorized we will throw an error
      return next(new AppError("You are not authorized for this.", 403));
    }

    // if authorized we will let user do next work which he is authorized to by calling next() middlware

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) get user based on posted email

  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("No user found with that email!", 404));
  }

  //2) generate random reset token
  // it will be as instance method

  const resetToken = user.createPasswordResetToken();
  //above function call has modified the user doc || now we need to save it

  await user.save({ validateBeforeSave: false });

  console.log("user saved");

  //3) send reset token as email

  //build url on which user will visit to rest

  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  //building message to send
  const message = `Forgot your password ? , submit your patch request to:\n ${url}.\n.If you didn't , Please Ignore this`;

  //sending email | it's asynchronous function

  try {
    await sendEmail({
      email: user.email,
      subject: " your password reset token . Valid for 10 min only",
      message: message,
    });
  } catch (error) {
    console.log(error, error.stack);
    //reset token and expired property
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    //save in database
    await user.save({ validateBeforeSave: false });

    //send error
    return next(
      new AppError("There was error sending email . Try again later", 500)
    );
  }

  res.status(200).json({
    status: "success",
    message: "Email send",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on token

  //since token is encrypted in database , so we need to encrypt it
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("No user found with that token", 400));
  }
  // 2) set new password if only token is not expired and there is user

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  //user.changedPasswordAt = Date.now();
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 3) update changedpasswordAt property
  // we will update the changedPasswordAt property in usreSchema as instance method

  await user.save();

  // 4) logged user in and send jwt token

  createSendToken(user, 200, res);

  // const token = getToken(user._id);

  // res.status(200).json({
  //   status:'success',
  //   token
  // })
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  // user will send passwordCurrent,password,confirmPassword

  // 1) get the user

  // let currentUserToken = req.headers.authorization.split[1] // get the token from headers and [Bearer, asldfkjaslf]

  // const decoded = await promisify(jwt.verify)(currentUserToken, process.env.JWT_SECRET);

  // let user = User.findOne({_id:decoded.id});

  //this router will be protected so we have user in req object

  //explicitly ask for password

  let user = await User.findById(req.user._id).select("+password");

  // 2) check if posted password is correct
  //(user.password === req.body.password) can't do this as user providing plain password and db has hash/encrypted pass

  const correct = await user.isCorrectPassword(
    req.body.passwordCurrent,
    user.password
  );

  if (!correct) {
    return next(new AppError("Wrong Password", 401));
  }

  // 3) if password correct | update the password | encryption will be takes care by pre save hook

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // 4) send jwt token
  createSendToken(user, 200, res);

  // const token = getToken(user._id) //sign token

  // res.status(200).json({
  //   status:'success',
  //   token
  // })
});
