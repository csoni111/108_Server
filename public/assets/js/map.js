var map;
var infoWindow;
var markers=[];

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
   google.maps.event.addListener(map, 'click', function() {
      infoWindow.close();
   });
   fetchDriverData();
}

function createMarker(latlng, name, phone, type){
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
   markers.push(marker);

}

function addMarkerCluster() {
   var markerCluster = new MarkerClusterer(map, markers,
      {imagePath: './assets/images/m'});
}

function removeAll(){
   markers.forEach(function(marker) {
      marker.setMap(null);
   });
   markers = [];
}