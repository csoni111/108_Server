var https = require("https");



exports.getDistance = function(lat1, lon1, lat2, lon2, callback) {
	var dist = 0;
	var options = {
		host: 'maps.googleapis.com',
		port: 443,
		path: '/maps/api/distancematrix/json?units=imperial&origins='+lat1+','+lon1+'&destinations='+lat2+','+lon2+'&key=AIzaSyB2TmRjfPFbkrLTX0AfusjiLtLWEixj_sI',
		method: 'GET'
	};
	var req = https.request(options, function(res)
	{
		var output = '';
		// console.log(options.host + ':' + res.statusCode);
		res.setEncoding('utf8');

		res.on('data', function (chunk) {
			output += chunk;
		});

		res.on('end', function() {
			dist = JSON.parse(output).rows[0].elements[0].distance.value;
			callback(dist);
		});
	});

	req.on('error', function(err) {
		console.log(err.message);
	});

	req.end();
};