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
app.get('/', function (req, res) {
	res.send('Index Page');
});

app.get('/api', function (req, res) {
	res.send('Api Index Page');
});

app.get('/api/request', function (req, res) {
	var lat = req.query.lat, lon = req.query.lon;
	if (lat == null || lon == null) {
		res.send(JSON.stringify({"error":"query params missing"}));
		return;
	}
	console.log("req recieve");
	gmaps.getNearestDriver(db, lat, lon, function(nearestDriverDetails) {
		res.send(nearestDriverDetails);
	});
});


// Set server port
app.listen(80, function() {
	console.log('server is running');	
});