const makemap = function (gpxfile,linecolor = 'red', mainmap='OpenStreetMap.Mapnik') {
  var map = L.map('map', {fullscreenControl: true});

  var baseMaps = {
  	"CartoDB": L.tileLayer.provider('CartoDB.Positron'),
	"CyclOSM": L.tileLayer.provider('CyclOSM'),
  	"OpenStreetMap": L.tileLayer.provider('OpenStreetMap.Mapnik'),
	"ESRI World Imagery": L.tileLayer.provider('Esri.WorldImagery'),
	"StamenWatercolor": L.tileLayer.provider('Stadia.StamenWatercolor'),
  };

  L.tileLayer.provider(mainmap).addTo(map);
  var latlon = [];


  var onEachFeature = function (feature, layer) {
	coords = feature.geometry.coordinates;
	for ( var i=0; i < coords.length; ++i ){
		latlon.push(L.latLng(coords[i][1], coords[i][0]));
	}	
  };

  var customLayer = L.geoJson(null, {
  	style: function(feature) {
  		return {
  			color: linecolor,
  			weight: 3,
  			opacity: .75
  			};
  	},
	onEachFeature: onEachFeature
  });

  omnivore.gpx(gpxfile, null, customLayer).on('ready', function() {
	line = L.polyline(latlon, { color: linecolor, showAll: 11, offset: 1600, distanceMarkers: true });
	L.marker(latlon[0]).addTo(map);
	map.addLayer(line);
	map.fitBounds(line.getBounds());
  });


  L.control.layers(baseMaps, [], {autoZIndex:false, collapsed:false}).addTo(map);
  return 
}