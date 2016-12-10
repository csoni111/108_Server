// set variables for environment
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var admin = require("firebase-admin");
var getdist = require("./getdist");

admin.initializeApp({
	credential: admin.credential.cert("hackathon-65c39-firebase-adminsdk-lqpov-f2ee4bdab4.json"),
	databaseURL: "https://hackathon-65c39.firebaseio.com"
});

var drivers = [];

var db = admin.database();
var driverData = db.ref('driver');
driverData.on('value', function(snapshot) {
	drivers = [];
	snapshot.forEach(function(driver) {
		var lat = driver.val().latitude;
		var lon = driver.val().longitude;
		drivers.push({'lat':lat,'lon':lon});
    });
    console.log("drivers data loaded");
});

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
	var minDist, count=0;
	function callback (dist) {
		if (minDist == null) { minDist = dist; }
		minDist = minDist>dist?dist:minDist;
		if (++count == drivers.length) {
			console.log(minDist);
		}
	}
	drivers.forEach(function(driver) {
		getdist.getDistance(driver.lat, driver.lon, lat, lon, callback);
	});
	res.send();
});


// Set server port
app.listen(80, function() {
	console.log('server is running');	
});