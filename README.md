# 🌤️ Weather Dashboard

A beautiful, responsive weather dashboard that fetches real-time weather data from OpenWeatherMap API.

## Features

- 🌍 **Real-time Weather Data**: Current weather conditions and forecasts
- 📍 **Geolocation Support**: Get weather for your current location
- 🔍 **City Search**: Search weather for any city worldwide
- 📊 **Detailed Information**: Temperature, humidity, wind speed, pressure, visibility, and more
- 📅 **5-Day Forecast**: Visual forecast for the next 5 days
- ⏰ **Hourly Forecast**: 12-hour detailed forecast
- 📱 **Fully Responsive**: Works on desktop, tablet, and mobile devices
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations

## Getting Started

### Prerequisites
- A web browser with JavaScript enabled
- Internet connection (for API calls)
- Optional: API key from [OpenWeatherMap](https://openweathermap.org/api) (free tier available)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/FranzAmigoni/weather-dashboard.git
cd weather-dashboard
```

2. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or use a local server:
   ```bash
   python -m http.server 8000
   # Then navigate to http://localhost:8000
   ```

### Getting an API Key (Optional)

The dashboard comes with a free API key for demonstration. For production use:

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Create a free account
3. Generate an API key
4. Replace the `API_KEY` in `app.js` with your key

## Usage

1. **Search by City Name**:
   - Type a city name in the search box
   - Click "Search" or press Enter

2. **Use Your Location**:
   - Click the 📍 button
   - Allow browser location access
   - Weather for your location will be displayed

3. **View Weather Information**:
   - Current temperature and conditions
   - "Feels like" temperature
   - Humidity, wind speed, pressure
   - Visibility and cloud coverage
   - 5-day forecast
   - Hourly forecast for next 12 hours

## Technical Stack

- **HTML5**: Structure and semantic markup
- **CSS3**: Responsive design with Flexbox and Grid
- **JavaScript (Vanilla)**: Weather data fetching and DOM manipulation
- **OpenWeatherMap API**: Real-time weather data

## API Reference

### Current Weather
```
GET https://api.openweathermap.org/data/2.5/weather
```

### Forecast
```
GET https://api.openweathermap.org/data/2.5/forecast
```

### Geocoding
```
GET https://api.openweathermap.org/data/2.5/geo/1.0/direct
```

## File Structure

```
weather-dashboard/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── app.js              # JavaScript logic
└── README.md           # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features to Consider Adding

- [ ] Temperature unit conversion (Celsius/Fahrenheit)
- [ ] Weather alerts and warnings
- [ ] Air quality index (AQI)
- [ ] Multiple city comparison
- [ ] Weather history
- [ ] Dark/Light theme toggle
- [ ] Local storage for favorite cities
- [ ] Weather map visualization
- [ ] Severe weather notifications
- [ ] Sunrise/Sunset times

## Troubleshooting

### "City not found" error
- Double-check the city name spelling
- Try using the city code or coordinates instead

### Geolocation not working
- Ensure location permission is granted to the browser
- Check if running on HTTPS (some browsers require this)

### API errors
- Verify API key is valid
- Check API rate limits (free tier has limits)
- Ensure internet connection is active

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons and design inspiration from various weather apps
- Weather emoji support

## Support

For issues, suggestions, or feedback, please create an issue on GitHub.

---

**Happy weather checking! ☀️🌧️⛈️**