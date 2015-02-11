'use strict';

var fs = require('fs'),
	zlib = require('zlib'),
	sha1 = require('./sha1');

exports.writeFile = function(requestURL, dataJSON, success){
	var file = __root + '/server/cache/' + sha1.encode(requestURL) + '.json';
	fs.writeFile(file, 
		JSON.stringify(dataJSON), 
		function(err){
			if (err) throw err;
			success();
		});
};