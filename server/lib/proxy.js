'use strict';

var request = require('request'),
	url = require('url'),
	cache = require('./cache');

exports.getJSON = function(clientReq, clientRes){
	var reqURL = {
		protocol: 'http:',
		hostname: 'cultiz.com',
		port: 80,
		pathname: '/api' + clientReq.path,
		query: clientReq.query
	};

	reqURL = url.format(reqURL);

	if (__cacheRequests) {
		cache.exists(reqURL, function(key){
			console.log(key);
			if (key){
				getCachedRequest(reqURL, function(data){
					clientRes.json(JSON.parse(data));
				});
			} else {
				makeRequest(reqURL, function(data){
					clientRes.json(data);
				});
			}
		});
	} else {
		makeRequest(reqURL, function(data){
			clientRes.json(data);
		});
	}
	
};

exports.flush = function(clientReq, clientRes){
	var reqURL = {
		protocol: 'http:',
		hostname: 'cultiz.com',
		port: 80,
		pathname: '/api' + clientReq.path,
		query: clientReq.query
	};

	reqURL = url.format(reqURL);
	flushCachedRequest(reqURL, function(){
		clientRes.json({
			status: 'ok'
		});
	});
};

function getCachedRequest(file, callback){
	cache.get(file, function(data){
		console.log('Request already cached, serving cached file: ' + file);
		callback(data);
	});
}

function makeRequest(reqURL, callback){
	request({
		url: reqURL,
		method: "GET",
		timeout: 10000,
		followRedirect: true,
		encoding: 'utf8',
		json: true
	},

	function(err, proxyRes, data){
		console.log(reqURL + ' no cached yet, requesting data');
		if (err) throw err;
		if (proxyRes.statusCode === 200){
			/*cache.set(reqURL, data, function(file){
				console.log('Caching request in file: ' + file);
				callback(data);
			});*/
			cache.set(reqURL, data, function(){
				console.log('Caching request in redis');
				callback(data);
			});
		}
	});
}

function flushCachedRequest(reqURL, callback){
	cache.delete(reqURL, function(deleted){
		if (deleted) console.log('Request flushed');
		else console.log('File didn\'t exist, request not flushed');
		callback();
	});
}