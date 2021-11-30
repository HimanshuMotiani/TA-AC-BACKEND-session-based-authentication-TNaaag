var express = require('express');
var User = require("../models/user")
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send("Welcome");
});

router.get('/register', function (req, res, next) {
  var error = req.flash('error')[0]
  res.render("register", { error });
});

router.post('/register', function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email and Password requires');
    return res.redirect("/users/register")
  }
  User.create(req.body, (err, user) => {
    if (err) {
      req.flash("error", err.message)
      return res.redirect("/users/register")
    }
    res.redirect('/users/login')
  })
});

router.get('/login', function (req, res, next) {
  var error = req.flash('error')[0];
  res.render("login", { error })
});

router.post('/login', function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "No email and password were passed")
    return res.redirect("/users/login");;
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    if (!user) {
      req.flash('error', 'Email not registered');
      return res.redirect("/users/login")
    }

    user.verifyPassword(password, (err, result) => { //password = that is comming for user collection database
      if (err) return next(err);
      if (!result) {
       req.flash("error","Entered wrong password")
       return res.redirect('/users/login')
      }
      req.session.userId = user.id;
      res.redirect("/users")
    })
  })

});


module.exports = router;
