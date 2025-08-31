import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  X,
  Dumbbell as GymLogo,
  UserPlus,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userType: 'admin' | 'frontdesk';
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, userType, isCollapsed, setIsCollapsed }) => {

  const adminNavItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/leads', icon: UserPlus, label: 'Leads' },
    { to: '/admin/blogs', icon: FileText, label: 'Blog Management' },
  ];

  const frontdeskNavItems = [
    { to: '/frontdesk', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/frontdesk/leads', icon: UserPlus, label: 'Leads' },
  ];

  const navItems = userType === 'admin' ? adminNavItems : frontdeskNavItems;
  const bgGradient = userType === 'admin' 
    ? 'from-blue-900 to-blue-800' 
    : 'from-cyan-800 to-blue-800';

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b ${bgGradient} text-white transition-all duration-300 ease-in-out transform md:translate-x-0 md:static md:inset-auto md:h-screen shadow-xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <GymLogo className="h-6 w-6" />
            </div>
            {!isCollapsed && <span className="text-xl font-bold">FitFlix</span>}
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Logo - desktop */}
        <div className="hidden md:flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <GymLogo className="h-8 w-8" />
            </div>
            {!isCollapsed && <span className="text-xl font-bold">FitFlix</span>}
          </div>
          
          {/* Collapse/Expand button - desktop only */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1 rounded-lg hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* User Type Badge */}
        <div className="px-4 py-3">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            userType === 'admin' 
              ? 'bg-blue-500/20 text-blue-200' 
              : 'bg-cyan-500/20 text-cyan-200'
          } ${isCollapsed ? 'justify-center' : ''}`}>
            {!isCollapsed && (userType === 'admin' ? 'Central Admin' : 'Front Desk')}
            {isCollapsed && (userType === 'admin' ? 'CA' : 'FD')}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-2 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              end={item.end}
              className={({ isActive }) => 
                `flex items-center px-3 py-3 text-sm rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                    : 'text-gray-200 hover:bg-white/10 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && item.label}
            </NavLink>
          ))}
        </nav>

        {/* Version info */}
        <div className="absolute bottom-0 w-full p-4 text-xs text-gray-300 border-t border-white/10">
          <div className={`${isCollapsed ? 'text-center' : ''}`}>
            <p>FitFlix {userType === 'admin' ? 'Admin' : 'Front Desk'} v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="h-6 w-6" />
      </button>
    </>
  );
};

export default Sidebar;