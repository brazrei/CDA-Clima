function loadMap(){
    var map = L.map('map', {
        center: [-15.505, -53.09],
        zoom: 4
    });
    
    var osm = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    osm.addTo(map);
};

$(document).ready(function(){
        loadMap()
  });
