const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// seed products
(async function init(){
  try {
    const c = await Product.countDocuments();
    if(c===0){
      await Product.create([
        {name:'Crimson Heritage Toran', description:'Handcrafted crimson toran.', brand:'RoyalCraft', price:499, image:'/images/toran_red.png'},
        {name:'Verdant Calm Toran', description:'Eco-friendly modern weave.', brand:'GreenWeave', price:449, image:'/images/toran_green.png'},
        {name:'Golden Aura Toran', description:'Golden accents with neutral tones.', brand:'AureaHome', price:799, image:'/images/toran_gold.png'}
      ]);
      console.log('Seeded products');
    }
  } catch(e){ console.error(e); }
})();

router.get('/', async (req,res)=>{
  const prods = await Product.find().sort({createdAt:-1});
  res.json({ok:true, products:prods});
});

module.exports = router;
