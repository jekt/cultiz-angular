'use strict';

var request = require('request'),
	url = require('url'),
	cache = require('./cache');

exports.getJSON = function(clientReq, clientRes){
	console.log('Request ' + clientReq.method + ' ' + clientReq.url + ' received at ' + Date());
	
	var reqURL = {
		protocol: 'http:',
		hostname: 'cultiz.com',
		port: 80,
		pathname: '/api' + clientReq.path,
		query: clientReq.query
	};

	reqURL = url.format(reqURL);

	if (__cache) {
		cache.fileExists(reqURL, function(file){
			if (file){
				getCachedRequest(file, function(json){
					clientRes.json(json);
				});
			} else {
				makeRequest(reqURL, function(json){
					clientRes.json(json);
				});
			}
		});
	} else {
		makeRequest(reqURL, function(json){
			clientRes.json(json);
		});
	}
	
};

function getCachedRequest(file, callback){
	cache.readFile(file, function(data){
		console.log('Request already cached, serving cached file: ' + file);
		callback(JSON.parse(data));
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

	function(err, proxyRes, json){
		console.log(reqURL + ' no cached yet, requesting json');
		if (err) throw err;
		if (proxyRes.statusCode === 200){
			cache.writeFile(reqURL, json, function(file){
				console.log('Caching request in file: ' + file);
				callback(json);
			});
		}
	});
}