var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req,res,next)=>{
  User.findOne({username: req.body.username})
  .then((user)=>{
    if(user != null){
      var err = new Error("User"+ req.body.username +" Already Exists");
      res.statusCode = 403;
      next(err);
    }
    else{
      return User.create({
        username: req.body.username,
        password: req.body.password
      })
    }
  })
  .then((user)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful!', user: user});
  }, (err)=> next(err))
  .catch((err)=>next(err));
})

router.post('./login',(req,res,next)=>{
  if (!req.session.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
        return;
    }
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    User.findOne({username:user})
    .then((user)=>{
      if(user === null){
        var err = new Error("User Doesnt Exist");
        err.status = 403;
        next(err);
      }
      else if(user.password != pass){
        var err = new Error("Incorrect Password");
        err.status = 403;
        next(err);
      }
      else if (user.username == user && user.password == pass) {
        req.session.user = "authenticated";
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!')
      } 
    })
    .catch((err)=>next(err))
    }
    else{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated!');
    }
})

router.get('/logout',(req,res)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
})

module.exports = router;
