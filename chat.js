module.exports=function(io){
	var users={};//username will be the key and value will be corresponding socket
	io.sockets.on('connection',function(socket){
		console.log('New User Connected');
		socket.on('newUser',function(data,callback){
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
				updateNames();
			}
		});
		function updateNames(){
			io.sockets.emit('usernames',Object.keys(users));//sending socket does not make sense
		}
		socket.on('disconnect',function(data){
			if(!socket.nickname)//when the user has no nickname 
				return;
			delete users[socket.nickname];
			updateNicknames();
		});
	});

}