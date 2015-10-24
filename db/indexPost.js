var mongoose=require('./connect');
var Schema=mongoose.Schema;
var Post = mongoose.model('Post', postSchema);
module.exports=Post;