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
  var container = $("table.last-requests tbody");
  if(container.length) {
    var count = 0;
    var requestData = db.ref('requests').orderByKey();
    requestData.once("value", function(requests) {
      count = requests.numChildren();
      $('div.requests .value .val').animateNumber({ number: count }, 3000);
    });
    requestData.on("child_added", function(request) { 
      container.prepend(addRequestToContainer(request.val()));
      if($("table.last-requests tbody tr").length > 5) {
        var req = $("table.last-requests tbody tr:last");
        req.remove();
      }
    });
    requestData.on("child_changed", function(request) {
      request = request.val();
      var req = $("table.last-requests tbody tr."+request.mobile);
      if(req.length) {
        newRequest = addRequestToContainer(request);
        req.replaceWith(newRequest);
      }
    });
  }
}

function addRequestToContainer(request) {
  var tmpl = $.templates(".lastRequestsListItem#"+request.status);
  return tmpl.render({req: request});
}

function fetchUsers() {
  var count = 0;
  var userData = db.ref('users');
  userData.once('value', function(users) {
    count = users.numChildren();
    $('div.users .value .val').animateNumber({ number: count }, 3000);
  });
}