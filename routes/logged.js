var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();
var passport = require('passport');
var {client, dbName} = require('../db/mongo');

passport.deserializeUser(async function(id, done) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('usersR');
  collection.findOne({_id:ObjectId(id)}, function (err, user) {
      console.log(user)
    done(err, user);
  });
});

/* GET home page. */
 /* router.get('/', function(req, res, next) {
   res.render('chatp');
 }); */

router.get('/',(req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.redirect('/login')
  }
}, function(req, res, next) {
  res.render('logged');
});

router.get('/chat',(req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.redirect('/login')
  }
}, function(req, res, next) {
  res.render('chat');
});

module.exports = router;