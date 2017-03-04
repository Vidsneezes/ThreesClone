var express = require('express');
var app = express();

var route = require('./route.js');

app.use('/static',express.static('public'));

app.use(function(req,res,next){
  console.log("A new request recieved at "+Date.now());
  next();
});

app.use('/',route);

app.get('*', function(req, res){
    res.send('Sorry, this is an invalid URL.');
});

app.listen(3000);