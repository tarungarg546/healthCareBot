var express=require('express');
var bodyParser=require('body-parser');
var session = require('express-session');
module.exports=function(app){
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser.json());
	app.use(session({secret: 'cohack'}));
	app.set('view engine','ejs');
	app.use(express.static(__dirname+'../../public'));
	app.set('views',__dirname+'../../views');
}