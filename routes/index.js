var express = require('express');
var router = express.Router();
var request = require('request');
var Cookies = require( "cookies" );
var mongoose=require('../db/connect');
var user=require('../db/indexUser');
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/callAmbulance',function(req,res){
	res.render('callAmbulance',{invite:false});
});
router.get('/chatWithDoctor',function(req,res){
	res.render('chatWithDoctor');
});
router.get('/chatBot',function(req,res){
	res.render('chatBot');
});
router.get('/secretDoctor/:name',function(req,res){
	var cookies = new Cookies( req, res )
    , unsigned, signed, tampered;
    cookies.set( "doctorName", req.params.name, { httpOnly: false } );
    res.redirect(301,'/chatWithDoctor');
});
router.get('/api_request', function(req, res){
    var disease = req.query.data; 
    var medicine_suggestions = "http://www.truemd.in/api/medicine_suggestions/?id="+ disease +"&key=d29b1e6837deea39d2b59be03671c9&limit=5"; 
    request(medicine_suggestions, function (error, response, body) {
      //console.log(response.statusCode);
  		if (!error && response.statusCode == 200) {
    		res.send(JSON.stringify(body));
 		 }
 		 else{
    		console.log(error);
 		}
 	 });
});
router.get('/unsubscribe/:id_',user.unsubscribe);
router.post('/request',user.requestAmbulance);
router.post('/requestOTP',user.requestOTP);
router.post('/checkOTP',user.checkOTP);
module.exports = router;
