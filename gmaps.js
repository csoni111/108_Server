
var googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyCr2AVH-9JAHDKi8q9yRt-3hMGj2StrvsM'
});



exports.getNearestDriver = function(db, userLat, userLon, callback) {
	// console.log("1");
	getCity(userLat, userLon, function(city) {
		// console.log("2 - "+city);
		db.getDrivers(city, function(drivers) {
			// console.log("3");
			var userLatLng = userLat+','+userLon;
			breakArrayIntoSmallerChunks(drivers, userLatLng, callback);
		});
	});
	
};

function getCity (lat, lon, callback) {
	googleMapsClient.reverseGeocode({
		latlng:  lat + ',' + lon
	},function(err, res) {
		if (!err) {
			var city = null;
			if(res.json.results[0].address_components.some(function(obj) {
				if(obj.types.some(function(type) {
					if(type == 'administrative_area_level_2') { city = obj.long_name; return true;}
				})) {return true;}
			})) {
				callback(city);
			} else {
				console.log("No City found");
				callback(null);
			}
		} else{
			console.log(err);
		}
	});
};

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

function breakArrayIntoSmallerChunks(drivers, userLatLng, callback) {
	var i,j,tempDrivers,chunk = 26;
	var count = 0;
	var batches = Math.ceil(drivers.length/chunk);
	// console.log("batches:"+batches);
	var nearestDrivers = [];
	function processResponse (minDur,i) {
		// console.log(minDur+"|"+i);
		nearestDrivers.push(drivers[i]);
		if(++count == batches) {
			// console.log("reach1");
			if(nearestDrivers.length>1) {
				// console.log("reach2");
				/* If there are more than one driver then process them again in batches of 25 */
				breakArrayIntoSmallerChunks(nearestDrivers, userLatLng, callback)
			} else {
				// console.log("reach3");
				/* If only one driver remain then send the output */
				callback(JSON.stringify(nearestDrivers[0]));
			}
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
		getDist(i, driverLatLngs, userLatLng, processResponse);
	}
}

// exports.getDist = getDist;

