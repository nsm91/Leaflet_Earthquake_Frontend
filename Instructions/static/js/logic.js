// Adding tile layer
var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.light",
accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.outdoors",
accessToken: API_KEY
});

var pirates = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.pirates",
accessToken: API_KEY
});

var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.dark",
accessToken: API_KEY
});

var EQ_Data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var Plates_Data = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

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

var eq_markers = [];
var eqLayer;

d3.json(EQ_Data, function(data) {
    // console.log(data.features)
    data.features.forEach(function(eq) {
        // console.log(eq)
        var lat = eq.geometry.coordinates[1];
        var lon = eq.geometry.coordinates[0];
        var mag = (eq.properties.mag);
        var title = `${eq.properties.title}`;
        // console.log(lat);
        eq_markers.push(
            L.circleMarker(
                [lat, lon], 
                {
                    radius: (mag * 5),
                    fillColor: colorize(mag),
                    color: colorize(mag),
                    weight: 2
                }
            ).bindPopup("<p>"+title+"</p>")//.addTo(myMap)
        )
    // console.log(eq_markers)
    })
    // eqLayer = L.layerGroup(eq_markers);
});

eqLayer = L.layerGroup(eq_markers);
console.log(eq_markers);
console.log(eq_markers[1]);
console.log(eq_markers.length);
console.log(eqLayer.getLayers());
 
var tecLines = [];

d3.json(Plates_Data, function(data) {
    data.features.forEach(function(plate) {
        tecLines.push(
            L.polyline(plate.geometry.coordinates)
    )})
});

var tecLayer = L.layerGroup(tecLines);

// Creating map object
var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 5,
    layers: [outdoors, eqLayer]
});

var overlayMaps = {
    "Earthquakes": eqLayer,
    "Tectonic Plates": tecLayer
};

var baseMaps = {
    "Terrain": outdoors,
    "Light": light,
    "Dark": dark,
    "Pirate": pirates,
};

L.control.layers(baseMaps, overlayMaps).addTo(myMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,1,2,3,4,5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorize(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};



legend.addTo(myMap);