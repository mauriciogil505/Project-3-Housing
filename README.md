# Project-3-Housing: Analyzing North Carolina Housing Prices

### Project Overview
Investigate the evolution over the last decade of median housing prices across North Carolina's 100 counties to understand regional economic dynamics and housing market stability.

### Analysis Goals
- Trend Analysis: Examine changes in median housing prices over time.
- Visualizations: Create interactive bar charts and maps for data exploration.
- Regional Comparison: Identify and compare patterns and differences in housing prices.

### Methodology
- Data Cleaning: Ensure data accuracy and consistency.
- Exploratory Analysis: Uncover trends and outliers in the data.
- Time Series Analysis: Study the trajectory of housing prices over time.
### Styling of html
- Flexbox used to center bar graph and back buton and align text up and to the left
- 
### Libraries used
- Chart.js
- 
### Logic
File: index.html
Sets up the basic structure of the webpage.
Includes external stylesheets and JavaScript libraries (D3.js, Plotly, and Leaflet).
Contains placeholders for the plot and map visualizations.
Initializes the main script that handles data fetching, cleaning, and visualization.

File: logic.js
Import Libraries: Import necessary libraries (D3.js, Plotly, and Leaflet).
Data Cleaning: Defines a cleanData function to filter out incomplete rows, remove duplicates, and convert data types (numbers and dates).
Data Fetching: Fetches the JSON data using D3.js, logs the loaded data, cleans it, and returns it.
Plotly Visualization: Creates a bar chart using Plotly with the cleaned data, focusing on median housing prices by county.
Leaflet Map: Initializes a Leaflet map centered on North Carolina and plots markers for each county, showing housing price data in popups.
Main Function: Waits for the document to load, fetches the data, and creates the visualizations.

File: info.html
Sets up the structure for displaying detailed information about each county.
Includes placeholders for displaying region name, state name, maximum price, minimum price, median price, and dates with corresponding prices.
Incorporates a back button to return to the main page.
Uses JavaScript to dynamically fill in the placeholders with data for the selected county when the "More information" button is clicked on the main page.

### Steps
Clone Repository: Clone the project to your local machine.
Navigate Directory: Go to the project directory.
Run Application: Open index_copy.html in a web browser.
Explore Results: View interactive visualizations and maps.


### Applications for the Data Analytics
- Educational Purposes: This dataset is ideal for research, case studies, and projects focused on urban economics and housing policy.
- Real Estate Investment: Real estate developers and investors can leverage this data to identify promising markets and make well-informed investment decisions.
- Public Awareness and Advocacy: This analysis can help raise awareness about housing issues and support changes in policies to improve housing affordability and fairness.

### Credits
Dataset: https://www.zillow.com/research/data/
Class recordings and study materials, peer discussions, stackoverflow
