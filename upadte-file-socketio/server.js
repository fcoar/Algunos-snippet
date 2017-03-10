var socketio = require('socket.io');
var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var formidable = require('formidable');
var fs = require('fs');
var currentRoom = [];

var root = __dirname;
var s_staitc = require('./lib/server_static');

var server = http.createServer(function(req, res){
	//static files
	var url = parse(req.url);
	var path = join(root, url.pathname);

	if(req.url == '/')
	{
		if(req.method == 'GET')
          s_staitc.serverStatic(res, './public/index.html');  
		
		if(req.method == 'POST')
		  upload(req, res);
	}else
	  {
	  	fs.stat(path, function(err, stat){
			if(err){
				if('ENOENT' == err.code){
					res.statusCode = 404;
					res.end('Not Found');
				}
			}else{
				res.setHeader('Content-Length', stat.size);
				var stream = fs.createReadStream(path);
				stream.pipe(res);
				stream.on('error', function(err){
					res.statusCode = 500;
					res.end('Internal Server Error');
				});
			}
		});	
	  }

});
server.listen(3000);

var io;
io = socketio.listen(server);

io.sockets.on('connection', function(socket){
		console.log("Ok, te has conectado");
		socket.join('miRoom');
		//console.log(io.of('/').adapter.rooms);
		console.log("*");
		console.log("*");
		console.log("*");

		handleId(socket);
});

function handleId(socket){
	socket.on('check-id', function(id){
		if(socket.id == id){
			console.log('socket.id: ' + socket.id + '  ==  id: '+ id + '  Son Iguales');
			currentRoom.push(id);
		}
	});

	socket.on('disconnect', function(){
		console.log('El socket: '  + socket.id + ' se ha desconectado');
	});
}

function upload(req, res){
	// upload logic
	if(!isFormData(req)){
		res.statusCode = 400;
		res.end('Bad Request: expceting multipart/form-data');
		return;
	}

	var form = new formidable.IncomingForm();

	form.on('progress', function(bytesReceived, bytesExcepted){
		var percent = Math.floor(bytesReceived/bytesExcepted * 100);
		io.sockets.in(currentRoom[0]).emit('progress', percent);	
	});

	form.parse(req, function(err, fields, files){
		currentRoom.pop();
		console.log(fields);
		//console.log(files);
		res.writeHead(200, {'Content-Type': 'text/html'}); //checar con json, ajax parseerror
		res.end('POST fue exitoso','utf-8');
	});
}

function isFormData(req){
	var type = req.headers['content-type'] || '';
	return 0 == type.indexOf('multipart/form-data');
}




