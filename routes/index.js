var express = require('express');
var router = express.Router();
//console.log(router);
var bodyParser=require('body-parser');
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
router.post('/request',user.requestAmbulance);
module.exports = router;
