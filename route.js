var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

/*router.get('/:name',function(req,res){
  res.send("The thing name is " + req.params.name);
});

router.get('/:name/:id([0-9]{5})',function(req,res){
  res.send("The thing name is " + req.params.name + " and id is "+req.params.id);
});*/

router.post('/',function(req,res){
  res.send("Post route on things");
});

module.exports = router;