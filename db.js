var admin = require("firebase-admin");
var db;

exports.init = function() {
	admin.initializeApp({
		credential: admin.credential.cert("hackathon-65c39-firebase-adminsdk-lqpov-f2ee4bdab4.json"),
		databaseURL: "https://hackathon-65c39.firebaseio.com"
	});
	db = admin.database();
	console.log("DB Initialized");
};

exports.getDrivers = function(userCity, callback) {
	var drivers;
	var driverData = db.ref('driver');
	driverData.once('value', function(cities) {
		drivers = [];
		if (userCity != null) {
			if(cities.child(userCity).exists()) {
				cities.child(userCity).forEach(function(driver) {
					drivers.push(driver.val());
				});
				callback(drivers);
				return;
			}
		}
		cities.forEach(function(city) {
			city.forEach(function(driver) {
				drivers.push(driver.val());
			})
		});
		callback(drivers);
	});
}