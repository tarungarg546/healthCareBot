var express=require('express');
var app=express();
require('./config/express')(app);
var routes=require('./routes');
app.use('/',routes);
app.listen(3000,function(){
        console.log('Server is listening at 3000 port');
});