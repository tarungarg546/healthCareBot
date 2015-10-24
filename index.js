var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);
require('./config/express')(app);
var baseRoute=require('./routes');
app.use('/',baseRoute);
var users={};//username will be the key and value will be corresponding socket
io.sockets.on('connection',function(socket){
	//console.log('New User Connected',socket);
	socket.on('newUser',function(data,callback){
		console.log('Checking username....');
		if(data in users)//username already exists
		{
			callback(false);
		}
		else
		{
			console.log('New User is genuine ');
			callback(true);
			socket.name=data;
			users[socket.name]=socket;
			console.log(users[socket.name]);
			updateNames();
		}
	});
	socket.on('newMessage',function(data,callback){
		//console.log(data);
		var msg=data.trim();
		if(msg[0]=='@')//if thats whisper or private msg
		{
			msg=msg.substr(1);//start of name onwards
			var idx=msg.indexOf(' ');
			if(idx!==-1)
			{
				//check the username is valid
				var name=msg.substr(0,idx);
				msg=msg.substr(idx+1);
				if(name in users)
				{
					users[name].emit('whisper',{msg:msg,nick:socket.name});
					console.log('whispered');	
				}
				else
				{
					callback('Error! Enter a valid user');
				}	
			}
			else//no actual msg part
			{
				callback('Error! Please enter a message for your whisper');
			}
		}
		else{
			io.sockets.emit('newmessage',{msg:msg,nick:socket.name});//broadcast to everyone and i too can see the msg
		}

	});
	function updateNames(){
		//console.log('Here');
		//console.log(Object.keys(users));
		io.sockets.emit('usernames',Object.keys(users));//sending socket does not make sense
	}
	socket.on('disconnect',function(data){
		console.log('User died');
		if(!socket.name)//when the user has no name 
				return;
		delete users[socket.name];
		updateNames();
	});
});