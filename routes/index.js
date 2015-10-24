var express = require('express');
var router = express.Router();
//console.log(router);
var bodyParser=require('body-parser');
var mongoose=require('./db/connect');
var user=require('./db/indexUser');
var post=require('./db/indexPost');
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/callAmbulance',function(req,res){
	res.render('callAmbulance');
});
module.exports = router;
