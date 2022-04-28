var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();
var passport = require('passport');
var {client, dbName} = require('../db/mongo');
var mercadopago = require('mercadopago');
var x = require("../helpers/helperHBS");




passport.deserializeUser(async function(id, done) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('usersR');
  collection.findOne({_id:ObjectId(id)}, function (err, user) {
    done(err, user);
  });
});

/* GET home page. */
 router.get('/', function(req, res, next) {
   res.render('index');
 });

// router.get('/',(req, res, next) => {
//   if (req.isAuthenticated()) {
//       return next();
//   } else {
//       res.redirect('/login')
//   }
// }, function(req, res, next) {
//   res.render('index');
// });

var mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken("TEST-45580239064098-040520-31b32a7c1b8b2e5fbc218a5e7a22dc95-813058479");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); 

router.get('/pagar', function(req, res, next) {
  res.render('pagar', { title: 'Express' });
});

router.get('/',  async function(req, res, next) {
  var response = await mercadopago.payment_methods.listAll();
  res.render('index', { payment_methods: response.body });
});

//Pago con tarjeta
 
router.post('/pago', function(req, res, next) {
  console.log(req.body)
  var payment_data = {
    transaction_amount: Number(req.body.transactionAmount),
    token: req.body.token,
    description: req.body.description,
    installments: Number(req.body.installments),
    payment_method_id: req.body.paymentMethodId,
    issuer_id: req.body.issuer,
    payer: {
      email: req.body.cardholderEmail,
      identification: {
        number: req.body.identificationNumber
      }
    }
  };
  
  mercadopago.payment.save(payment_data)
    .then(function(response) {
      res.status(response.status).json({
        status: response.body.status,
        status_detail: response.body.status_detail,
        id: response.body.id
      });
    })
    .catch(function(error) {
      console.error(error)
    });
})

//Pago con otro medio
router.post('/oxxo',function(req, res, next){
  console.log(req.body);
  var payment_data = {
    transaction_amount: 100,
    description: 'Título del producto',
    payment_method_id: req.body.paymentMethod,
    payer: {
      email: req.body.payerEmail
    }
  };
  
  console.log(payment_data);
  
  mercadopago.payment.create(payment_data)
    .then(function(response) {
      res.status(response.status).json({
        status: response.body.status,
        status_detail: response.body.status_detail,
        url: response.body.transaction_details.external_resource_url,
        id: response.body.id
      });
    })
    .catch(function(error) {
      console.error(error)
    });
})



module.exports = router;
