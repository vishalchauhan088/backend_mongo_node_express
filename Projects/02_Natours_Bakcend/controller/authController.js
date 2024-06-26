const {promisify} = require('util');
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
    passwordChangedAt:req.body.passwordChangedAt,
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

exports.protect = catchAsync(async(req,res,next)=>{
  // 1) Getting token and check if it is there
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

    // authorization: 'Bearer asdfasdflkjf'
    token = req.headers.authorization.split(' ')[1];
    
  }
  if(!token){
    return next(new AppError('You are not logged in. Please login'));
  }
  
  console.log(token);

  //2) verify the token | if it has been manipulated
  const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
  console.log(decoded);


  //3) check if the user is present by that id present in token
  const user = await User.findById(decoded.id);
  if(!user){
    return next(new AppError('User belonging to token no longer exists!',401));
  }


  //4) check if password has not been updated after token was issued
  if(user.changedPasswordAfter(decoded.iat)){
    return next(new AppError('Password has changed !. Relogin',401));
  }

  req.user = user;
  

  //Grant ACESS TO ROUTER
  next();
})
