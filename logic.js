// Create a map object.
let myMap = L.map("map", {
    center: [37.09024, -95.712891],
    zoom: 4
  });

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a legend to display information about our map.
let info = L.control({
    position: "bottomright"
  });

d3.json(link).then(function(data) {
    dataset = data.features;
    //console.log(dataset.length)
    for (let i = 0; i < dataset.length; i++) {

        // Conditionals for earthquakes depth
        let color_to_fill = "";
        
        if (dataset[i].geometry.coordinates[2] > 90) {
            color_to_fill = "red";
        }
        else if (dataset[i].geometry.coordinates[2] > 70) {
            color_to_fill = "#FC4903";
        }
        else if (dataset[i].geometry.coordinates[2] > 50) {
            color_to_fill = "#FC8403";
        }
        else if (dataset[i].geometry.coordinates[2] > 30) {
            color_to_fill = "#FCAD03";
        }
        else if (dataset[i].geometry.coordinates[2] > 10) {
        color_to_fill = "#CAFC03";
        }
        else {
            color_to_fill = "green";
        }
        
        let cordinates = [dataset[i].geometry.coordinates[1],dataset[i].geometry.coordinates[0]]
        L.circle(cordinates, {
            fillOpacity: 0.5,
            color:'grey',
            fillColor: color_to_fill,
            radius:  dataset[i].properties.mag * 50000
            }).bindPopup(`<h1>${dataset[i].properties.place}</h1> <hr> <h3>Magnitude: ${dataset[i].properties.mag}
                </h3><hr> <h3>Depth: ${dataset[i].geometry.coordinates[2]}</h3>`)
            .addTo(myMap); 
    }
    // Create a legend to display information about our map.
    info.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<i style="background:green"></i><span>-10 - 10</span><br>';
        div.innerHTML += '<i style="background:#CAFC03"></i><span>10 - 30</span><br>';
        div.innerHTML += '<i style="background:#FCAD03"></i><span>30 - 50</span><br>';
        div.innerHTML += '<i style="background:#FC8403"></i><span>50 - 70</span><br>';
        div.innerHTML += '<i style="background:#FC4903"></i><span>70 - 90</span><br>';
        div.innerHTML += '<i style="background:red"></i><span>90+</span>';
        return div;
    };
    // Add the info legend to the map.
    info.addTo(myMap);
  });