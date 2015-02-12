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

	cache.fileExists(reqURL, function(file){
		if (file){
			cache.readFile(file, function(data){
				console.log('Request already cached, serving cached file: ' + file);
				clientRes.json(JSON.parse(data));
			});
		} else {
			request({
				url: reqURL,
				method: "GET",
				timeout: 10000,
				followRedirect: true,
				encoding: 'utf8',
				json: true
			},
		
			function(error, proxyRes, json){
				console.log(reqURL + ' no cached yet, requesting json');
				if (!error && proxyRes.statusCode === 200){
					cache.writeFile(reqURL, json, function(file){
						console.log('Caching request in file: ' + file);
						clientRes.json(json);
					});
				}
			});
		}
	});
};

