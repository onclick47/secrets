var express = require('express');
var router = express.Router();
const userModel = require('../model/schema');

// passport js requirements

const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

// ----------------------------------------------------------------

/* GET home page. */
router.get('/', function (req, res, next) {


  res.render('index');
});


// get login page
router.get('/login', function (req, res, next) {
  res.render('login');

})

//  post request from login page

router.post('/login', function (req, res, next) {
  const user = userModel({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, err => {
    if (err) {
      console.log(err)
      // res.redirect('/register');
    } else {

      passport.authenticate("local")(req, res, function () {
        res.redirect('/secrets');
      });

    }
  })

})

// get secret page

router.get('/secrets', (req, res, next) => {

  
  const secret = req.user.secret;
  res.render("secrets", {data: secret});

  // if (req.isAuthenticated()) {
    // res.render('secrets')
  // }
  
  // else {
  //   res.redirect('/login')
  // }

})


// get details from register page

router.post('/register', function (req, res, next) {
  userModel.register({ username: req.body.username }, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect('/register');
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/secrets');
      });
    }
  })

})

// get register page
router.get('/register', function (req, res, next) {
  res.render("register");
})




// submit page GET request
router.get('/submit', function (req, res, next) {
  res.render("submit");
})

//  submit secret page POST request

router.post('/submit', function (req, res, next) {


  userModel.findById(req.user.id, (err, foundUser) => {
    if (err) {
      console.log(err)
    } else {
      if (foundUser) {

        foundUser.secret.push(req.body.secret)

        foundUser.save(() => {
          
          res.redirect('/secrets')
        })
      }

    }
  })
})

// logout buttons

router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
