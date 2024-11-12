const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const mongoose = require('mongoose');
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Keys - In production, these should be in environment variables
TOMORROW_API_KEY = 'oj71NSVcpoM8cdFLkZwsKpfK90yOZr3b'
// TOMORROW_API_KEY = 'nJvS33p4zSuTtO33WWWgLrBuxzXNMqo5'
// TOMORROW_API_KEY = 'FPv8svvrJxNVsSCGYjFG8UZ3XTOjR1kn'
// GOOGLE_MAPS_API_KEY = 'AIzaSyC2qqTgT2VvCctWuPjS3L4OUjUUZBjV5Lw'
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://shruti:shruti@hw3.uzeai.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected...');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

const favoriteSchema = new mongoose.Schema({
    city: { type: String, unique: true },
    state: String,
}, { timestamps: true });
const Favorite = mongoose.model('Favorite', favoriteSchema);

async function fetchWeatherData(latitude, longitude, timesteps) {
    try {
        const params = new URLSearchParams({
            location: `${latitude},${longitude}`,
            fields: [
                'temperature', 'humidity', 'uvIndex',
                'weatherCode', 'visibility', 'cloudCover',
                'pressureSeaLevel', 'windSpeed',
                'temperatureMax', 'temperatureMin',
                'precipitationType', 'precipitationProbability',
                'sunriseTime', 'sunsetTime', 'windDirection'
            ].join(','),
            timesteps: timesteps,
            apikey: TOMORROW_API_KEY,
            timezone: 'America/Los_Angeles',
            units: 'imperial'
        });

        const url = `https://api.tomorrow.io/v4/timelines?${params}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        return null;
    }
}

// Route for basic weather info
app.get('/api/weather', async (req, res) => {
    try {

        const {lat, long} = req.query;
        console.log(lat);
        console.log(long);
        const weatherData = await fetchWeatherData(
            lat,
            long,
            'current,1d,1h'
        );

        if (!weatherData) {
            return res.status(500).json({ error: 'Error fetching weather data' });
        }
        const timelines = weatherData.data.timelines;
        let forecast = timelines.find(t => t.timestep === '1d');
        let current = timelines.find(t => t.timestep === 'current');
        let hourly = timelines.find(t => t.timestep === '1h');

        res.json({
            // location: coordinates.formattedAddress,
            curr: current,
            forecast: forecast,
            hourly : hourly
        });

    } catch (error) {
        console.error('Error in /weather endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});
app.post('/api/favorite', async (req, res) => {
    try {
        const { city, state } = req.body;
        if (!city || !state) {
            return res.status(400).json({ error: 'City and state are required' });
        }

        // Create a new favorite entry
        const newFavorite = new Favorite({ city, state });
        await newFavorite.save();
        
        res.status(201).json({
            message: 'City and state saved successfully!',
            data: newFavorite
        });
    } catch (error) {
        console.error('Error saving favorite city/state:', error);
        res.status(500).json({ error: 'Error saving favorite' });
    }
});

app.get('/api/getfavorites', async (req, res) => {
    try {
        const favorites = await Favorite.find(); 
        res.json(favorites); 
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Error fetching favorites' });
    }
});

app.delete('/api/deletefavorite/:city', async (req, res) => {
    try {
        const { city } = req.params;

        const deletedFavorite = await Favorite.findOneAndDelete({ city });

        if (!deletedFavorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.status(200).json({ message: 'Favorite deleted successfully' });
    } catch (error) {
        console.error('Error deleting favorite:', error);
        res.status(500).json({ error: 'Error deleting favorite' });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});