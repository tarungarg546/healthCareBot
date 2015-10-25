var mongoose=require('./connect');
var keys=require('./../keys/keys.json');
var async=require('async');
var twitter=require('simple-twitter');
var nodemailer=require('nodemailer');
var client=require('twilio')(keys.twilio.key1,keys.twilio.key2);
var geonoder=require('geonoder');
twitter = new twitter(keys.twitter.consumerKey, //consumer key from twitter api
                       keys.twitter.consumerSecretKey, //consumer secret key from twitter api
                       keys.twitter.token, //acces token from twitter api
                       keys.twitter.secretToken//acces token secret from twitter api
                      );
var transporter=nodemailer.createTransport({
    service: 'Gmail',
   	auth: {
       	user: keys.gmail.user,
       	pass: keys.gmail.password
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
User.unsubscribe=function(req,res){
	var id=req.params.id_;
	User.remove({_id:id},function(err,result){
		if(err)
			res.send(err);
		else
			res.send('Successfully unsubscribed!');
	});
}
User.requestAmbulance=function(req,res){
	var data=req.body;
	var doc=new User();
	doc.name=data.yourName,
	doc.city=data.yourCity,
	doc.mail=data.yourMail,
	doc.phoneNumber=data.yourPhoneNo;
	doc.posts=[];
	geonoder.toCoordinates(doc.city, geonoder.providers.google, function(latitude, longitude) {
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
					      coordinates : [lang,lat]
					    },
					    $maxDistance : 100000
					  }
				};
				User.find(query,function(err,result){
					if(err)
						res.send(err);
					else{
						//console.log(result);
						async.eachSeries(result,function(dataSingle,next){
							var link="http://localhost:3000/unsubscribe/"+dataSingle._id;
							var msg='Hello '+dataSingle.name+","+data.concernName+' needs you at '+data.concernAddress+' Issued in public interest by :- '+data.yourName+" Sponsored by HealersAtHome(https://www.healersathome.com)..:D Special Msg :- "+data.customMesage;
							var mailMsg='Hello <b>'+dataSingle.name+"</b>,<br><b><i>"+data.concernName+'</i></b> needs you at <b>'+data.concernAddress+'</b>.<Br>Issued in public interest by :- <b>"'+data.yourName+"\"</b><br> Sponsored by HealersAtHome ( https://www.healersathome.com )..:D<br><i>Special Msg :- "+data.customMesage+'</i><br><br>To unsubscribe <a href='+link+'>Click Here</a>';
							async.parallel([
								function(done){
									//mail
									var mailOptions = {
									    from: 'Tarun Garg <tarungarg546@gmail.com>', // sender address
									    to: dataSingle.mail, // list of receivers
									    subject: 'Someone Needs you', // Subject line
									    html:mailMsg
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
							//res.redirect('callAmbulance',{invite:true});
							res.redirect(301,'/');
						});
					}
				});
			});
		});
	});
};
module.exports=User;
