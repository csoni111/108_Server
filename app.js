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


// Set server port
app.listen(process.env.PORT || 3000, function() {
	console.log('server is running');	
});