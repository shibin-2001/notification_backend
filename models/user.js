const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
     username:{type:String,default:''},
     profileimage:{type:String,default:''},
     isOnline:{type:Boolean,default:false},
     phonenumber:{type:String,required:true},
     createdAt: { type: Date, default: Date.now },
     updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
  
module.exports =  User