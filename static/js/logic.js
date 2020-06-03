// Marker Size Funtion
function markerSize(mag) {
    return mag * 20000;
};

(async function(){
    earthquake_info = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    const eqData = await d3.json(earthquake_info);

    console.log(eqData.features);

    // Define arrays to hold created city and state markers
    const eqMarkers = [];

    // Loop through locations and create city and state markers
    eqData.features.forEach(feature => {
        
        // Set value for cleaner code
        magnitude = feature.properties.mag;
        
        // Set color based on rules
        let color = "";
        if (magnitude >= 2.5 &&  magnitude <= 5.4) {
            color = "yellow";
        }
        else if (magnitude >= 5.5 &&  magnitude <= 6.0) {
            color = "orange";
        }
        else if (magnitude >= 6.1 &&  magnitude <= 6.9) {
            color = "red";
        }
        else if (magnitude >= 7.0 &&  magnitude <= 7.9) {
            color = "black";
        }

        eqMarkers.push(
            L.circle(feature.geometry.coordinates.slice(0,2).reverse(), {    // THIS IS WHERE I LEFT OFF
            stroke: true,
            fillOpacity: 0.50,
            color: "white",
            fillColor: color,
            radius: markerSize(feature.properties.mag)
            })
        );
    });

    // console.log(eqMarker);

    // Define variables for our base layers
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Create two separate layer groups: one for cities and one for states
    const eqs = L.layerGroup(eqMarkers);  

    // Create a baseMaps object
    const baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create an overlay object
    const overlayMaps = {
        "Earthquakes": eqs,
    };

    // Define a map object
    const myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, eqs]
    });

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
})()