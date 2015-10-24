var mongoose=require('./connect');
var Schema=mongoose.Schema;
var User = mongoose.model('User', userSchema);
module.exports=User;
