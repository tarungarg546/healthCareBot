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
  	otp:{
  		value:String,
  		issuedAt:Number
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
User.requestOTP=function(req,res){
	var data=req.body;
	var user=User.find({mail:data.yourMail});
	user.then(function(result){
		var sess=req.session;
		sess.mail=data.yourMail;
		if(result==''){
			saveNewUser(data,function(err,doc){
				if(err)
					res.send(err);
				data.id=doc._id;
				var id=""+data.id+"";//convert into string
				//console.log(id);
				data.otpValue='';
				for(var i=0;i<6;i++){
					console.log(data.otpValue,i);
					data.otpValue+=id.substr(Math.floor(Math.random()*12),1);
				}
				doc.otp.value=data.otpValue;
				var date=new Date();
				doc.otp.issuedAt=date.getTime();
				doc.save();
				generateAndSendOTP(data,function(err,reslt){
					if(err)
						res.send(err);
					else
						res.send(true);
				});
			});
		}
		else{
			data.id=result[0]._id;
			var id=""+data.id+"";//convert into string
			data.otpValue='';
			for(var i=0;i<6;i++){
				console.log(data.otpValue,i);
				data.otpValue+=id.substr(Math.floor(Math.random()*12),1);
			}
			result[0].otp.value=data.otpValue;
			var date=new Date();
			result[0].otp.issuedAt=date.getTime();
			result[0].save();
			generateAndSendOTP(data,function(err,result){
				if(err)
					res.send(err);
				else
					res.send(true);
			});
		}
	});
}
User.requestAmbulance=function(req,res){
	var data=req.body;
	//console.log(data);
	var sess=req.session;
	data.yourName=sess.mail;//simple workaround for now
	var user=User.find({mail:sess.mail});
	user.then(function(result){
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
			result[0].posts.push(postDoc);
			result[0].save(function(err,result){
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
				queryByLocation(query,data,function(err,result){
					if(err)
						res.send(err);
					else
					{
						res.redirect(301,'/');
					}
				});
			});
		});
	});
}
User.checkOTP=function(req,res){
	var data=req.body;
	var sess=req.session;
	console.log(sess.mail);
	var user=User.find({mail:sess.mail});
	user.then(function(result){
		if(result==''){

		}
		else
		{
			var result=result[0];
			var date=new Date();
			var time=date.getTime();
			console.log(time-result.otp.issuedAt,result.otp.value,data.val);
			if(time-result.otp.issuedAt>300000){
				res.send(false);
			}
			else if(result.otp.value==data.val)
			{
				res.send(true);
			}
			else
				res.send(false);
		}
	});
}
var queryByLocation=function(query,data,callback){
	User.find(query,function(err,result){
		if(err)
			callback(err);
		else{
			//console.log(result);
			async.eachSeries(result,function(dataSingle,next){
				var obj={};
				var link="http://localhost:3000/unsubscribe/"+dataSingle._id;
				obj.msg="Hello "+dataSingle.name+","+data.concernName+' needs you at '+data.concernAddress+" Issued in public interest by :- "+data.yourName+" Special Msg :- "+data.customMesage;
				obj.mailMsg='Hello <b>'+dataSingle.name+"</b>,<br><b><i>"+data.concernName+'</i></b> needs you at <b>'+data.concernAddress+'</b>.<Br>Issued in public interest by :- <b>"'+data.yourName+"\"</b><br><i>Special Msg :- "+data.customMesage+'</i><br><br>To unsubscribe <a href='+link+'>Click Here</a>';
				obj.mail=dataSingle.mail;
				sendMailAndMessage(obj,function(err,result){
					if(err)
					{
						callback(err);
					}
					else
						next();
				});
			},function(err){
				if(err)
					callback(err);
				else
					callback(null);
			});
		}
	});
}
var saveNewUser=function(data,callback){
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
		}
		doc.save(function(err,result){
			if(err)
				callback(err);
			else
			{
				callback(null,result);
			}
		})
	});
}
var sendMailAndMessage=function(obj,callback){
	async.parallel([
		function(done){
			//mail
			var mailOptions = {
			    from: 'Tarun Garg <tarungarg546@gmail.com>', // sender address
			    to: obj.mail, // list of receivers
			    subject: 'Someone Needs you', // Subject line
			    html:obj.mailMsg
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
	            body:obj.msg
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
				callback(err,null);
			else
				callback(null,true);				
	});
}
var generateAndSendOTP=function(data,callback){
	var obj={};
	var link="http://localhost:3000/unsubscribe/"+data.id;
	obj.msg="Hello "+data.yourName+", Your One Time Password(OTP) is "+data.otpValue+' .This will be valid only for 5 Minutes!';
	obj.mailMsg='Hello '+data.yourName+"<Br>Your One Time Password(OTP) is "+data.otpValue+'.This will be valid only for 5 Minutes!</i><br><br>To unsubscribe <a href='+link+'>Click Here</a>';
	obj.mail=data.yourMail;
	sendMailAndMessage(obj,function(err,res){
		if(err)
			callback(err);
		else
			callback(null,res);
	});
}
module.exports=User;
