const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Validate API key on startup
if (!API_KEY) {
  console.error('ERROR: OPENWEATHERMAP_API_KEY environment variable is not set');
  process.exit(1);
}

console.log('✓ API Key loaded successfully');

// Base URL for OpenWeatherMap API
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Route: Get current weather
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'lat and lon query parameters are required'
      });
    }

    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch weather data',
      message: error.response?.data?.message || error.message
    });
  }
});

// Route: Get forecast
app.get('/api/forecast', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'lat and lon query parameters are required'
      });
    }

    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Forecast API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch forecast data',
      message: error.response?.data?.message || error.message
    });
  }
});

// Route: Geocode city name to coordinates
app.get('/api/geo', async (req, res) => {
  try {
    const { q, limit } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'q (city name) query parameter is required'
      });
    }

    const response = await axios.get(`${BASE_URL}/geo/1.0/direct`, {
      params: {
        q,
        limit: limit || 1,
        appid: API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Geocoding API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to geocode location',
      message: error.response?.data?.message || error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Weather proxy server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /api/weather?lat=<lat>&lon=<lon>',
      'GET /api/forecast?lat=<lat>&lon=<lon>',
      'GET /api/geo?q=<city-name>&limit=1',
      'GET /health'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Weather proxy server running on http://localhost:${PORT}`);
  console.log(`📍 Available endpoints:`);
  console.log(`   GET /api/weather?lat=<lat>&lon=<lon>`);
  console.log(`   GET /api/forecast?lat=<lat>&lon=<lon>`);
  console.log(`   GET /api/geo?q=<city-name>`);
  console.log(`   GET /health`);
  console.log(`\n✓ API key is configured and ready`);
});
