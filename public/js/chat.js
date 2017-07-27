$(function(){
		$("#msgType").keypress(function(event) {
    		if (event.which == 13) {
        		event.preventDefault();
        		$("#sendmessage").submit();
    		}
		});
		$(window).resize(function() {
    		setHeightWidth();
  		});
  		function setHeightWidth(){
  			$chat.css('height', $(window).innerHeight()-170);
			$('#chatwrap').css('width',$(window).innerWidth()-216);
  		}
		var	$chat=$('#chat');
		var $form=$('#setUserName');
		var $nickbox=$('#username');
		var $sendForm=$('#sendmessage');
		var $msg=$('#message');	
  		if($.cookie('doctorName')){
			var socket=io.connect('http://localhost:3000/doctor');
			$('.overlay').fadeOut();
			$('#content').fadeIn();
			socket.emit('newUser',$.cookie('doctorName'),function(data){
					$.removeCookie('doctorName');
					if(data){
						$('.overlay').fadeOut();
						$('#content').fadeIn();
					}
					else
					{
						$nickbox.addClass('invalid');
						$('#error').show();
					}
			});
  		}
		else{
			var socket=io.connect('http://localhost:3000/client');
			$form.submit(function(ev){
				ev.preventDefault();
				var ran=document.getElementById('username');
				if($nickbox.val()=='' || $nickbox.val()==" "||ran.value.indexOf(' ') >= 0)
				{
					alert("Dont try to be witty man!");
					return false;
				}
				socket.emit('newUser',$nickbox.val(),function(data){
					if(data){
						$('.overlay').fadeOut();
						$('#content').fadeIn();
					}
					else
					{
						$nickbox.addClass('invalid');
						$('#error').show();
					}
				});
				$nickbox.val('');
			});
		}
		$chat.css('height', $(window).innerHeight()-170);
		$('#chatwrap').css('width',$(window).innerWidth()-216);
		$sendForm.submit(function(ev){
			ev.preventDefault();
			socket.emit('newMessage',$msg.val(),function(data){
				$('#chat').append('<span class="error"><b>'+data+"</span><Br>");
			});
			$msg.val('');

		});
		socket.on('newmessage',function(data){
				//console.log(data);
				var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
				$chat.append('<span class="normal" style=\"color:'+hue+';\"><b>'+data.nick+':-</b>'+data.msg+"</span><Br>");
				var divid=document.getElementById('chat');
				divid.scrollTop=divid.scrollHeight;
		});
		socket.on('whisper',function(data){
				var audioElement = document.createElement('audio');
			    audioElement.setAttribute('src', 'music/tone.wav');
			    audioElement.addEventListener('ended', function() {
			        this.currentTime = 0;
			        this.play();
			    }, false);
			    //$('#play').click(function() {
			    audioElement.play();
			    //});
			    
			 	setInterval(function(){
			 		$(window).focus(function(){
			 			console.log('Here');
			 			audioElement.pause();
			 		})
			 	},100);
				$chat.append('<span class="whisper"><b>'+data.nick+':-</b>'+data.msg+"</span><Br>");
		});
		socket.on('usernames',function(data){
				var str=' ';
				$("#doctor").html('');
				for(var i=0;i<data.length;i++)
				{
					$('#doctor').append('<span class="inDoctor">'+data[i]+'</span><br>');
				}
		});
	});