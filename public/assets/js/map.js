var map;
var infoWindow;
var markers = {};
var markerCluster;

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
   markerCluster = new MarkerClusterer(map, [], {imagePath: './assets/images/m'});
   google.maps.event.addListener(map, 'click', function() {
      infoWindow.close();
   });
   fetchDriverData();
   fetchRequests();
   fetchUsers();
}

function createMarker(driverId, latlng, name, phone, type){
   var iconUrl = './assets/images/' + type + '.png';
   var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      scrollwheel: false,
      title: name,
      icon: iconUrl
   });
   marker.addListener('click', function() {
      var iwContent = '<div id="iw_container_list" style="float:left;">' +
      '<div class="iw_title">' + name + '</div>' +
      '<div class="iw_content">' + '+91'+phone + '</div></div>';
      infoWindow.setContent(iwContent);
      infoWindow.open(map, marker);
   });
   markerCluster.addMarker(marker);
   markers[driverId] = marker;
}

function addMarkerCluster() {
   // var allMarkers = [];
   // $.each(markers, function(index, marker) {
   //    allMarkers.push(marker);
   // });
   markerCluster = new MarkerClusterer(map, allMarkers,
      {imagePath: './assets/images/m'});
}