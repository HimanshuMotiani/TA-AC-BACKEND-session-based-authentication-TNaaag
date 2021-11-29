var express = require('express');
var router = express.Router();
var User = require("../models/user") 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render("register")
});
router.post('/register', function(req, res, next) {
  console.log(req.body);
  User.create(req.body,(err,user)=>{
    res.send(user);
  })
  
});

module.exports = router;
