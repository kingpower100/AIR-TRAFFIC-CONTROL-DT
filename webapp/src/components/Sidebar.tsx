import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Plane, Cloud, FoldHorizontal as RoadHorizontal, Settings, Laptop, HelpCircle } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/flights', label: 'Flight Tracking', icon: <Plane className="h-5 w-5" /> },
    { path: '/weather', label: 'Weather', icon: <Cloud className="h-5 w-5" /> },
    { path: '/runways', label: 'Runways', icon: <RoadHorizontal className="h-5 w-5" /> },
    { path: '/simulation', label: 'Simulation', icon: <Laptop className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-md bg-blue-500 flex items-center justify-center">
            <Plane className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AirportDT</h1>
            <p className="text-xs text-gray-400">Digital Twin Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="px-4 py-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <NavLink
            to="/settings"
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </NavLink>
          <NavLink
            to="/help"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <HelpCircle className="h-5 w-5" />
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;