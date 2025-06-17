import React from 'react';
import { Menu, Bell, Search, Menu as MenuIcon } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userType: 'admin' | 'frontdesk';
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, userType }) => {
  const bgGradient = userType === 'admin' 
    ? 'from-blue-600 to-blue-700' 
    : 'from-cyan-600 to-blue-600';

  return (
    <header className={`bg-gradient-to-r ${bgGradient} shadow-lg z-10`}>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden text-white hover:text-gray-200 focus:outline-none transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <div className="hidden md:flex md:items-center md:space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-white/20 rounded-lg leading-5 bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-white/30 focus:border-white/30 sm:text-sm backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-2 rounded-lg text-white hover:text-gray-200 hover:bg-white/10 focus:outline-none transition-all duration-200"
            >
              <Bell className="h-6 w-6" />
            </button>
            <div className="relative">
              <button
                type="button"
                className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
              >
                <img
                  className="h-8 w-8 rounded-full border-2 border-white/20"
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="User profile"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;