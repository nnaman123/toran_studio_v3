const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
  email:String,
  message:String,
  image:String,
  status:{type:String, enum:['pending','approved','rejected'], default:'pending'},
  viewed:{type:Boolean, default:false},
  price:Number,
  comments:String,
  createdAt:{type:Date, default:Date.now}
});
module.exports = mongoose.model('CustomOrder', schema);
