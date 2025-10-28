const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  googleId:{type:String, unique:true, required:true},
  name:String,
  email:String,
  photo:String,
  role:{type:String, default:'customer'},
  createdAt:{type:Date, default:Date.now}
});
module.exports = mongoose.model('User', userSchema);
