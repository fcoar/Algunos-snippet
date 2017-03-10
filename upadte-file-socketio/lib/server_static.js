var mime = require('mime');
var fs = require('fs');
var path = require('path');
var cache = {};

function send404(res)
{
	res.writeHead(404, {'content-Type': 'text/plain'});
	res.write('Error 404, resource not found');
	res.end();	
}

function sendFile(res, filePath, fileContents)
{
	res.writeHead(200,
		{"content-Type": mime.lookup(path.basename(filePath))}
	);
	res.end(fileContents);
}


exports.serverStatic = function(res, absPath){
	
	if(cache[absPath])
	  sendFile(res, absPath, cache[absPath]);
	 else
	   {
	   		fs.exists(absPath, function(exists){
	   			if(exists){
	   				fs.readFile(absPath, function(err, data){
	   					if(err)
	   						send404(res);
	   					else
	   					  {
	   					  	cache[absPath] = data;
	   					  	sendFile(res, absPath, data);
	   					  }
	   				});
	   			}else
	   			   send404(res);	
	   		});
	   }	
}