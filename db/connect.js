var mongoose=require('mongoose');
var keys=require('./../keys/keys.json');
mongoose.connect(keys.mongoose.url,function(err) {
    if (err) throw err;
    else
    	console.log('Connected to db');
});
module.exports=mongoose;