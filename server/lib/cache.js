'use strict';

var fs = require('fs'),
	zlib = require('zlib'),
	sha1 = require('./sha1'),
	redis = require('redis').createClient();

exports.set = function(url, json, success){
	/*var file = __cacheDir + '/' + sha1.encode(url) + '.gz';

	zlib.deflate(JSON.stringify(json), function(err, buffer){
		if (err) throw err;
		fs.writeFile(file, 
			buffer, 
			function(err){
				if (err) throw err;
				success(file);
			});
	});*/

	redis.set(sha1.encode(url), JSON.stringify(json), function(err){
		if (err) throw err;
		success();
	});
};

exports.get = function(url, success){
	/*fs.readFile(file, 
		function(err, buffer){
			if (err) throw err;
			zlib.unzip(buffer, function(err, data){
				if (err) throw err;
				success(data.toString());
			});
	});*/
	redis.get(sha1.encode(url), function(err, data){
		if (err) throw err;
		success(data);
	});
};

exports.exists = function(url, callback){
	/*var file = __cacheDir + '/' + sha1.encode(url) + '.gz';
	fs.exists(file, function (exists) {
		callback(exists ? file : undefined);
	});*/
	redis.exists(sha1.encode(url), function(err, exists){
		if (err) throw err;
		console.log(sha1.encode(url) + ' ' + exists);
		callback(exists ? sha1.encode(url) : undefined);
	});
};

exports.delete = function(url, callback){
	fs.unlink(__cacheDir + '/' + sha1.encode(url) + '.gz', function (err) {
		if (err) throw err;
		callback(true);
	});
};

redis.on("error", function (err) {
    throw err;
});