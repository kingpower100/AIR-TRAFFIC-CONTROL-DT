import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Cloud, FoldHorizontal as RoadHorizontal, AlertTriangle } from 'lucide-react';
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

// Mock data - in a real app, this would come from the API
const mockData = {
  activeFlights: 24,
  activeRunways: 3,
  weatherCondition: 'Partly Cloudy',
  temperature: 22,
  windSpeed: 8,
  alerts: 2
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState(mockData);
  
  // Mock time-series data for charts
  const [flightChartData, setFlightChartData] = useState({
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Active Flights',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 30) + 10),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  });

  const [weatherChartData, setWeatherChartData] = useState({
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10) + 15),
        borderColor: 'rgba(234, 88, 12, 1)',
        backgroundColor: 'rgba(234, 88, 12, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => ({
        ...prevData,
        activeFlights: Math.floor(Math.random() * 10) + 20,
        temperature: Math.floor(Math.random() * 5) + 20,
        windSpeed: Math.floor(Math.random() * 5) + 5
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Airport Control Tower Dashboard</h1>
        <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
          LIVE
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Flights</p>
              <h2 className="text-3xl font-bold mt-2">{data.activeFlights}</h2>
            </div>
            <div className="p-3 bg-blue-500 bg-opacity-20 rounded-full">
              <Plane className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            <span className="text-green-400">↑ 12%</span> from last hour
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Runways</p>
              <h2 className="text-3xl font-bold mt-2">{data.activeRunways}/4</h2>
            </div>
            <div className="p-3 bg-green-500 bg-opacity-20 rounded-full">
              <RoadHorizontal className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            <span className="text-yellow-400">! 1</span> in maintenance
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Weather</p>
              <h2 className="text-xl font-bold mt-2">{data.weatherCondition}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span>{data.temperature}°C</span>
                <span className="text-gray-400">|</span>
                <span>{data.windSpeed} knots</span>
              </div>
            </div>
            <div className="p-3 bg-orange-500 bg-opacity-20 rounded-full">
              <Cloud className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Alerts</p>
              <h2 className="text-3xl font-bold mt-2">{data.alerts}</h2>
            </div>
            <div className="p-3 bg-red-500 bg-opacity-20 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
          </div>
          <div className="mt-2 text-sm text-red-400">
            {data.alerts > 0 ? 'Active alerts - Check notifications' : 'No active alerts'}
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600"
        >
          <h3 className="text-lg font-semibold mb-4">Flight Activity (24h)</h3>
          <div className="h-60">
            <Line data={flightChartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600"
        >
          <h3 className="text-lg font-semibold mb-4">Temperature Trend (24h)</h3>
          <div className="h-60">
            <Line data={weatherChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600"
      >
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { time: '11:30 AM', event: 'Flight BA456 cleared for landing on Runway 27L' },
            { time: '11:27 AM', event: 'Weather update: Wind speed increased to 12 knots' },
            { time: '11:23 AM', event: 'Flight UA789 requested emergency priority' },
            { time: '11:18 AM', event: 'Runway 09R maintenance completed' },
            { time: '11:15 AM', event: 'Flight DL123 departed from Runway 09L' },
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-600 rounded">
              <div className="w-16 text-sm text-gray-400">{item.time}</div>
              <div className="flex-1">{item.event}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;