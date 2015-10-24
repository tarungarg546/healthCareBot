var mongoose=require('mongoose');
var keys=require('./../keys/keys.json');
mongoose.connect(keys.mongoose.url);
module.exports=mongoose;