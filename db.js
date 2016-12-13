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

exports.registerOTP = function (mobile, callback) {
	var otp = Math.floor(1000 + Math.random() * 9000);
	db.ref('otp/' + mobile).set(otp);
	var https = require('https');
	var options = {
		host: 'rest.nexmo.com',
		port: 443,
		path: '/sms/json?api_key=bafc2596&api_secret=cccc06626deb6bd1&from=Laterox&to=91'
		+ mobile + '&text='
		+ encodeURIComponent('Your OTP for SignUp is ')
		+ otp,
		method: 'GET'
	};

	https.get(options, function(res) {
		callback();
		res.on('data', (d) => {
			process.stdout.write(d);
		});
	}).on('error', function(e) {
		console.error(e);
	});
};

exports.checkOTP = function (mobile, otp, callback) {
	otpRef = db.ref('otp/' + mobile);
	otpRef.once("value", function(originalOTP) {
		callback(otp == originalOTP.val());
	});
}