const express = require('express');
const router = express.Router();
router.get('/me', (req,res)=>{
  if(!req.user) return res.json({loggedIn:false});
  res.json({loggedIn:true, user:{name:req.user.name, email:req.user.email, role:req.user.role, photo:req.user.photo}});
});
module.exports = router;
