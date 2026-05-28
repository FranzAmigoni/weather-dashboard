# Backend Setup Guide

## Overview

The backend is a simple Node.js/Express server that acts as a **secure proxy** for the OpenWeatherMap API. This keeps your API key hidden and allows safe front-end requests.

## Installation

### 1. Install Dependencies

```bash
npm install
```

This installs:
- **express**: Web server framework
- **cors**: Cross-Origin Resource Sharing
- **axios**: HTTP client for API requests
- **dotenv**: Environment variable management

### 2. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your real API key
nano .env
```

**Contents of `.env`:**
```
OPENWEATHERMAP_API_KEY=your_actual_api_key_here
PORT=5000
NODE_ENV=development
```

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

The server will start and watch for file changes. Default: `http://localhost:5000`

### Production Mode

```bash
npm start
```

## API Endpoints

### 1. Get Weather by Coordinates
```
GET /api/weather?lat=51.5085&lon=-0.1257
```

**Query Parameters:**
- `lat` (required): Latitude
- `lon` (required): Longitude

**Response:**
```json
{
  "name": "London",
  "main": {
    "temp": 15.3,
    "feels_like": 14.8,
    "humidity": 72
  },
  "weather": [
    {
      "main": "Clouds",
      "description": "broken clouds"
    }
  ]
}
```

### 2. Get Forecast by Coordinates
```
GET /api/forecast?lat=51.5085&lon=-0.1257
```

**Query Parameters:**
- `lat` (required): Latitude
- `lon` (required): Longitude

**Response:** 5-day forecast with 3-hour intervals

### 3. Geocode City Name to Coordinates
```
GET /api/geo?q=London&limit=1
```

**Query Parameters:**
- `q` (required): City name
- `limit` (optional): Maximum results (default: 1)

**Response:**
```json
[
  {
    "name": "London",
    "lat": 51.5085,
    "lon": -0.1257,
    "country": "GB"
  }
]
```

### 4. Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Weather proxy server is running"
}
```

## Testing

### Using cURL

```bash
# Test geocoding
curl "http://localhost:5000/api/geo?q=Paris"

# Test weather
curl "http://localhost:5000/api/weather?lat=48.8566&lon=2.3522"

# Test health
curl "http://localhost:5000/health"
```

### Using Browser

Simply paste in your address bar:
```
http://localhost:5000/api/geo?q=Tokyo
http://localhost:5000/api/weather?lat=35.6762&lon=139.6503
```

## Deploying to Production

### Option 1: Heroku (Recommended for free/low-cost)

1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
2. **Login**: `heroku login`
3. **Create app**: `heroku create your-app-name`
4. **Add API key secret**:
   ```bash
   heroku config:set OPENWEATHERMAP_API_KEY=your_real_key
   ```
5. **Deploy**:
   ```bash
   git push heroku main
   ```
6. **Update frontend** `app.js`:
   ```javascript
   const API_BASE_URL = 'https://your-app-name.herokuapp.com';
   ```

### Option 2: Railway.app

1. Visit: https://railway.app
2. Connect your GitHub repository
3. Add environment variables via UI
4. Deploy automatically

### Option 3: Render.com

1. Visit: https://render.com
2. Create new Web Service
3. Connect GitHub
4. Add `OPENWEATHERMAP_API_KEY` environment variable
5. Deploy

## Troubleshooting

### 401 Unauthorized from OpenWeatherMap
- Check your API key is correct
- Verify key is activated (wait 2 hours after signup)
- Confirm email verification

### CORS Errors
- Server includes `Access-Control-Allow-Origin: *`
- Should work from any frontend
- Check browser console for specific errors

### Port Already in Use
```bash
# Change port in .env
PORT=3000
```

Or kill the process:
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Missing Environment Variables
- Make sure `.env` file exists in root directory
- Verify `OPENWEATHERMAP_API_KEY` is set
- Don't add `.env` to GitHub (use `.env.example` instead)

## Security Best Practices

✅ **Do This:**
- Keep API key in `.env` (not in code)
- Add `.env` to `.gitignore`
- Use HTTPS in production
- Rate limit requests if needed

❌ **Don't Do This:**
- Commit `.env` file
- Hardcode API key in source
- Use in public-facing frontend directly
- Share your API key publicly

## Architecture

```
Frontend (GitHub Pages)
        ↓
    app.js
        ↓
http://localhost:5000 (or deployed URL)
        ↓
    server.js (Node.js)
        ↓
OpenWeatherMap API (with hidden API key)
```

Your API key is **never exposed** to the browser!

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Create `.env` file with your API key
3. ✅ Start server: `npm run dev`
4. ✅ Test endpoints with cURL or browser
5. ✅ Deploy to production service
6. ✅ Update frontend `API_BASE_URL` in `app.js`
7. ✅ Test from live frontend

## Support

For issues, check:
- Server console logs
- Browser DevTools Network tab
- OpenWeatherMap API documentation: https://openweathermap.org/api
