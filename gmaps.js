
var googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyCr2AVH-9JAHDKi8q9yRt-3hMGj2StrvsM'
});



exports.getNearestDriver = function(db, userLat, userLon, mobile, callback) {
	console.log("1");
	getCity(userLat, userLon, function(city, location) {
		console.log("2 - "+city+" | "+location);
		var requestID = db.registerNewRequest(userLat, userLon, mobile, location, city);
		callback(requestID);
		db.getDrivers(city, function(drivers) {
			console.log("3 - "+drivers.length);
			var userLatLng = userLat+','+userLon;
			breakArrayIntoSmallerChunks(drivers, userLatLng, function(nearestDriver, minDur) {
				console.log("4 - " + JSON.stringify(nearestDriver));
				db.setDriverInactive(nearestDriver.id, nearestDriver.district);
				db.setDriverIdInRequest(requestID, nearestDriver.id);
				db.getUserName(mobile, function(user) {
					console.log("5");
					db.sendRequestToDriver(nearestDriver.phone, userLat, userLon, user, mobile, requestID);
					db.sendDriverLatLngToUser(mobile, requestID);
				});
			});
		});
	});
	
};

function getCity (lat, lon, callback) {
	googleMapsClient.reverseGeocode({
		latlng:  lat + ',' + lon
	},function(err, res) {
		if (!err) {
			var city = null;
			var location = '';
			if(res.json.results[0].address_components.some(function(obj) {
				location += obj.short_name + ' ';
				if(obj.types.some(function(type) {
					if(type == 'administrative_area_level_2') { city = obj.long_name; return true;}
				})) {return true;}
			})) {
				callback(city, location);
			} else {
				console.log("No City found");
				callback(null, location);
			}
		} else{
			console.log(err);
		}
	});
};

// exports.getCity = getCity;
function getDist (j, driverLatLngs, userLatLng, callback) {
	googleMapsClient.distanceMatrix({
		origins: driverLatLngs,
		destinations: userLatLng,
		units: "metric"
	},function(err, res) {
		if (!err) {
			var minDur, i;
			res.json.rows.forEach(function(row,index) {
				var dur = row.elements[0].duration.value;
				if (minDur == null) {
					minDur = dur;
					i = index + j;
				} else {
					if (minDur>dur) {
						minDur = dur;
						i = index + j;
					}					
				}
			});
			// console.log(JSON.stringify(res.json,null,2));
			callback(minDur,i);
		} else{
			console.log("getDistError: "+err);
		}
	});
};
exports.getDist = getDist;

function breakArrayIntoSmallerChunks(drivers, userLatLng, callback) {
	var i,j,tempDrivers,chunk = 20;
	var count = 0;
	var batches = Math.ceil(drivers.length/chunk);
	console.log("batches:"+batches);
	var nearestDrivers = [];
	function processResponse (minDur,i) {
		console.log(minDur+"|"+i);
		nearestDrivers.push([drivers[i], minDur]);
		if(++count == batches) {
			console.log("reach1");
			nearestDrivers.sort(function(a, b) {
				return a[1]-b[1];
			});
			callback(nearestDrivers[0][0], nearestDrivers[0][1]);
		}
	}

	//code to break drivers array into 26 drivers each
	for (i=0,j=drivers.length; i<j; i+=chunk) {
		tempDrivers = drivers.slice(i,i+chunk);
		var driverLatLngs = '';
		tempDrivers.forEach(function(driver) {
			if(!driverLatLngs.length == 0) {
				driverLatLngs += '|';
			}
			driverLatLngs += driver.latitude+','+driver.longitude;
		});
		// console.log(i+'|'+driverLatLngs+'|'+userLatLng+'|');	
		getDist(i, driverLatLngs, userLatLng, processResponse);
	}
}

exports.createCity = function fillTable(db, city, lat, lng, pagetoken){
	var params = {
		language: 'en',
		location: [lat, lng],
		radius: 10000,
		type: 'hospital'
	};
	if(pagetoken!=null){
		params['pagetoken'] = pagetoken;
	}
	googleMapsClient.placesNearby(params, function(err, res) {
		result = res.json.results;
		result.forEach(function(el) {
			if(el.name.toLowerCase().includes("hospital")){
				console.log(el.name);
				console.log(el.geometry.location);
				db.registerNagpur(city, el.name, el.geometry.location);
			}
		});
		if(res.json.next_page_token!=null){
			console.log("Still in process");
			setTimeout(function() { fillTable(db, city, lat,lng,res.json.next_page_token);}, 2100);
		}
	});
};

