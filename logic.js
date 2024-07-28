// Read in JSON
const url = "https://raw.githubusercontent.com/GeeksGhost/NC_Housing_Project/main/housing.json";
const tenYearDataUrl = "https://raw.githubusercontent.com/GeeksGhost/NC_Housing_Project/main/ten_year_data.json";

// Create the tile layers
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let satellitemap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
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
    "Satellite Map": satellitemap
};

// Add layer control to the map
L.control.layers(baseMaps).addTo(map);

// Function to determine color based on price
function getColor(price) {
    return price > 500000 ? '#67000d' :
           price > 400000 ? '#FF8C00' :
           price > 300000 ? '#FFFF00' :
           price > 200000 ? '#6B8E23' :
           price > 100000 ? '#228B22' :
                            '#90EE90';  // Light green for the cheapest prices
}

// Add the legend to the map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [0, 100000, 200000, 300000, 400000, 500000];
    var labels = [];

    // Loop through the grades and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            (grades[i] ? '$' + grades[i] + ' - $' + (grades[i + 1] || '+') + '<br>' : '$' + grades[i] + '+<br>');
    }

    return div;
};

// Add the legend to the map
legend.addTo(map);

// Fetch and process the ten year JSON data
fetch(tenYearDataUrl)
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            if (item.latitude && item.longitude) {
                // Find the date with the highest price
                let maxPriceDate = Object.keys(item).filter(key => key.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)).reduce((max, date) => 
                    parseFloat(item[date]) > parseFloat(item[max]) ? date : max, Object.keys(item).filter(key => key.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/))[0]
                );
                
                let maxPrice = parseFloat(item[maxPriceDate]);

                // Calculate the lowest and median prices
                let prices = Object.keys(item).filter(key => key.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)).map(date => parseFloat(item[date])).sort((a, b) => a - b);
                let minPrice = prices[0];
                let medianPrice = prices[Math.floor(prices.length / 2)];

                // Determine marker color based on the highest price
                let color = getColor(maxPrice);

                // Prepare historical price data for the line graph
                let priceData = {};
                Object.keys(item).filter(key => key.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)).forEach(date => {
                    priceData[date] = parseFloat(item[date]);
                });

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
                    <button onclick="window.open('info.html?regionName=${item.RegionName}&stateName=${item.StateName}&maxPrice=${maxPrice}&minPrice=${minPrice}&medianPrice=${medianPrice}&maxPriceDate=${maxPriceDate}&minPriceDate=${item[Object.keys(item).filter(key => parseFloat(item[key]) === minPrice)[0]]}&medianPriceDate=${item[Object.keys(item).filter(key => parseFloat(item[key]) === medianPrice)[0]]}&priceData=${encodeURIComponent(JSON.stringify(priceData))}', '_blank')">More Information</button>
                `)
                .on('click', function (e) {
                    this.openPopup();
                });

                // Add the marker to the map
                marker.addTo(map);
            }
        });
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });
