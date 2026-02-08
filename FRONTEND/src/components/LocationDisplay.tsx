import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Wind, Droplets, Loader, AlertCircle } from 'lucide-react';
import './LocationDisplay.css';

interface WeatherData {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
}

export function LocationDisplay() {
  const { t } = useTranslation();
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:8000/weather');
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error('Error fetching location:', err);
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  if (loading) {
    return (
      <div className="location-display loading">
        <Loader className="spinner" size={48} />
        <p>{t('fetchingLocation')}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="location-display error">
        <AlertCircle size={48} />
        <p>{t('locationError')}</p>
        {error && <small>{error}</small>}
      </div>
    );
  }

  const { location, weather } = data;
  const windDirection = Math.round(weather.winddirection);

  return (
    <div className="location-display">
      <div className="location-header">
        <MapPin size={32} className="icon" />
        <div>
          <h2>{t('currentLocation')}</h2>
          <p className="location-name">{location.name}, {location.country}</p>
        </div>
      </div>
      
      <div className="location-content">
        <div className="coordinates-card">
          <p className="label">Coordinates</p>
          <div className="coords">
            <span>📍 {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E</span>
          </div>
          <p className="timestamp">{new Date(weather.time).toLocaleString()}</p>
        </div>

        <div className="weather-grid">
          <div className="weather-card temperature">
            <p className="value">{Math.round(weather.temperature)}°C</p>
            <p className="label">Temperature</p>
          </div>
          
          <div className="weather-card wind">
            <Wind size={24} className="icon" />
            <p className="value">{weather.windspeed}</p>
            <p className="label">Wind Speed (km/h)</p>
            <small>Direction: {windDirection}°</small>
          </div>
          
          <div className="weather-card code">
            <Droplets size={24} className="icon" />
            <p className="value">{weather.weathercode}</p>
            <p className="label">Weather Code</p>
          </div>
        </div>
      </div>
    </div>
  );
}
