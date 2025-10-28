const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const CustomOrder = require('../models/customOrder');

function ensureAuth(req,res,next){ if(req.user) return next(); res.status(401).json({ok:false, msg:'not auth'}); }

router.get('/', ensureAuth, async (req,res)=>{
  let cart = await Cart.findOne({userId:req.user.id});
  if(!cart) return res.json({ok:true, items:[]});
  res.json({ok:true, items:cart.items});
});

router.post('/add', ensureAuth, async (req,res)=>{
  const {productId, qty} = req.body;
  if(!productId) return res.status(400).json({ok:false});
  let cart = await Cart.findOne({userId:req.user.id});
  if(!cart) cart = await Cart.create({userId:req.user.id, items:[]});
  const prod = await Product.findById(productId);
  if(!prod) return res.status(400).json({ok:false});
  cart.items.push({productId:prod._id, name:prod.name, price:prod.price, qty: qty||1, isCustom:false});
  cart.updatedAt = new Date();
  await cart.save();
  res.json({ok:true, cart});
});

// remove item by index or productId/customOrderId
router.post('/remove', ensureAuth, async (req,res)=>{
  const {idx} = req.body;
  let cart = await Cart.findOne({userId:req.user.id});
  if(!cart) return res.json({ok:false});
  if(typeof idx !== 'undefined') cart.items.splice(idx,1);
  await cart.save();
  res.json({ok:true});
});

module.exports = router;
