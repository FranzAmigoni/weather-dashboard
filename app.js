const API_KEY = 'f757d06625abe40baeca4c9ec21ccb16'; // Free tier API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const geolocationBtn = document.getElementById('geolocationBtn');
const weatherContainer = document.getElementById('weatherContainer');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const welcomeMessage = document.getElementById('welcomeMessage');

// Event Listeners
searchBtn.addEventListener('click', () => searchWeather());
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather();
});
geolocationBtn.addEventListener('click', getGeolocation);

// Search Weather by City
async function searchWeather() {
    const city = searchInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    showLoading(true);
    hideError();
    
    try {
        // Get coordinates from city name
        const geoResponse = await fetch(
            `${BASE_URL}/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoResponse.json();
        
        if (!geoData.length) {
            showError('City not found. Please try another search.');
            showLoading(false);
            return;
        }
        
        const { lat, lon } = geoData[0];
        await fetchWeatherData(lat, lon);
    } catch (error) {
        showError('Error fetching weather data. Please try again.');
        console.error(error);
    } finally {
        showLoading(false);
    }
}

// Get User Geolocation
function getGeolocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    showLoading(true);
    hideError();
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(latitude, longitude);
        },
        (error) => {
            showError('Unable to get your location. Please enable location access.');
            console.error(error);
            showLoading(false);
        }
    );
}

// Fetch Weather Data
async function fetchWeatherData(lat, lon) {
    try {
        // Fetch current weather and forecast
        const weatherResponse = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        
        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        
        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
        displayHourlyForecast(forecastData);
        
        showWeatherContainer();
        searchInput.value = '';
    } catch (error) {
        showError('Error loading weather data. Please try again.');
        console.error(error);
    } finally {
        showLoading(false);
    }
}

// Display Current Weather
function displayCurrentWeather(data) {
    const {
        name,
        sys: { country },
        main: { temp, feels_like, humidity, pressure },
        weather: [{ description, icon }],
        wind: { speed },
        visibility,
        clouds: { all }
    } = data;
    
    document.getElementById('cityName').textContent = `${name}, ${country}`;
    document.getElementById('temperature').textContent = Math.round(temp);
    document.getElementById('weatherDescription').textContent = description;
    document.getElementById('feelsLike').textContent = Math.round(feels_like);
    document.getElementById('humidity').textContent = humidity;
    document.getElementById('windSpeed').textContent = speed.toFixed(1);
    document.getElementById('pressure').textContent = pressure;
    document.getElementById('visibility').textContent = (visibility / 1000).toFixed(1);
    document.getElementById('clouds').textContent = all;
    
    // Weather icon
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    document.getElementById('weatherIcon').src = iconUrl;
    
    // UV Index (if available in data)
    const uviElement = document.getElementById('uvi');
    uviElement.textContent = 'N/A';
}

// Display 5-Day Forecast
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    
    const dailyForecasts = {};
    
    // Group forecast data by day
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                temps: [],
                weather: item.weather[0],
                description: item.weather[0].main
            };
        }
        dailyForecasts[date].temps.push(item.main.temp);
    });
    
    // Display forecasts (limit to 5 days)
    Object.entries(dailyForecasts).slice(0, 5).forEach(([date, data]) => {
        const minTemp = Math.round(Math.min(...data.temps));
        const maxTemp = Math.round(Math.max(...data.temps));
        const icon = data.weather.icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-date">${date}</div>
            <img src="${iconUrl}" alt="${data.description}" style="width: 50px; height: 50px; margin: 0 auto;">
            <div class="forecast-temp">${minTemp}° / ${maxTemp}°</div>
            <div class="forecast-description">${data.description}</div>
        `;
        forecastContainer.appendChild(card);
    });
}

// Display Hourly Forecast
function displayHourlyForecast(data) {
    const hourlyContainer = document.getElementById('hourlyContainer');
    hourlyContainer.innerHTML = '';
    
    // Display next 12 hours
    data.list.slice(0, 12).forEach(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        
        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        
        const card = document.createElement('div');
        card.className = 'hourly-card';
        card.innerHTML = `
            <div class="hourly-time">${time}</div>
            <img src="${iconUrl}" alt="Weather" style="width: 40px; height: 40px;">
            <div class="hourly-temp">${temp}°</div>
        `;
        hourlyContainer.appendChild(card);
    });
}

// UI Helper Functions
function showWeatherContainer() {
    weatherContainer.classList.remove('hidden');
    welcomeMessage.classList.add('hidden');
}

function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
}

// Initialize
window.addEventListener('load', () => {
    hideError();
});
