// set variables for environment
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var gmaps = require("./gmaps");
var db = require("./db");

db.init();

// db.getDrivers('Chennai',function(drivers) {
// 	console.log(drivers);
// });
// gmaps.getDist(5,"13.420668,80.22437|13.620668,80.22437", "13.820668,80.23437",null);
// gmaps.getCity("13.220668", "80.22437", function(city, location) {
// 	console.log(city+' | '+location);
// });
gmaps.getNearestDriver(db, "13.1444", "79.8940", "8118830489", function(requestID) {
	console.log(JSON.stringify({'requestId':requestID}));
});
// db.sendRequestToDriver("8118830489","23.33333", "80.443422", "chirag", "absdkjfsjkfbajsbdkajbsdjbaksdas-asn", "8266046321");
// instruct express to server up static assets

app.use(express.static('public'));
app.use(bodyParser.json());

// set routes

app.get('/api', function (req, res) {
	res.send('Api Index Page');
});

app.get('/api/request', function (req, res) {
	var lat = req.query.lat, lon = req.query.lon;
	var mobile = req.query.mobile;
	if (lat == null || lon == null) {
		res.send(JSON.stringify({"error":"query params missing"}));
		return;
	}
	if (!checkMobile(mobile)) {
		res.send(JSON.stringify({"error":"invalid mobile number"}));
		return;
	}
	gmaps.getNearestDriver(db, lat, lon, mobile, function(requestID) {
		res.send(JSON.stringify({'requestId':requestID}));
	});
});

app.get('/sms', function (req,res) {
	var mobile = req.query.mobilenumber.slice(2);
	if(checkMobile(mobile)) {
		var message = req.query.message.replace(/\+/g,' ');
		var regex = /^Laterox Latitude: \[(.+)\] Longitude: \[(.+)\]$/g;
		var matches = regex.exec(message);
		if(matches != null) {
			var lat = matches[1], lng = matches[2];
			console.log(lat + ' | ' + lng);
			gmaps.getNearestDriver(db, lat, lng, mobile, function(requestID) {
				// res.send(JSON.stringify({'requestId':requestID}));
			});
			res.sendStatus(200).end();
		} else {
			res.sendStatus(500).end();	
		}
	} else {
		res.sendStatus(500).end();
	}
});

app.get('/otp/gen', function (req, res) {
	var mobile = req.query.mobile;
	if(checkMobile(mobile)) {
		db.registerOTP(mobile, function(chunk) {
			res.send(JSON.stringify({"success":"otp sent", "chunk": chunk}));
		});
	} else {
		res.send(JSON.stringify({"error":"invalid mobile number"}));
	}
});

app.get('/otp/check', function (req, res) {
	var mobile = req.query.mobile;
	var otp = req.query.otp;
	if(checkMobile(mobile)) {
		db.checkOTP(mobile, otp, function(check) {
			res.send(JSON.stringify({"check": check}));
		});
	} else {
		res.send(JSON.stringify({"error":"invalid mobile number"}));
	}
});

function checkMobile(mobile) {
	return /^[7-9]\d{9}$/.test(mobile);
}

app.use(function(req, res, next) {
	res.status(404).redirect('/404.html');
});

// Set server port
app.listen(process.env.PORT || 3000, function() {
	console.log('server is running');	
});