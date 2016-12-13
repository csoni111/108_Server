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
  var driverData = db.ref('driver');
  driverData.once('value', function(cities) {
    cities.forEach(function(city) {
      cityNames.push(city.key);
      count.push(city.numChildren());
      city.forEach(function(driver) {
        var driver = driver.val();
        if(driver.status == 'active') {
          var latlng = new google.maps.LatLng(driver.latitude,driver.longitude);
          createMarker(latlng, driver.name, driver.phoneNumber,'ambulance');
        }
      });
    });
    var totalCount = count.reduce(function(total, num) { return total+num; });
    $('div.ambulances .value .val').animateNumber({ number: totalCount }, 3000);
    showCityWiseAmbulancesChart(count, totalCount);
    addMarkerCluster();
  });  
}

// Requests data for graph:
// ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
// [20710 ,22810 ,41210 ,28010 ,19158 ,35326 ,30837 ,49477]

function test() {
  // With popup.
  var provider = new firebase.auth.GithubAuthProvider();
  provider.addScope('repo');
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a GitHub Access Token.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    console.log(user);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    if (errorCode === 'auth/account-exists-with-different-credential') {
      alert('You have signed up with a different provider for that email.');
      // Handle linking here if your app allows it.
    } else {
      console.error(error);
    }
  });
}