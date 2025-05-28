import React, { useState, useEffect } from 'react';
import { Bell, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alerts, setAlerts] = useState<string[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    // Update clock every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, []);

  // Demo alerts - in a real app, these would come from the API
  useEffect(() => {
    setAlerts([
      'Weather alert: Strong crosswinds on Runway 27L',
      'Flight UA789 requesting emergency landing',
      'Maintenance scheduled for Runway 09R in 2 hours'
    ]);
  }, []);

  return (
    <header className="bg-gray-900 shadow-md border-b border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Airport Control Tower
            </span>
            <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">DIGITAL TWIN</span>
          </div>

          <div className="flex items-center space-x-6">
            {/* Clock */}
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-mono">
                {format(currentTime, 'HH:mm:ss')}
              </span>
              <span className="text-xs text-gray-400">
                {format(currentTime, 'MMM dd, yyyy')}
              </span>
            </div>

            {/* Alerts */}
            <div className="relative">
              <button
                className="relative p-1 rounded-full hover:bg-gray-700 transition-colors"
                onClick={() => setShowAlerts(!showAlerts)}
              >
                <Bell className="h-5 w-5 text-blue-400" />
                {alerts.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {alerts.length}
                  </span>
                )}
              </button>

              {/* Alerts dropdown */}
              {showAlerts && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700">
                  <div className="py-2 px-3 border-b border-gray-700">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {alerts.map((alert, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 hover:bg-gray-700 border-b border-gray-700 last:border-b-0"
                      >
                        <p className="text-sm">{alert}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(currentTime, 'HH:mm:ss')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                <span className="text-sm font-bold">AT</span>
              </div>
              <span className="text-sm">Air Traffic Controller</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;