const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

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
    role: {
      type: String,
      enum: ["user", "guide", "lead-guid", "admin"],
      default: "user",
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
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
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
userSchema.pre("save", async function (next) {
  //check if passwors is changed
  if (!this.isModified("password")) return next();

  //encrypting the password
  this.password = await bcryptjs.hash(this.password, 15);

  //removing passwordConfirm field || now this section will not be saved in db
  this.passwordConfirm = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 2000; // decreasing some time

  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to present query object
  // so apply new filter which includes only active user

  this.find({ active: true });

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

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(JWTTimestamp, changedTimestamp);

    return JWTTimestamp < changedTimestamp; // 200 < 300 -> true
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // we need to put this hashed token to database so that we can compare

  this.passwordResetToken = hashedToken;

  // settting up passwordResetExpires time
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min in ms

  console.log({ resetToken }, { hashedToken });
  //return plain test token which will be sent to user by email
  console.log("returning from createpqsswordresettoken");
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
