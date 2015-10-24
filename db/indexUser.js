var mongoose=require('./connect');
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
module.exports=User;
