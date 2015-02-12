'use strict';

var express = require('express'),
	app = express(),
	proxy = require('./lib/proxy'),
	fs = require('fs');

global.__cache = {
	requests: true,
	expirationTime: 86400
};
global.__proxy = {
	protocol: 'http:',
	hostname: 'cultiz.com',
	port: 80
};

app.use('/favicon.ico', function(req, res, next){
    res.end();
});

/*app.route('/api/:route(^get_[a-z_]+)')
	.get(proxy.getJSON)
   	.delete(proxy.flush);*/

app.use('/api', proxy.getJSON);
app.use('/fluxh', proxy.flush);

app.listen(1234, function(){
	console.log('Listening to port 1234...')
});