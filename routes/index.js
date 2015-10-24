var express = require('express');
var router = express.Router();
var request = require('request');
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
router.get('/chatWithDoctor',function(req,res){
	res.render('chatWithDoctor');
});
router.get('/chatWithDoctor',function(req,res){
	res.render('chatWithDoctor');
});
router.get('/chatBot',function(req,res){
	res.render('chatBot');
});
router.get('/secretDoctor',function(req,res){
	res.render('secretDoctor');
});
router.post('/request',user.requestAmbulance);

router.get('/api_request', function(req, res){
    
      var disease = req.query.data; 
     // console.log(disease);
     var medicine_suggestions = "http://www.truemd.in/api/medicine_suggestions/?id="+ disease +"&key=d29b1e6837deea39d2b59be03671c9&limit=5"; 
     console.log(medicine_suggestions);
  	request(medicine_suggestions, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		console.log(" in this")
   			 console.log(body) // Print the google web page.

   			 res.send(JSON.stringify(body));
 		 }
 		 else
  			{
    		  console.log(error , err);
 			 }
 	 })


})
module.exports = router;
