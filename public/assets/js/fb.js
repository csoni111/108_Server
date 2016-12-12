// Initialize Firebase
var db;
var config = {
  apiKey: "AIzaSyBm5h3QNFsa04Eap2nrTvi1MMnDgP0Ds6s",
  databaseURL: "https://hackathon-65c39.firebaseio.com",
  // authDomain: "hackathon-65c39.firebaseapp.com",
  // storageBucket: "hackathon-65c39.appspot.com",
  // messagingSenderId: "617155210229"
};
firebase.initializeApp(config);
db = firebase.database();

function fetchDriverData() {
  var count = 0;
  var driverData = db.ref('driver');
  driverData.once('value', function(cities) {
    // removeAllMarkers();
    cities.forEach(function(city) {
      city.forEach(function(driver) {
        var driver = driver.val();
        var latlng = new google.maps.LatLng(driver.latitude,driver.longitude);
        createMarker(latlng, driver.name, driver.phoneNumber,'ambulance', driver.status);
        count++;
      });
    });
    addMarkerCluster();
    $('div.ambulances .value .val').animateNumber({ number: count },3000);
  });  
}