import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Wind, Thermometer, EyeOff, CloudRain, Clock, RefreshCw } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock weather data - in a real app, this would come from the API
const generateMockWeatherData = () => {
  return {
    current: {
      temperature: Math.floor(Math.random() * 15) + 10,
      windSpeed: Math.floor(Math.random() * 25) + 5,
      windDirection: Math.floor(Math.random() * 360),
      visibility: Math.floor(Math.random() * 7) + 3,
      precipitation: Math.random() * 5,
      cloudCoverage: Math.floor(Math.random() * 100),
      condition: ['clear', 'partly cloudy', 'cloudy', 'rain', 'fog'][Math.floor(Math.random() * 5)],
      weatherAlert: Math.random() > 0.8
    },
    forecast: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      temperature: Math.floor(Math.random() * 10) + 15,
      windSpeed: Math.floor(Math.random() * 15) + 5,
      precipitation: Math.random() * 10,
      visibility: Math.floor(Math.random() * 5) + 5
    }))
  };
};

const WeatherMonitoring: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading weather data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setWeatherData(generateMockWeatherData());
      setLoading(false);
    }, 1000);
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setWeatherData(generateMockWeatherData());
      setLoading(false);
    }, 500);
  };

  // Chart data
  const temperatureChartData = {
    labels: weatherData?.forecast.map((item: any) => item.time) || [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: weatherData?.forecast.map((item: any) => item.temperature) || [],
        borderColor: 'rgba(234, 88, 12, 1)',
        backgroundColor: 'rgba(234, 88, 12, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const windChartData = {
    labels: weatherData?.forecast.map((item: any) => item.time) || [],
    datasets: [
      {
        label: 'Wind Speed (knots)',
        data: weatherData?.forecast.map((item: any) => item.windSpeed) || [],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const visibilityChartData = {
    labels: weatherData?.forecast.map((item: any) => item.time) || [],
    datasets: [
      {
        label: 'Visibility (km)',
        data: weatherData?.forecast.map((item: any) => item.visibility) || [],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  // Get weather condition icon
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear': return <Cloud className="h-10 w-10 text-blue-300" />;
      case 'partly cloudy': return <Cloud className="h-10 w-10 text-gray-300" />;
      case 'cloudy': return <Cloud className="h-10 w-10 text-gray-400" />;
      case 'rain': return <CloudRain className="h-10 w-10 text-blue-400" />;
      case 'fog': return <EyeOff className="h-10 w-10 text-gray-400" />;
      default: return <Cloud className="h-10 w-10 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Weather Monitoring</h1>
        <button 
          onClick={refreshData}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          {/* Current Weather */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-700 rounded-lg p-6 shadow-md border border-gray-600"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                {getWeatherIcon(weatherData.current.condition)}
                <div>
                  <h2 className="text-2xl font-bold capitalize">{weatherData.current.condition}</h2>
                  <div className="flex items-center text-sm text-gray-300 mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Updated at {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              {weatherData.current.weatherAlert && (
                <div className="bg-red-500 bg-opacity-20 border border-red-600 text-red-300 px-4 py-2 rounded-md flex items-center">
                  <span className="mr-2">⚠️</span>
                  <span>Weather alert: Strong winds affecting operations</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-gray-400">Temperature</div>
                  <Thermometer className="h-5 w-5 text-orange-400" />
                </div>
                <div className="mt-2 text-3xl font-bold">{weatherData.current.temperature}°C</div>
                <div className="mt-1 text-xs text-gray-400">Feels like {weatherData.current.temperature - 2}°C</div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-gray-400">Wind</div>
                  <Wind className="h-5 w-5 text-blue-400" />
                </div>
                <div className="mt-2 text-3xl font-bold">{weatherData.current.windSpeed} kts</div>
                <div className="mt-1 text-xs text-gray-400">Direction: {weatherData.current.windDirection}°</div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-gray-400">Visibility</div>
                  <EyeOff className="h-5 w-5 text-green-400" />
                </div>
                <div className="mt-2 text-3xl font-bold">{weatherData.current.visibility} km</div>
                <div className="mt-1 text-xs text-gray-400">
                  {weatherData.current.visibility > 5 ? 'Good visibility' : 'Reduced visibility'}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-gray-400">Precipitation</div>
                  <CloudRain className="h-5 w-5 text-blue-400" />
                </div>
                <div className="mt-2 text-3xl font-bold">{weatherData.current.precipitation.toFixed(1)} mm</div>
                <div className="mt-1 text-xs text-gray-400">Cloud cover: {weatherData.current.cloudCoverage}%</div>
              </div>
            </div>
          </motion.div>

          {/* Weather Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600">
              <h3 className="text-lg font-semibold mb-4">Temperature Trend (24h)</h3>
              <div className="h-60">
                <Line data={temperatureChartData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600">
              <h3 className="text-lg font-semibold mb-4">Wind Speed Trend (24h)</h3>
              <div className="h-60">
                <Line data={windChartData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600">
              <h3 className="text-lg font-semibold mb-4">Visibility Trend (24h)</h3>
              <div className="h-60">
                <Line data={visibilityChartData} options={chartOptions} />
              </div>
            </div>
          </motion.div>

          {/* Weather Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600"
          >
            <h3 className="text-lg font-semibold mb-4">Weather Impact Assessment</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-32 text-gray-400">Flight Operations:</div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  weatherData.current.windSpeed > 20 || weatherData.current.visibility < 5
                    ? 'bg-red-500 bg-opacity-20 text-red-300'
                    : 'bg-green-500 bg-opacity-20 text-green-300'
                }`}>
                  {weatherData.current.windSpeed > 20 || weatherData.current.visibility < 5
                    ? 'High Impact'
                    : 'Normal Operations'}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-gray-400">Runway Conditions:</div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  weatherData.current.precipitation > 2
                    ? 'bg-yellow-500 bg-opacity-20 text-yellow-300'
                    : 'bg-green-500 bg-opacity-20 text-green-300'
                }`}>
                  {weatherData.current.precipitation > 2 ? 'Wet' : 'Dry'}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-gray-400">Visibility Status:</div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  weatherData.current.visibility < 3
                    ? 'bg-red-500 bg-opacity-20 text-red-300'
                    : weatherData.current.visibility < 7
                    ? 'bg-yellow-500 bg-opacity-20 text-yellow-300'
                    : 'bg-green-500 bg-opacity-20 text-green-300'
                }`}>
                  {weatherData.current.visibility < 3
                    ? 'Poor'
                    : weatherData.current.visibility < 7
                    ? 'Moderate'
                    : 'Good'}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-gray-400">Wind Impact:</div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  weatherData.current.windSpeed > 25
                    ? 'bg-red-500 bg-opacity-20 text-red-300'
                    : weatherData.current.windSpeed > 15
                    ? 'bg-yellow-500 bg-opacity-20 text-yellow-300'
                    : 'bg-green-500 bg-opacity-20 text-green-300'
                }`}>
                  {weatherData.current.windSpeed > 25
                    ? 'Severe'
                    : weatherData.current.windSpeed > 15
                    ? 'Moderate'
                    : 'Low'}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h4 className="font-semibold mb-2">Recommended Actions:</h4>
              <ul className="space-y-2 text-sm">
                {weatherData.current.windSpeed > 20 && (
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Monitor crosswind component for Runways 27L and 27R
                  </li>
                )}
                {weatherData.current.visibility < 5 && (
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    Implement reduced visibility procedures
                  </li>
                )}
                {weatherData.current.precipitation > 2 && (
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Check runway surface conditions regularly
                  </li>
                )}
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Continue monitoring weather trends over next 3 hours
                </li>
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default WeatherMonitoring;