import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FoldHorizontal as RoadHorizontal, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

// Mock runway data - in a real app, this would come from the API
const generateMockRunwayData = () => {
  const runways = [
    { id: 'RW27L', name: 'Runway 27 Left' },
    { id: 'RW27R', name: 'Runway 27 Right' },
    { id: 'RW09L', name: 'Runway 09 Left' },
    { id: 'RW09R', name: 'Runway 09 Right' }
  ];

  const statuses = ['active', 'active', 'active', 'maintenance'];
  const operations = ['landing', 'takeoff', 'takeoff', 'maintenance'];
  const surfaceConditions = ['dry', 'dry', 'wet', 'dry'];

  return runways.map((runway, index) => ({
    id: `RunwayStatus:${runway.id}`,
    runwayId: runway.id,
    name: runway.name,
    length: 3500,
    status: statuses[index],
    operation: operations[index],
    visibility: Math.floor(Math.random() * 5) + 5,
    surfaceCondition: surfaceConditions[index],
    nextScheduledMaintenance: new Date(Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    currentCapacity: Math.floor(Math.random() * 40) + 60,
    usage: {
      last24h: Math.floor(Math.random() * 50) + 30,
      takeoffs: Math.floor(Math.random() * 30) + 15,
      landings: Math.floor(Math.random() * 30) + 15
    }
  }));
};

const RunwayStatus: React.FC = () => {
  const [runwayData, setRunwayData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRunway, setSelectedRunway] = useState<string | null>(null);

  // Simulate loading runway data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const data = generateMockRunwayData();
      setRunwayData(data);
      setSelectedRunway(data[0].runwayId);
      setLoading(false);
    }, 1000);
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setRunwayData(generateMockRunwayData());
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case 'landing': return 'text-blue-400';
      case 'takeoff': return 'text-green-400';
      case 'maintenance': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getSurfaceConditionColor = (condition: string) => {
    switch (condition) {
      case 'dry': return 'text-green-400';
      case 'wet': return 'text-blue-400';
      case 'snow': return 'text-blue-200';
      case 'icy': return 'text-blue-600';
      default: return 'text-gray-400';
    }
  };

  // Get selected runway details
  const selectedRunwayDetails = runwayData.find(runway => runway.runwayId === selectedRunway);

  // Chart data for selected runway
  const operationChartData = {
    labels: ['Takeoffs', 'Landings'],
    datasets: [
      {
        data: selectedRunwayDetails 
          ? [selectedRunwayDetails.usage.takeoffs, selectedRunwayDetails.usage.landings] 
          : [0, 0],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Runway Status</h1>
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
          {/* Runway Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {runwayData.map(runway => (
              <div 
                key={runway.id}
                className={`bg-gray-700 rounded-lg p-4 shadow-md border cursor-pointer transition-all ${
                  selectedRunway === runway.runwayId 
                    ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => setSelectedRunway(runway.runwayId)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <RoadHorizontal className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold">{runway.runwayId}</h3>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(runway.status)} bg-opacity-20 text-white`}>
                    {runway.status.charAt(0).toUpperCase() + runway.status.slice(1)}
                  </div>
                </div>

                <div className="text-sm text-gray-300 mb-3">{runway.name}</div>

                <div className="flex justify-between text-sm mb-2">
                  <div className="text-gray-400">Capacity:</div>
                  <div className="font-medium">{runway.currentCapacity}%</div>
                </div>

                <div className="w-full bg-gray-600 rounded-full h-2.5 mb-4">
                  <div 
                    className={`h-2.5 rounded-full ${
                      runway.currentCapacity > 80 
                        ? 'bg-green-500' 
                        : runway.currentCapacity > 50 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${runway.currentCapacity}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <div className="text-gray-400 mr-1">Operation:</div>
                    <div className={`font-medium ${getOperationColor(runway.operation)}`}>
                      {runway.operation.charAt(0).toUpperCase() + runway.operation.slice(1)}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-400 mr-1">Surface:</div>
                    <div className={`font-medium ${getSurfaceConditionColor(runway.surfaceCondition)}`}>
                      {runway.surfaceCondition.charAt(0).toUpperCase() + runway.surfaceCondition.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Selected Runway Details */}
          {selectedRunwayDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Runway Details */}
              <div className="lg:col-span-2 bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {selectedRunwayDetails.name} ({selectedRunwayDetails.runwayId}) Details
                  </h3>
                  <div className="flex items-center text-sm text-gray-300">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Updated at {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm text-gray-400 mb-2">Runway Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Length:</span>
                        <span>{selectedRunwayDetails.length} meters</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Operation:</span>
                        <span className={getOperationColor(selectedRunwayDetails.operation)}>
                          {selectedRunwayDetails.operation.charAt(0).toUpperCase() + selectedRunwayDetails.operation.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Surface Condition:</span>
                        <span className={getSurfaceConditionColor(selectedRunwayDetails.surfaceCondition)}>
                          {selectedRunwayDetails.surfaceCondition.charAt(0).toUpperCase() + selectedRunwayDetails.surfaceCondition.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Visibility:</span>
                        <span>{selectedRunwayDetails.visibility} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Capacity:</span>
                        <span>{selectedRunwayDetails.currentCapacity}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm text-gray-400 mb-2">Maintenance Schedule</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Scheduled:</span>
                        <span>{new Date(selectedRunwayDetails.nextScheduledMaintenance).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected Duration:</span>
                        <span>4 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Maintenance:</span>
                        <span>{new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Maintenance Type:</span>
                        <span>Standard Inspection</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={selectedRunwayDetails.status === 'maintenance' ? 'text-orange-400' : 'text-green-400'}>
                          {selectedRunwayDetails.status === 'maintenance' ? 'In Progress' : 'Scheduled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts and Recommendations */}
                <div className="mt-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <h4 className="font-semibold">Alerts & Recommendations</h4>
                  </div>

                  <div className="space-y-2">
                    {selectedRunwayDetails.status === 'maintenance' && (
                      <div className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>Runway is currently under maintenance until approximately 15:00 local time</span>
                      </div>
                    )}
                    {selectedRunwayDetails.surfaceCondition === 'wet' && (
                      <div className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Wet surface conditions - increased landing distance required</span>
                      </div>
                    )}
                    {selectedRunwayDetails.visibility < 7 && (
                      <div className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>Reduced visibility operations in effect - increased separation required</span>
                      </div>
                    )}
                    {selectedRunwayDetails.currentCapacity < 70 && (
                      <div className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span>Runway operating below optimal capacity - consider redistributing operations</span>
                      </div>
                    )}
                    {selectedRunwayDetails.status === 'active' && 
                     selectedRunwayDetails.surfaceCondition === 'dry' && 
                     selectedRunwayDetails.visibility >= 7 && 
                     selectedRunwayDetails.currentCapacity >= 70 && (
                      <div className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>Runway operating under optimal conditions - no special procedures required</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Usage Statistics */}
              <div className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600">
                <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
                
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4">
                  <h4 className="text-sm text-gray-400 mb-3">Operations (Last 24h)</h4>
                  <div className="h-48">
                    <Doughnut data={operationChartData} options={chartOptions} />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-sm text-gray-400 mb-2">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Total Operations (24h)</span>
                        <span className="text-sm font-medium">
                          {selectedRunwayDetails.usage.last24h} flights
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${(selectedRunwayDetails.usage.last24h / 100) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Current Capacity</span>
                        <span className="text-sm font-medium">
                          {selectedRunwayDetails.currentCapacity}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            selectedRunwayDetails.currentCapacity > 80 
                              ? 'bg-green-500' 
                              : selectedRunwayDetails.currentCapacity > 50 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedRunwayDetails.currentCapacity}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Efficiency Rating</span>
                        <span className="text-sm font-medium">
                          {Math.floor(Math.random() * 20) + 80}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${Math.floor(Math.random() * 20) + 80}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Peak Hour:</span>
                        <span>10:00 - 11:00</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-400">Peak Operations:</span>
                        <span>{Math.floor(Math.random() * 10) + 15} flights/hour</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default RunwayStatus;