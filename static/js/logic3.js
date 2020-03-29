// Store our API endpoint inside queryUrl
// Store our API endpoint inside queryUrl
console.log('geo json import!!!!', geoJson);

  // Define streetmap and darkmap layers
    var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: "pk.eyJ1IjoiZGFtdWRqZTkxIiwiYSI6ImNrM3RlZzBveTAyMWgzZW4yMmhqdm5iNm4ifQ.hq8K8gwIF5QKuQJFaMyaiA"
    });

      // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [light]
  });

  counties = L.geoJSON(geoJson).addTo(myMap);

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light": light
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Counties": counties
  };



  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map