import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RefreshCcw, Settings, Wind, CloudRain, Plane, AlertTriangle } from 'lucide-react';

const Simulation: React.FC = () => {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [weatherScenario, setWeatherScenario] = useState('normal');
  const [trafficLevel, setTrafficLevel] = useState('medium');
  const [emergencyScenario, setEmergencyScenario] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'Simulation initialized and ready',
    'Weather conditions set to normal',
    'Traffic level set to medium',
    'All systems operational'
  ]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 100));
  };

  const toggleSimulation = () => {
    setIsSimulationRunning(!isSimulationRunning);
    addLog(isSimulationRunning ? 'Simulation paused' : 'Simulation started');
  };

  const resetSimulation = () => {
    setIsSimulationRunning(false);
    setWeatherScenario('normal');
    setTrafficLevel('medium');
    setEmergencyScenario(false);
    addLog('Simulation reset to default parameters');
  };

  const handleWeatherChange = (scenario: string) => {
    setWeatherScenario(scenario);
    addLog(`Weather scenario changed to ${scenario}`);
  };

  const handleTrafficChange = (level: string) => {
    setTrafficLevel(level);
    addLog(`Traffic level changed to ${level}`);
  };

  const toggleEmergencyScenario = () => {
    setEmergencyScenario(!emergencyScenario);
    addLog(emergencyScenario 
      ? 'Emergency scenario deactivated' 
      : 'Emergency scenario activated - aircraft requesting emergency landing');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Simulation Control</h1>
        <div className={`px-3 py-1 rounded-full text-sm ${
          isSimulationRunning ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-200'
        }`}>
          {isSimulationRunning ? 'RUNNING' : 'STOPPED'}
        </div>
      </div>

      {/* Main Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600 flex flex-col items-center justify-center">
          <button
            onClick={toggleSimulation}
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
              isSimulationRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'
            } transition-colors`}
          >
            {isSimulationRunning ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white" />
            )}
          </button>
          <span className="text-sm font-medium">
            {isSimulationRunning ? 'Pause Simulation' : 'Start Simulation'}
          </span>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600 flex flex-col items-center justify-center">
          <button
            onClick={resetSimulation}
            className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center mb-3 transition-colors"
          >
            <RefreshCcw className="h-8 w-8 text-white" />
          </button>
          <span className="text-sm font-medium">Reset Simulation</span>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600">
          <div className="flex items-center space-x-2 mb-3">
            <Settings className="h-5 w-5 text-gray-400" />
            <h3 className="font-medium">Simulation Speed</h3>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Speed: {simulationSpeed}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={simulationSpeed}
            onChange={(e) => {
              const newSpeed = parseFloat(e.target.value);
              setSimulationSpeed(newSpeed);
              addLog(`Simulation speed set to ${newSpeed}x`);
            }}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0.5x</span>
            <span>1x</span>
            <span>2x</span>
            <span>3x</span>
            <span>4x</span>
            <span>5x</span>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="font-medium">Emergency Scenario</h3>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Activate emergency:</span>
            <button
              onClick={toggleEmergencyScenario}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                emergencyScenario ? 'bg-red-500' : 'bg-gray-500'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  emergencyScenario ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="text-xs text-gray-400">
            {emergencyScenario 
              ? 'Emergency active: Aircraft requesting priority landing' 
              : 'No active emergency scenarios'}
          </div>
        </div>
      </motion.div>

      {/* Simulation Parameters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Weather Scenarios */}
        <div className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600">
          <div className="flex items-center space-x-2 mb-4">
            <Wind className="h-5 w-5 text-blue-400" />
            <h3 className="font-medium">Weather Scenarios</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleWeatherChange('normal')}
              className={`p-3 rounded-lg border flex items-start transition-colors ${
                weatherScenario === 'normal'
                  ? 'bg-blue-500 bg-opacity-20 border-blue-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Normal</span>
                  <CloudRain className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Clear skies, light winds, good visibility
                </p>
              </div>
            </button>

            <button
              onClick={() => handleWeatherChange('rain')}
              className={`p-3 rounded-lg border flex items-start transition-colors ${
                weatherScenario === 'rain'
                  ? 'bg-blue-500 bg-opacity-20 border-blue-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Rain</span>
                  <CloudRain className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Moderate rain, wet runways, reduced visibility
                </p>
              </div>
            </button>

            <button
              onClick={() => handleWeatherChange('storm')}
              className={`p-3 rounded-lg border flex items-start transition-colors ${
                weatherScenario === 'storm'
                  ? 'bg-blue-500 bg-opacity-20 border-blue-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Thunderstorm</span>
                  <CloudRain className="h-5 w-5 text-orange-400" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Heavy rain, strong winds, lightning, delays
                </p>
              </div>
            </button>

            <button
              onClick={() => handleWeatherChange('fog')}
              className={`p-3 rounded-lg border flex items-start transition-colors ${
                weatherScenario === 'fog'
                  ? 'bg-blue-500 bg-opacity-20 border-blue-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Fog</span>
                  <CloudRain className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Dense fog, very low visibility, ILS approaches only
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Traffic Scenarios */}
        <div className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600">
          <div className="flex items-center space-x-2 mb-4">
            <Plane className="h-5 w-5 text-blue-400" />
            <h3 className="font-medium">Traffic Scenarios</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleTrafficChange('low')}
              className={`p-3 rounded-lg border flex items-start transition-colors ${
                trafficLevel === 'low'
                  ? 'bg-blue-500 bg-opacity-20 border-blue-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Low Traffic</span>
                  <Plane className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  5-10 aircraft per hour, minimal delays
                </p>
              </div>
            </button>

            <button
              onClick={() => handleTrafficChange('medium')}
              className={`p-3 rounded-lg border flex items-start transition-colors ${
                trafficLevel === 'medium'
                  ? 'bg-blue-500 bg-opacity-20 border-blue-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Medium Traffic</span>
                  <Plane className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  15-25 aircraft per hour, occasional delays
                </p>
              </div>
            </button>

            <button
              onClick={() => handleTrafficChange('high')}
              className={`p-3 rounded-lg border flex items-start transition-colors ${
                trafficLevel === 'high'
                  ? 'bg-blue-500 bg-opacity-20 border-blue-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">High Traffic</span>
                  <Plane className="h-5 w-5 text-orange-400" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  30-40 aircraft per hour, frequent delays
                </p>
              </div>
            </button>

            <button
              onClick={() => handleTrafficChange('peak')}
              className={`p-3 rounded-lg border flex items-start transition-colors ${
                trafficLevel === 'peak'
                  ? 'bg-blue-500 bg-opacity-20 border-blue-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Peak Hours</span>
                  <Plane className="h-5 w-5 text-red-400" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  45+ aircraft per hour, maximum capacity, significant delays
                </p>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Simulation Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Simulation Logs</h3>
          <button
            onClick={() => setLogs([])}
            className="text-xs text-gray-400 hover:text-white"
          >
            Clear
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-3 h-60 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center h-full flex items-center justify-center">
              No logs to display
            </div>
          ) : (
            <div className="space-y-1 font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className="text-gray-300">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Simulation;