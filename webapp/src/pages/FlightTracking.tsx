import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Filter, SortAsc, RefreshCw } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';

// Mock flight data - in a real app, this would come from the API
const generateMockFlights = () => {
  const flights = [];
  const statuses = ['scheduled', 'boarding', 'taxiing', 'airborne', 'landed'];
  const airlines = ['UA', 'BA', 'DL', 'AA', 'LH', 'AF', 'EK'];

  for (let i = 1; i <= 20; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNum = Math.floor(Math.random() * 1000) + 100;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    flights.push({
      id: `Flight:${airline}${flightNum}`,
      callSign: `${airline}${flightNum}`,
      aircraftType: Math.random() > 0.5 ? 'Boeing 737-800' : 'Airbus A320',
      origin: ['JFK', 'LAX', 'LHR', 'CDG', 'DXB'][Math.floor(Math.random() * 5)],
      destination: ['SFO', 'ORD', 'ATL', 'FRA', 'SYD'][Math.floor(Math.random() * 5)],
      status,
      altitude: status === 'airborne' ? Math.floor(Math.random() * 35000) + 5000 : 0,
      speed: status === 'airborne' ? Math.floor(Math.random() * 500) + 300 : 0,
      heading: Math.floor(Math.random() * 360),
      position: {
        lat: (Math.random() * 180) - 90,
        lng: (Math.random() * 360) - 180
      },
      estimatedArrival: new Date(Date.now() + Math.floor(Math.random() * 10 * 60 * 60 * 1000)).toISOString(),
      assignedRunway: ['RW27L', 'RW27R', 'RW09L', 'RW09R'][Math.floor(Math.random() * 4)]
    });
  }
  
  return flights;
};

// 3D Flight visualization component
const FlightVisualization = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Sphere args={[3, 64, 64]}>
        <meshStandardMaterial color="#1E3A8A" wireframe />
      </Sphere>
      {/* Flight points would be added here in a real implementation */}
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
};

const FlightTracking: React.FC = () => {
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Simulate loading flight data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFlights(generateMockFlights());
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-gray-500';
      case 'boarding': return 'bg-yellow-500';
      case 'taxiing': return 'bg-orange-500';
      case 'airborne': return 'bg-blue-500';
      case 'landed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredFlights = filter === 'all' 
    ? flights 
    : flights.filter(flight => flight.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Flight Tracking</h1>
        <button 
          onClick={() => setFlights(generateMockFlights())}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold">Filter Flights</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
          >
            All Flights
          </button>
          <button 
            onClick={() => setFilter('scheduled')}
            className={`px-3 py-1 rounded-md text-sm ${filter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
          >
            Scheduled
          </button>
          <button 
            onClick={() => setFilter('boarding')}
            className={`px-3 py-1 rounded-md text-sm ${filter === 'boarding' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
          >
            Boarding
          </button>
          <button 
            onClick={() => setFilter('taxiing')}
            className={`px-3 py-1 rounded-md text-sm ${filter === 'taxiing' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
          >
            Taxiing
          </button>
          <button 
            onClick={() => setFilter('airborne')}
            className={`px-3 py-1 rounded-md text-sm ${filter === 'airborne' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
          >
            Airborne
          </button>
          <button 
            onClick={() => setFilter('landed')}
            className={`px-3 py-1 rounded-md text-sm ${filter === 'landed' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
          >
            Landed
          </button>
        </div>
      </div>

      {/* 3D Visualization and Flight List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Globe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-1 bg-gray-700 rounded-lg shadow-md border border-gray-600 overflow-hidden"
          style={{ height: '500px' }}
        >
          <div className="p-4 border-b border-gray-600 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Flight Visualization</h3>
            <div className="bg-blue-500 text-xs px-2 py-1 rounded-full">3D VIEW</div>
          </div>
          <div className="h-full">
            <FlightVisualization />
          </div>
        </motion.div>

        {/* Flight List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2 bg-gray-700 rounded-lg shadow-md border border-gray-600"
        >
          <div className="p-4 border-b border-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">Flight List</h3>
              <div className="bg-gray-600 text-xs px-2 py-1 rounded-full">
                {filteredFlights.length} flights
              </div>
            </div>
            <button className="flex items-center space-x-1 text-sm text-gray-300 hover:text-white">
              <SortAsc className="h-4 w-4" />
              <span>Sort</span>
            </button>
          </div>

          <div className="overflow-auto max-h-[440px]">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-800 text-left text-sm">
                  <tr>
                    <th className="px-4 py-3">Flight</th>
                    <th className="px-4 py-3">Route</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Altitude</th>
                    <th className="px-4 py-3">Speed</th>
                    <th className="px-4 py-3">ETA</th>
                    <th className="px-4 py-3">Runway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredFlights.map((flight) => (
                    <tr key={flight.id} className="hover:bg-gray-600">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Plane className="h-4 w-4 text-blue-400" />
                          <span className="font-medium">{flight.callSign}</span>
                        </div>
                        <div className="text-xs text-gray-400">{flight.aircraftType}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span>{flight.origin}</span>
                          <span className="text-gray-500">→</span>
                          <span>{flight.destination}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(flight.status)} bg-opacity-20 text-white`}>
                          {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {flight.status === 'airborne' ? (
                          <span>{flight.altitude.toLocaleString()} ft</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {flight.status === 'airborne' ? (
                          <span>{flight.speed} kts</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(flight.estimatedArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">
                        {flight.assignedRunway}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FlightTracking;