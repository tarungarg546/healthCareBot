var express = require('express');
var router = express.Router();
//console.log(router);
var bodyParser=require('body-parser');
var mongoose=require('../db/connect');
var user=require('../db/indexUser');
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/callAmbulance',function(req,res){
	res.render('callAmbulance',{invite:false});
});
router.post('/request',user.requestAmbulance);
module.exports = router;
