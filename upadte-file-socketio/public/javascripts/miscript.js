var socket = io.connect();
//io.connect({'forceNew':true});


$(document).ready(function(){

	$('#miButton').click(function(){
	});


	$('#send-form').submit(function(event){

		socket.emit('check-id', socket.id);
		var formData = new FormData($(this)[0]);   //$('#send-form')[0]
		
		$.ajax({
				type: "POST",
	            enctype: 'multipart/form-data',
	            url: '/',						//url: 'http://192.168.0.14:3000' muestra error ajax status 0, solucion aplicar CORS(Cross-Origin Resource Sharing) 
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
		//$('#miProgress').append($('<ul></ul>').html('<li>' + percent + '</li>'));
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