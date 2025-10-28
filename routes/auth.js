const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
require('dotenv').config();
const router = express.Router();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      const role = (profile.emails && profile.emails[0] && profile.emails[0].value === process.env.OWNER_EMAIL) ? 'owner' : 'customer';
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails && profile.emails[0] && profile.emails[0].value,
        photo: profile.photos && profile.photos[0] && profile.photos[0].value,
        role
      });
    } else {
      // update photo/email if changed
      user.photo = profile.photos && profile.photos[0] && profile.photos[0].value || user.photo;
      user.email = profile.emails && profile.emails[0] && profile.emails[0].value || user.email;
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done)=> done(null, user.id));
passport.deserializeUser((id, done)=> User.findById(id).then(u=>done(null,u)).catch(e=>done(e,null)));

router.get('/google', passport.authenticate('google', { scope:['profile','email'] }));
router.get('/google/callback', passport.authenticate('google',{ failureRedirect:'/' }), (req,res)=>res.redirect('/buy'));
router.get('/logout', (req,res)=>{ req.logout(()=>{}); res.redirect('/'); });

module.exports = router;
