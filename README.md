# Visualizing tectonic activity with Leaflet.js

## Summary

This project is designed as a tool to help people visualize the role that tectonic plates play in seismic activity. This webpage uses USGS earthquake data, updated every five minutes, to create a map of seismic activity. (Credit: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php). The second dataset used is a simple line file of the tectonic plate boundaries, graciously made available at (https://github.com/fraxen/tectonicplates/tree/master/GeoJSON). Upon loading the site, a quick call is made to the USGS to get an up-to-date geoJson for the past week of all earthquakes world wide. Simple and hopefully intuitive, this was my first foray into mapping via Leaflet. 
 