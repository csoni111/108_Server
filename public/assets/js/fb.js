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
  var totalCount = 0, previousCount = 0;
  db.ref('driver').once('value', function(cities) {
    cities.forEach(function(city) {
      cityNames.push(city.key);
      count.push(city.numChildren());
      city.ref.on('child_changed', function(driver) {
        var driverId = driver.key;
        console.log(driverId);
        driver = driver.val();
        if(driver.status == 'active') {
          var latlng = new google.maps.LatLng(driver.latitude, driver.longitude);
          if (driverMarkers[driverId] != null) {
            driverMarkers[driverId].setPosition(latlng);
            console.log("updated");
          } else {
            createMarker(driverId, latlng, driver.name, driver.phone,'ambulance');
            console.log("created new");
          }
        } else {
          if (driverMarkers[driverId] != null) {
            driverMarkerCluster.removeMarker(driverMarkers[driverId]);
            driverMarkers[driverId].setMap(null);
            driverMarkers[driverId] = null;
            console.log("removed");
          }
        }
      });
      city.ref.on('child_added', function(driver) {
        var driverId = driver.key;
        var driver = driver.val();
        // console.log("new driver added");
        if(driver.status == 'active') {
          var latlng = new google.maps.LatLng(driver.latitude,driver.longitude);
          createMarker(driverId, latlng, driver.name, driver.phone,'ambulance');
        }
      });
    });

    // count++;
    // $('div.ambulances .value .val').prop('number', previousCount).animateNumber({ number: count }, 100);
    // previousCount = count;
    totalCount = count.reduce(function(total, num) { return total+num; });
    $('div.ambulances .value .val').animateNumber({ number: totalCount }, 3000);
    previousCount = totalCount;
    showCityWiseAmbulancesChart(count, totalCount);
    // addMarkerCluster();
  });  
}


function fetchRequests() {
  var container = $("table.last-requests tbody");
  if(container.length) {
    var count = 0, previousCount = 0;
    var requestData = db.ref('requests').orderByKey();
    requestData.on("value", function(requests) {
      count = requests.numChildren();
      $('div.requests .value .val').prop('number', previousCount).animateNumber({ number: count }, 3000);
      previousCount = count;
    });
    requestData.on("child_added", function(request) {
      var requestId = request.key;
      request = request.val();
      getUserName(request.mobile, function(user) {
        request.name = user.name;
        request.gender = user.gender;
        request.age = user.age;
        container.prepend(addRequestToContainer(request));
        if($("table.last-requests tbody tr").length > 5) {
          var req = $("table.last-requests tbody tr:last");
          req.remove();
        }
        if(request.status == 'pending') {
          var latlng = new google.maps.LatLng(request.latitude,request.longitude);
          createMarker(requestId, latlng, request.name, request.mobile, 'request');
        }
      });
    });
    requestData.on("child_changed", function(request) {
      var requestId = request.key;
      request = request.val();
      getUserName(request.mobile, function(user) {
        request.name = user.name;
        var req = $("table.last-requests tbody tr."+request.mobile);
        if(req.length) {
          newRequest = addRequestToContainer(request);
          req.replaceWith(newRequest);
        }
        if(request.status == 'pending') {
          var latlng = new google.maps.LatLng(request.latitude, request.longitude);
          if (requestMarkers[requestId] != null) {
            requestMarkers[requestId].setPosition(latlng);
            console.log("request marker updated");
          } else {
            createMarker(requestId, latlng, request.name, request.mobile,'request');
            console.log("created new request marker");
          }
        } else {
          if (requestMarkers[requestId] != null) {
            requestMarkerCluster.removeMarker(requestMarkers[requestId]);
            requestMarkers[requestId].setMap(null);
            requestMarkers[requestId] = null;
            console.log("removed request marker");
          }
        }
      });
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

function getUserName (userMobile, callback) {
  var userData = db.ref('users/'+userMobile);
  userData.once('value', function(user) {
    callback(user.val());
  });
};


// Requests data for graph:
// ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
// [20710 ,22810 ,41210 ,28010 ,19158 ,35326 ,30837 ,49477]

function createRequestsGraph() {
  var count = [];
  var cityNames = [];
  var totalCount = 0;
  var requestData = db.ref('requests').orderByKey();
  var maxDiffHours = 10, millisInHour = (60 * 60 * 1000);
  var currentDate = tempDate = new Date();
  var currentHour = currentDate.getHours();
  var hours = [], data = [];
  for (var i = 0; i < maxDiffHours ; i++, tempDate -= millisInHour) {
    hours.push(new Date(tempDate).getHours() + ':00');
    data[i] = 0;
  }
  hours.reverse();
  requestData.once("value", function(requests) {
    totalCount = requests.numChildren();
    requests.forEach(function(request) {
      request = request.val();
      var dateString = request.date;
      var date = new Date(Date.parse(dateString));
      var diffHours = Math.ceil((currentDate - date)/(millisInHour));
      // console.log("diff:" + diffHours);
      if( diffHours <= maxDiffHours ) {
        var position = maxDiffHours - diffHours - 1;
        data[position]++;
      }
      var index = cityNames.indexOf(request.city);
      if(index == -1) {
        cityNames.push(request.city);
        index = cityNames.indexOf(request.city);
        city[index] = 1;
      } else {
        city[index]++;
      }
    });
    showRequestsChart(hours, data);
    showCityWiseRequestsChart(count, totalCount);
  });
}

$(document).ready(function(){
  $("a#requestChartRefresh").click(function() {
    createRequestsGraph();
  });
  $("a#requestChartRefresh").click();  
});