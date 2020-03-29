// Store our API endpoint inside queryUrl
var EQURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var Plates_Data = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

// Perform a GET request to the query URL
d3.json(EQURL, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createEQFeatures(data.features);
});

function colorize (num) {
    if (num < 1) {
        return "#00bcd4"
    }
    else if (num < 2) {
        return '#00897b'
    }
    else if (num < 3) {
        return "#43a047"
    }
    else if (num < 4) {
        return '#f39c12'
    }
    else if (num < 5) {
        return '#d35400'
    }
    else {
        return '#a93226'
    }
};

function createEQFeatures(earthquakeData) {
  
    function myStyle(mag) {
        return {radius: (mag * 5),
        fillColor: colorize(mag),
        color: colorize(mag),
        weight: 2}
    };
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    var title = `${feature.properties.title}`;
    layer.bindPopup("<p>"+title+"</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, myStyle(feature.properties.mag));
    },
    onEachFeature: onEachFeature
  });
  
  var tectonicPlates = new L.LayerGroup();
  
  d3.json(Plates_Data, data => {
      L.geoJSON(data).addTo(tectonicPlates)
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes, tectonicPlates);
}

function createMap(earthquakes, tectonicPlates) {

  // Define streetmap and darkmap layers
    var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: "pk.eyJ1IjoiZGFtdWRqZTkxIiwiYSI6ImNrM3Rld3hlcDAyNm8zbXFsdnJ3M2F5MGMifQ.WVZKs3Ya5luN4GvVc4Z2jA"
    });

    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: "pk.eyJ1IjoiZGFtdWRqZTkxIiwiYSI6ImNrM3Rld3hlcDAyNm8zbXFsdnJ3M2F5MGMifQ.WVZKs3Ya5luN4GvVc4Z2jA"
    });

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoiZGFtdWRqZTkxIiwiYSI6ImNrM3Rld3hlcDAyNm8zbXFsdnJ3M2F5MGMifQ.WVZKs3Ya5luN4GvVc4Z2jA"
    });

    var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: "pk.eyJ1IjoiZGFtdWRqZTkxIiwiYSI6ImNrM3Rld3hlcDAyNm8zbXFsdnJ3M2F5MGMifQ.WVZKs3Ya5luN4GvVc4Z2jA"
    });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Terrain" :outdoors,
    "Street": streetmap,
    "Light": light,
    "Dark": dark
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonicPlates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [outdoors, earthquakes,tectonicPlates]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0,1,2,3,4,5],
            labels = [];

        div.innerHTML += 'Magnitude:<br>'
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colorize(grades[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

    var title = L.control({position: 'bottomleft'});

    title.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend');

        div.innerHTML += 'Earthquakes within the last week.'

        return div;
    };

    title.addTo(myMap);
}
