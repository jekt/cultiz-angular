'use strict';

var express = require('express'),
	app = express(),
	proxy = require('./lib/proxy'),
	fs = require('fs');

global.__root = require('path').resolve(__dirname, '..');
global.__cacheRequests = true;
global.__cacheDir = __root + '/server/cache';

app.use('/favicon.ico', function(req, res, next){
    res.end();
});

app.use('/api', proxy.getJSON);
app.use('/flush', proxy.flush);

app.listen(1234, function(){
	console.log('Listening to port 1234...')
});