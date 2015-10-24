var mongoose=require('./connect');
var async=require('async');
var twitter=require('simple-twitter');
var nodemailer=require('nodemailer');
var client=require('twilio')('AC527f6f20315f59a17999fd9eec6ebc93', '031bba489a2f19d928e0ab856f1e1265');
var geonoder=require('geonoder');
twitter = new twitter('ESd7bNZnsmkf46EXDFO2Asw0T', //consumer key from twitter api
                       'GgJgSi3d5jS4i2fXoxe6TAymLHY44AKNVuUrurph1nnghorZsu', //consumer secret key from twitter api
                       '3700916413-QHgFm2hvXqI8KHZWxFarOaxuza6Zh2jj2sDqkqw', //acces token from twitter api
                       'nvjuqlM5DFMAOp8JOhKk0MUjrt39Ps1FcBKQKgE5r02CG'//acces token secret from twitter api
                       );
var transporter=nodemailer.createTransport({
    service: 'Gmail',
   	auth: {
       	user: 'tarungarg546@gmail.com',
       	pass: 'laxauwftxfcvfwty'
   	}
});
var Schema=mongoose.Schema;
var userSchema=new Schema({
	name:String,
	city:String,
	location : {
	    type: { 
	      type: String,
	      default: 'Point'
	    }, 
    	coordinates: [Number]
  	},
	mail:String,
	phoneNumber:String,
	posts:[{
		name:String,
		phoneNumber:String,
		Address:String,
		location : {
	    	type: { 
	      		type: String,
	      		default: 'Point'
	    	}, 
    		coordinates: [Number]
  		},
  		customMessage:{
  			type:String,
  			default:" "
  		}
	}]
});
userSchema.index({ location : '2dsphere' });
var User = mongoose.model('User', userSchema);
User.requestAmbulance=function(req,res){
	var data=req.body;
	var doc=new User();
	doc.name=data.yourName,
	doc.city=data.yourCity,
	doc.mail=data.yourMail,
	doc.phoneNumber=data.yourPhoneNo;
	doc.posts=[];
	geonoder.toCoordinates(doc.city, geonoder.providers.google, function(latitude, longitude) {
    	console.log('Lat: ' + latitude + ' Long: ' + longitude) // Lat: 41.8965209 Long: 12.4805225 
    	doc.location={
			type:'Point',
			coordinates:[longitude,latitude]
		};
		var postDoc={
			name:data.concernName,
			phoneNumber:data.concernPhoneNo,
			address:data.concernAddress,
		}
		geonoder.toCoordinates(data.concernAddress,geonoder.providers.google,function(lat,lang){
			postDoc.location={
				type:'Point',
				coordinates:[lang,lat]
			};
			postDoc.customMessage=data.customMesage;
			doc.posts.push(postDoc);
			doc.save(function(err,result){
				if(err)
					res.send(err);
				var query={};
				query.location = {
  					$near : {
    					$geometry : {
					      type : "Point",
					      coordinates : [longitude,latitude]
					    },
					    $maxDistance : 100000
					  }
				};
				console.log(query);
				User.find(query,function(err,result){
					if(err)
						res.send(err);
					else{
						console.log(result);
						async.eachSeries(result,function(dataSingle,next){
							var msg='Hello '+dataSingle.name+","+data.concernName+' needs you at '+data.concernAddress+' Issued in public interest by :- '+data.yourName+" Sponsored by HealersAtHome(https://www.healersathome.com)..:D";
							async.parallel([
								function(done){
									//mail
									var mailOptions = {
									    from: 'Tarun Garg <tarungarg546@gmail.com>', // sender address
									    to: dataSingle.mail, // list of receivers
									    subject: 'Someone Needs you', // Subject line
									    text:msg
									};
						    		// send mail with defined transport object
									transporter.sendMail(mailOptions, function(error, info){
									    if(error){
									        return done(error);
									    }
									    console.log('Message sent: ' + info.response);
									    done();
									});

								},
								function(done){
									//msg
									client.sendMessage({
							            to:'+919802893707', // Any number Twilio can deliver to
							            from: '+16572208653', // A number you bought from Twilio and can use for outbound communication
							            body:msg
							        }, function(err, responseData) { //this function is executed when a response is received from Twilio
							            if(err)
							             return done(err);
							            if (!err) {
							            	console.log("From "+responseData.from+ " To "+responseData.to); // outputs "+14506667788"
							                console.log(responseData.body); // outputs "word to your mother.
							                done();
							            }
							        });
								}
								],function(err){
									if(err)
										res.send(err);
									else
										next(null);				
							});
						},function(err){
							res.render('callAmbulance',{invite:true});
						});
					}
				});
			});
		});
	});
}
module.exports=User;
