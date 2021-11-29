var express = require('express');
var router = express.Router();
var User = require("../models/user")

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  res.send('respond with a resource');
});
router.get('/register', function (req, res, next) {
  res.render("register")
});
router.post('/register', function (req, res, next) {
  User.create(req.body, (err, user) => {
    res.redirect("/users/login");
  })
});
router.get('/login', function (req, res, next) {
  res.render("login")
});
router.post('/login', function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.redirect("/users/login");;
  }

  User.findOne({email}, (err, user) => {
    if (err) return next(err);

    //no user
    if (!user) {
      return res.redirect("/users/login")
    }
    //compare password
    user.verifyPassword(password, (err, result) => { //password = that is comming for user collection database
      if (err) return next(err);
      console.log(err,result);
      if (!result) {
        res.redirect('/users/login')
      }

      req.session.userId = user.id;
      res.redirect("/users")
    })
  })

});


module.exports = router;
