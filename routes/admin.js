const express = require('express');
const router = express.Router();
const CustomOrder = require('../models/customOrder');
const Cart = require('../models/cart');
require('dotenv').config();

function ensureOwner(req,res,next){
  if(!req.user) return res.status(401).json({ok:false});
  if(req.user.email !== process.env.OWNER_EMAIL) return res.status(403).json({ok:false, msg:'forbidden'});
  next();
}

router.get('/customs', ensureOwner, async (req,res)=>{
  const items = await CustomOrder.find().sort({createdAt:-1}).populate('userId','name email');
  res.json({ok:true, items});
});

router.post('/action', ensureOwner, async (req,res)=>{
  const {id, action, price, comments} = req.body;
  const item = await CustomOrder.findById(id);
  if(!item) return res.json({ok:false});
  if(action==='viewed') item.viewed = true;
  if(action==='approve'){
    item.status='approved';
    if(price) item.price=price;
    if(comments) item.comments=comments;
    // add to user's cart
    let cart = await Cart.findOne({userId:item.userId});
    if(!cart) cart = await Cart.create({userId:item.userId, items:[]});
    cart.items.push({customOrderId:item._id, name:'Custom Toran', price: item.price || 0, qty:1, isCustom:true});
    await cart.save();
  }
  if(action==='reject'){ item.status='rejected'; if(comments) item.comments=comments; }
  await item.save();
  res.json({ok:true, item});
});

module.exports = router;
