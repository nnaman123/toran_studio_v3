const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const CustomOrder = require('../models/customOrder');
const nodemailer = require('nodemailer');
require('dotenv').config();

const storage = multer.diskStorage({
  destination: function(req,file,cb){ cb(null, 'public/uploads'); },
  filename: function(req,file,cb){ cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage });

function ensureAuth(req,res,next){ if(req.user) return next(); res.status(401).json({ok:false, msg:'not auth'}); }

router.post('/create', ensureAuth, upload.single('image'), async (req,res)=>{
  try {
    const obj = {
      userId: req.user.id,
      email: req.body.email,
      message: req.body.message,
      image: req.file ? '/uploads/' + req.file.filename : null
    };
    const order = await CustomOrder.create(obj);

    // email
    const transporter = nodemailer.createTransport({ service:'gmail', auth:{ user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }});
    const receivers = (process.env.RECEIVERS||process.env.EMAIL_USER).split(',').map(s=>s.trim());
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: receivers,
      subject: 'New Custom Toran Request',
      text: `New request from ${obj.email}\nMessage: ${obj.message}\nView in admin panel.`
    });

    res.json({ok:true, order});
  } catch (err) {
    console.error(err);
    res.status(500).json({ok:false, error:String(err)});
  }
});

router.get('/my', ensureAuth, async (req,res)=>{
  const list = await CustomOrder.find({userId:req.user.id}).sort({createdAt:-1});
  res.json({ok:true, list});
});

module.exports = router;
