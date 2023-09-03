var express = require('express');
var router = express.Router();
var client = require('../db');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwt_key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
const cookie_name = "jwt";

/* LOGIN PAGE */
router.get('/', function(req, res, next) {
  // Sanitize parameters

  // Get parameters
  // var username = req.query.username;
  // var password = req.query.password;
  var redirect = req.query.redirect;
  
  res.status(200);
  return res.render('login', { page_title: 'Login', redirect: redirect });
});

/* LOGIN ATTEMPT */
router.post('/', function(req, res, next) {
  // Sanitize parameters

  // Check Content-Type
  // Adapted from: https://stackoverflow.com/questions/23271250/how-do-i-check-content-type-using-expressjs/46018920
  if(!req.is('application/x-www-form-urlencoded')) {
    res.status(400);
    return res.send("Bad Content-Type for login!")
  }
  // Get parameters
  var username = req.body.username;
  var password = req.body.password;
  var redirect = req.body.redirect;
  // Check parameters
  if(!username || !password) {
    res.status(401);
    return res.send("Missing username and/or password!");
  }
  // Get database
  var blogposts = client.db('BlogServer');
  blogposts.collection('Users').findOne({ username: username })
  .then((user) => {
    if(user == null) {
        res.status(401);
        return res.render('login', { page_title: 'Login (Try Again)', redirect: redirect });
    }
    else {
      // Check user inputted password against stored salted hash password in db
      if(!bcrypt.compareSync(password, user.password)) {
        res.status(401);
        return res.render('login', { page_title: 'Login (Try Again)', redirect: redirect });
      }
      else {
        // Adapted from: https://futurestud.io/tutorials/get-number-of-seconds-since-epoch-in-javascript
        var expiration = Math.round(Date.now() / 1000) + 7200;
        // Construct the jwt
        var token = jwt.sign(
          {
            "exp": expiration,
            "usr": user.username
          },
          jwt_key,
          { header: 
            {
              "alg": "HS256",
              "typ": "JWT"
            }
          });
        // Set the cookie in response header
        res.cookie(cookie_name, token);
        // Handle redirect if any
        if(redirect == null) {
          res.status(200);
          return res.send("Authentication successful!");
        }
        else {
          return res.redirect(302, redirect);
        }
      }
    }
  });
});

module.exports = router;