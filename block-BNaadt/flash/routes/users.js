var express = require('express');
var router = express.Router();
var User = require("../models/user")

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  res.send('respond with a resource');
});
router.get('/register', function (req, res, next) {
  var error = req.flash('error')[0];
  res.render("register",{error})
});
router.post('/register', function (req, res, next) {
  var {email,password} = req.body;
  if(password.length<4){
    req.flash('error', 'password cannot be less than 5 character');
    return res.redirect("/users/register")
  }
  if(!email || !password){
    req.flash('error', 'Email and Password requires');
    return res.redirect("/users/register")
  }
  User.create(req.body, (err, user) => {
    console.log(err,user);
    if(err){
      if(err.name == "MongoError"){
        req.flash('error', 'Email already taken');
        return res.redirect("/users/login");
      }
      return res.json({err})
    }
    res.redirect("/users/login");
  })
});
router.get('/login', function (req, res, next) {
  var error = req.flash('error')[0];
  res.render("login",{error})
});
router.post('/login', function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash("error","No email and password were passed")
    return res.redirect("/users/login");;
  }

  User.findOne({email}, (err, user) => {
    if (err) return next(err);

    console.log(err,user);

    //no user
    if (!user) {
      req.flash('error', 'Email not registered');
      return res.redirect("/users/login")
    }
    //compare password
    user.verifyPassword(password, (err, result) => { //password = that is comming for user collection database
      if (err) return next(err);
      console.log(err,result);
      if (!result) {
       req.flash("error","Entered wrong password")
       return res.redirect('/users/login')
      }

      req.session.userId = user.id;
      res.redirect("/users")
    })
  })

});
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.clearCookie('connect.sid')
  res.redirect("/users/login")
})

module.exports = router;
