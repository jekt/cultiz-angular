'use strict';

var express = require('express'),
	app = express(),
	proxy = require('./lib/proxy');

//app.use(express.static(__dirname + '/public'));

app.use('/favicon.ico', function(req, res, next){
    res.end();
});

app.use('/api', proxy.getJSON);

app.listen(1234, function(){
	console.log('Listening to port 1234...')
});