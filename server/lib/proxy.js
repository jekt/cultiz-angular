'use strict';

var request = require('request'),
	url = require('url'),
	fs = require('fs'),
	zlib = require('zlib'),
	crypto = require('crypto');

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

	request({
			url: reqURL,
			method: "GET",
			timeout: 10000,
			followRedirect: true,
			encoding: 'utf8',
			json: true
		},
	
		function(error, proxyRes, json){
			if (error) throw error;
			if (proxyRes.statusCode === 200){
				fs.writeFile(__dirname + '/cache/' + encodeSHA1(reqURL) + '.json', 
							json, 
							function(err){
								if (err) throw err;
								clientRes.json(json);
							})
			}
		});
};

function encodeSHA1(string){
	var shasum = crypto.createHash('sha1');
	shasum.update(string);
	return shasum.digest('hex');
}