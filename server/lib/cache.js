'use strict';

var fs = require('fs'),
	zlib = require('zlib'),
	sha1 = require('./sha1');

exports.writeFile = function(url, json, success){
	var file = __cacheDir + '/' + sha1.encode(url) + '.gz';

	zlib.deflate(JSON.stringify(json), function(err, buffer){
		if (err) throw err;
		fs.writeFile(file, 
			buffer, 
			function(err){
				if (err) throw err;
				success(file);
			});
	});
};

exports.readFile = function(file, success){
	fs.readFile(file, 
		function(err, buffer){
			if (err) throw err;
			zlib.unzip(buffer, function(err, data){
				if (err) throw err;
				success(data.toString());
			});
	});
};

exports.fileExists = function(url, callback){
	var file = __cacheDir + '/' + sha1.encode(url) + '.gz';
	fs.exists(file, function (exists) {
		callback(exists ? file : undefined);
	});
};

exports.deleteFile = function(url, callback){
	fs.unlink(__cacheDir + '/' + sha1.encode(url) + '.gz', function (err) {
		if (err) throw err;
		callback(true);
	});
};