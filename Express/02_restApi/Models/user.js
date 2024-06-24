
const mongoose = require('mongoose');
const validator = require('validator');

//name,email,photo,password,passwordConfirm

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please tell use your name"],
      
    },
    email:{
        type:String,
        required:[true,'please provide your email'],
        lowerCase:true,
        validate:[validator.isEmail,"A User email should be valid"],
    },
    photo:String,
    password:{
        type:String,
    required:[true,'Please provide password'],
        minLength:[8,"min length should be 8"]
        
    },
    passwordConfirm:{
        type:String,
        required:true,
        
    }
},{
    timeStamps:true,
});

const User = mongoose.model('User',userSchema);

module.exports = User; 

