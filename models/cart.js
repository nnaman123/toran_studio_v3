const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
  items:[{
    productId:{type:mongoose.Schema.Types.ObjectId, ref:'Product', default:null},
    customOrderId:{type:mongoose.Schema.Types.ObjectId, ref:'CustomOrder', default:null},
    name:String,
    price:Number,
    qty:{type:Number, default:1},
    isCustom:{type:Boolean, default:false}
  }],
  updatedAt:{type:Date, default:Date.now}
});
module.exports = mongoose.model('Cart', schema);
