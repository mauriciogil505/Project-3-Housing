// Create the tile layers
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Initialize the map with base layers
let map = L.map('map', {
    center: [35.7796, -78.6382],  // Centered on Raleigh, NC for better initial view
    zoom: 7,  // Adjusted zoom level for better initial view
    layers: [streetmap]
});

// Base maps object
let baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topomap
};

// Add layer control to the map
L.control.layers(baseMaps).addTo(map);

// URL for GeoJSON data (geometry layer)
const arcgisQuery = "https://services1.arcgis.com/YBWrN5qiESVpqi92/arcgis/rest/services/ncgs_state_county_boundary/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";

// URL for data (values for choropleth)
const housingDataUrl = "https://raw.githubusercontent.com/GeeksGhost/NC_Housing_Project/main/housing.json";

// Function to determine color based on value
function getColor(price) {
    return price > 500000 ? '#67000d' :
           price > 400000 ? '#FF8C00' :
           price > 300000 ? '#FFFF00' :
           price > 200000 ? '#6B8E23' :
           price > 100000 ? '#228B22' :
                            '#90EE90';  // Light green for the lowest values
}

// Add a legend to the map
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let grades = [0, 100000, 200000, 300000, 400000, 500000];
    let labels = [];

    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            (grades[i] ? '$' + grades[i] + ' - $' + (grades[i + 1] || '+') + '<br>' : '$' + grades[i] + '+<br>');
    }

    return div;
};

legend.addTo(map);

// Fetch geometry data and data values
Promise.all([
    fetch(arcgisQuery).then(response => response.json()),
    fetch(housingDataUrl).then(response => response.json())
]).then(([geometryData, dataValues]) => {
    // Store data values in a lookup table for fast access
    let data = {};
    dataValues.forEach(item => {
        data[item.id] = item.value; 
    });

    // Create a GeoJSON layer for the geometry data
    L.geoJson(geometryData, {
        style: function(feature) {
            return {
                fillColor: getColor(data[feature.properties.id]), 
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.County}</h3>`);
        }
    }).addTo(map);

    // Add individual markers
    dataValues.forEach(item => {
        if (item.latitude && item.longitude && item.dates) {
            // Find the date with the highest price
            let maxPriceDate = Object.keys(item.dates).reduce((max, date) =>
                item.dates[date] > item.dates[max] ? date : max, Object.keys(item.dates)[0]
            );

            let maxPrice = item.dates[maxPriceDate];
            let color = getColor(maxPrice);

            // Create a circle marker with the determined color
            let marker = L.circleMarker([item.latitude, item.longitude], {
                color: color,
                fillColor: color,
                fillOpacity: 0.75,
                radius: 10
            })
            .bindPopup(`
                <b>${item.RegionName}</b><br>${item.StateName}<br>
                Highest Price: $${maxPrice}<br>Date: ${maxPriceDate}<br>
                <button onclick="window.open('https://example.com/more-info/${item.RegionID}', '_blank')">More Information</button>
            `)
            .on('click', function(e) {
                this.openPopup();
            });

            // Add the marker to the map
            marker.addTo(map);
        }
    });
}).catch(error => {
    console.error('Error fetching data:', error);
});
