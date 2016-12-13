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
// gmaps.getDist("13.420668,80.22437|13.620668,80.22437", "13.820668,80.23437",null);

// instruct express to server up static assets
app.use(express.static('public'));
app.use(bodyParser.json());

// set routes

app.get('/api', function (req, res) {
	res.send('Api Index Page');
});

app.get('/api/request', function (req, res) {
	var lat = req.query.lat, lon = req.query.lon;
	if (lat == null || lon == null) {
		res.send(JSON.stringify({"error":"query params missing"}));
		return;
	}
	gmaps.getNearestDriver(db, lat, lon, function(nearestDriverDetails) {
		res.send(nearestDriverDetails);
	});
});

app.get('/sms', function (req,res) {
	var queryParams = req.query;
	var moibleNo = queryParams.mobilenumber;
	var message = queryParams.message; 
	if(queryParams != null) {
		res.send(JSON.stringify(queryParams));
	} else {
		res.send("no params sent");
	}
});

app.get('/otp/gen', function (req, res) {
	var mobile = req.query.mobile;
	if(checkMobile(mobile)) {
		db.registerOTP(mobile, function() {
			res.send(JSON.stringify({"success":"otp sent"}));
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