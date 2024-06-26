const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      validate: [validator.isEmail, "Please provide valid email id"],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: ["true", "Password is required"],
      minLength: [8, "Password must be of length 8"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "please provide confirm password"],

      //this will work only on save() or .create()
      validate: {
        validator: function (el) {
          return this.password === el; // el is value of passwordConfirm // value is accesible
        },
        message: "Password and Confirm Password should be same",
      },
    },
    passwordChangedAt:{
      type: Date
    },
    //explicitly defining timestamps to use select property
    createdAt: {
      type: Date,
      select: false,
    },

    updatedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

//encrypting the password
userSchema.pre("save", async function () {
  //check if passwors is changed
  if (!this.isModified("password")) return next();

  //encrypting the password
  this.password = await bcryptjs.hash(this.password, 15);

  //removing passwordConfirm field || now this section will not be saved in db
  this.passwordConfirm = undefined;
  next();
});

//instance method on userSchema
userSchema.methods.isCorrectPassword = async function (
  candidatePass,
  userPass
) {
  //this will  not available if it's arrow function
  //we can't use this.password bcz pssword select property is false is schema

  //candidatePass : send by user to verify | it's a plain text
  //userPass is encrypted password stored in db

  return await bcryptjs.compare(candidatePass, userPass);
};

userSchema.methods.isPasswordChangedAfter = async function(jwtTimestamps){
  const jwtSeconds = Math.floor(jwtTimestamps / 1000);

  // Get the passwordChangedAt timestamp in seconds
  const passTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);

  console.log("Password Changed Timestamp:", passTimestamp);
  console.log("JWT Timestamp:", jwtSeconds);

  // Compare and return true if password changed after jwtTimestamps
  return jwtSeconds < passTimestamp;
}

//will work on save and  create
userSchema.pre('save',function(next){
  if(this.isModified('password')){
    this.passwordChangedAt = Date.now();
  }
  next();
});

userSchema.pre(/^(findOneAndUpdate|findByIdAndUpdate|updateOne)$/,function(next){
  //getting update to be applied
  const update = this.getUpdate();
  

  //checking if update is being applied direclty : {password:asdf};
  if(update.password){
    this.passwordChangeddAt = Date.now();
  }
  else if(update.$set && update.$set.password){
    this.passwordChangedAt = Date.now();
  }

  //remove confirm password
  this.passwordConfirm = undefined;

  next();
});



const User = mongoose.model("User", userSchema);

module.exports = User;
