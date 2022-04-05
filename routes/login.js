var express = require('express');
var router = express.Router();
var {client, dbName} = require('../db/mongo');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var bcrypt = require('bcrypt');
const Joi = require('joi');

passport.use(new LocalStrategy(
  async function(username, password, done) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('usersR');
    const schema =  Joi.object({
      user: Joi.string().trim().email().required(),
      pass: Joi.string().min(8).max(15)
    });
    collection.findOne({ user: username }, async function (err, user) {
      await schema.validateAsync({user: username}, user.pass);
      const savedHash = await bcrypt.compare(password, user.pass);
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!savedHash) { return done(null, false); }
      return done(null, user);
    });
  }
));
  
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/register', function(req, res, next) {
    main(req.body)
    .then(()=>{
      res.redirect('/login');
    })
    .catch(()=>{
      res.redirect('/login');
      console.error('Ingrese credenciales validas');
    })
    .finally(()=>{
      client.close();
    })
});

async function main(data) {
  // Use connect method to connect to the server
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('usersR');
  const schema =  Joi.object({
    user: Joi.string().trim().email().required(),
    pass: Joi.string().min(8).max(15)
  });
  await schema.validateAsync({user: data.user, pass: data.password});
  let passwordHash = await bcrypt.hash(data.password, 8);
  await collection.insertOne(
    {
      user: data.user,
      pass: passwordHash
    }
  )
}

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('Valid Cred');
    res.redirect('../logged');
  });

  router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
  });

module.exports = router;
