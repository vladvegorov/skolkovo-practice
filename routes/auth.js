const express = require('express');
const passport = require('passport');
const mongoose = require("mongoose");
const router = express.Router();
const LocalStrategy = require('passport-local').Strategy;

const User = require("../models/user");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get('/login', function(req, res, next) {
    if (req.isAuthenticated()) {
        var userdata = { authorized: true, name: req.user.username };
    } else {
        var userdata = { authorized: false, name: ''};
    }
    res.render('login', { user: userdata });
});

router.post('/login/password', passport.authenticate('local', { 
  failureRedirect: '/login', 
  successRedirect: '/'
}), (err, req, res, next) => {
  if (err) next(err);
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/', );
  });
});

router.get('/signup', function(req, res, next) {
    if (req.isAuthenticated()) {
        var userdata = { authorized: true, name: req.user.username };
    } else {
        var userdata = { authorized: false, name: ''};
    }
    res.render('signup', { user: userdata });
});

router.post('/signup', async function(req, res, next) {
    User.register(
        new User({ 
          username: req.body.username 
        }), 
        req.body.password, function (err, msg) {
          if (err) {
            res.send(err);
          } else {
            res.redirect('/');
          }
        }
    );
});

module.exports = router;

