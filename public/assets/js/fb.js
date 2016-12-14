// Initialize Firebase
var db;
var config = {
  apiKey: "AIzaSyBm5h3QNFsa04Eap2nrTvi1MMnDgP0Ds6s",
  databaseURL: "https://hackathon-65c39.firebaseio.com",
  authDomain: "hackathon-65c39.firebaseapp.com",
  // storageBucket: "hackathon-65c39.appspot.com",
  // messagingSenderId: "617155210229"
};
firebase.initializeApp(config);
db = firebase.database();

function fetchDriverData() {
  var count = [];
  var cityNames = [];
  db.ref('driver').once('value', function(cities) {
    cities.forEach(function(city) {
      cityNames.push(city.key);
      count.push(city.numChildren());
      city.forEach(function(driver) {
        var marker;
        var driverId = driver.key;
        var driver = driver.val();
        if(driver.status == 'active') {
          var latlng = new google.maps.LatLng(driver.latitude,driver.longitude);
          createMarker(driverId, latlng, driver.name, driver.phone,'ambulance');
        }
      });
      city.ref.on('child_changed', function(driver) {
        var driverId = driver.key;
        console.log(driverId);
        driver = driver.val();
        if(driver.status == 'active') {
          var latlng = new google.maps.LatLng(driver.latitude, driver.longitude);
          if (markers[driverId] != null) {
            markers[driverId].setPosition(latlng);
            console.log("updated");
          } else {
            createMarker(driverId, latlng, driver.name, driver.phone,'ambulance');
            console.log("created new");
          }
        } else {
          if (markers[driverId] != null) {
            markerCluster.removeMarker(markers[driverId]);
            markers[driverId].setMap(null);
            markers[driverId] = null;
            console.log("removed");
          }
        }
      });
    });
    var totalCount = count.reduce(function(total, num) { return total+num; });
    $('div.ambulances .value .val').animateNumber({ number: totalCount }, 3000);
    showCityWiseAmbulancesChart(count, totalCount);
    // addMarkerCluster();
  });  
}

// Requests data for graph:
// ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
// [20710 ,22810 ,41210 ,28010 ,19158 ,35326 ,30837 ,49477]
function fetchRequests() {
  var count = 0;
  var requestData = db.ref('requests');
  requestData.once("value", function(requests) {
    count = requests.numChildren();
    requests.forEach(function(request) {
      request = request.val();
      var tmpl = $.templates(".lastRequestsListItem#"+request.status);
      var post = tmpl.render({name : request.name, location: request.location});
      container.append(post);
    });
  });
  requestData.on("child_added", function() {});
}