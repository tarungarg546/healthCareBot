var express=require('express');
var bodyParser=require('body-parser');
module.exports=function(app){
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser.json());
	app.set('view engine','ejs');
	app.use(express.static(__dirname+'../../public'));
	app.set('views',__dirname+'../../views');
}