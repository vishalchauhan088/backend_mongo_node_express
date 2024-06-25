const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require('bcryptjs');

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
    },
    passwordConfirm: {
      type: String,
      required: [true, "please provide confirm password"],

      //this will work only on save() or .create() 
      validate:{
        validator:function(el){
            return this.password === el; // el is value of passwordConfirm // value is accesible
        },
        message:"Password and Confirm Password should be same"
      }
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
userSchema.pre('save', async function(){
    //check if passwors is changed
    if(!this.isModified('password')) return next();

    //encrypting the password
    this.password = await bcryptjs.hash(this.password,15)

    //removing passwordConfirm field || now this section will not be saved in db
    this.passwordConfirm = undefined;
})

const User = mongoose.model("User", userSchema);

module.exports = User;
