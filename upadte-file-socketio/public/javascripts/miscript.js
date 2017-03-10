var socket = io.connect();
//io.connect({'forceNew':true});


$(document).ready(function(){

	$('#miButton').click(function(){
	});


	$('#send-form').submit(function(event){

		socket.emit('check-id', socket.id);
		var formData = new FormData($(this)[0]);  
		
		$.ajax({
				type: "POST",
	            enctype: 'multipart/form-data',
	            url: '/',						
	            data: formData,
	            processData: false,
	            contentType: false,
	            cache: false,
	            datatype: 'text/html',
	            success: function (data){
	                console.log("SUCCESS : ", data);
	            	},
	            error: function(jqXHR, exception) {
				        console.log(exception);
				        console.log(jqXHR.status);
				    }
		});
		event.preventDefault();
	});

	socket.on('progress', function(percent){
		$('#myBar').width(percent + '%');
		if(percent >= 100){	
		  alert('upload completed');
		  $('#myBar').width('1%');		
		}
	});

	socket.on('disconnect', function(){
		console.log('El socket: '  + socket.id + ' se ha desconectado');
	});

});
