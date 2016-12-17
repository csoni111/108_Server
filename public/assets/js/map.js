var map;
var infoWindow;
var driverMarkers = {};
var requestMarkers = {}
var driverMarkerCluster;
var requestMarkerCluster;

function initMap() {
   map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: new google.maps.LatLng(13.0827,80.2707),
      zoom: 11,
      scrollwheel: false,
      mapTypeControlOptions: {
         mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
      }
   });
   infoWindow = new google.maps.InfoWindow();
   driverMarkerCluster = new MarkerClusterer(map, [], {imagePath: './assets/images/m'});
   requestMarkerCluster = new MarkerClusterer(map, [], {imagePath: './assets/images/m'});
   google.maps.event.addListener(map, 'click', function() {
      infoWindow.close();
   });
   fetchDriverData();
   fetchRequests();
   fetchUsers();
}

function createMarker(id, latlng, name, phone, type){
   var iconUrl = './assets/images/' + type + '.png';
   var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      scrollwheel: false,
      title: name,
      icon: iconUrl
   });
   if(type == 'ambulance') {
      marker.addListener('click', function() {
         var iwContent = '<div id="iw_container_list" style="float:left;">' +
         '<div class="iw_title">' + name + '</div>' +
         '<div class="iw_content">' + '+91'+phone + '</div></div>';
         infoWindow.setContent(iwContent);
         infoWindow.open(map, marker);
      });
      driverMarkerCluster.addMarker(marker);
      driverMarkers[id] = marker;
   } else if (type == 'request') {
      marker.addListener('click', function() {
         var iwContent = '<div id="iw_container_list" style="float:left;">' +
         '<div class="iw_title">' + name + '</div>' +
         '<div class="iw_content">' + '+91'+phone + '</div></div>';
         infoWindow.setContent(iwContent);
         infoWindow.open(map, marker);
      });
      requestMarkerCluster.addMarker(marker);
      requestMarkers[id] = marker;
   }
}

// function addMarkerCluster(type) {
//    var allMarkers = [];
//    if(type == 'ambulance') {
//       // $.each(driverMarkers, function(index, marker) {
//       //    allMarkers.push(marker);
//       // });
//       driverMarkerCluster = new MarkerClusterer(map, allMarkers,
//          {imagePath: './assets/images/m'});
//    } else if(type == 'request') {
//       // $.each(requestMarkers, function(index, marker) {
//       //    allMarkers.push(marker);
//       // });
//       requestMarkerCluster = new MarkerClusterer(map, allMarkers,
//          {imagePath: './assets/images/m'});
//    }
// }