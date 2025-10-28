const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name:String, description:String, brand:String, price:Number, image:String, createdAt:{type:Date, default:Date.now}
});
module.exports = mongoose.model('Product', schema);
