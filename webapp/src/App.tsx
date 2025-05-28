import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Dashboard from './pages/Dashboard';
import FlightTracking from './pages/FlightTracking';
import WeatherMonitoring from './pages/WeatherMonitoring';
import RunwayStatus from './pages/RunwayStatus';
import Simulation from './pages/Simulation';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 bg-gray-800">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="container mx-auto"
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/flights" element={<FlightTracking />} />
                <Route path="/weather" element={<WeatherMonitoring />} />
                <Route path="/runways" element={<RunwayStatus />} />
                <Route path="/simulation" element={<Simulation />} />
              </Routes>
            </motion.div>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;