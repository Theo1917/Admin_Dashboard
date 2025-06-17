import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket,
  Users,
  UserCheck,
  Target,
  CreditCard,
  Settings,
  X,
  Dumbbell as GymLogo,
  Building,
  DollarSign,
  UserPlus,
  ClipboardCheck
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userType: 'admin' | 'frontdesk';
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, userType }) => {
  const adminNavItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/tickets', icon: Ticket, label: 'Tickets' },
    { to: '/admin/leads', icon: UserPlus, label: 'Leads' },
    { to: '/admin/user-management', icon: Users, label: 'User Management' },
    { to: '/admin/gym-management', icon: Building, label: 'Gym Management' },
    { to: '/admin/revenue', icon: DollarSign, label: 'Revenue' },
  ];

  const frontdeskNavItems = [
    { to: '/frontdesk', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/frontdesk/tickets', icon: Ticket, label: 'Tickets' },
    { to: '/frontdesk/leads', icon: UserPlus, label: 'Leads' },
    { to: '/frontdesk/customers', icon: Users, label: 'Present Customers' },
    { to: '/frontdesk/check-ins', icon: ClipboardCheck, label: 'Check Ins' },
    { to: '/frontdesk/targets', icon: Target, label: 'Targets' },
    { to: '/frontdesk/membership', icon: CreditCard, label: 'Membership Renewal' },
  ];

  const navItems = userType === 'admin' ? adminNavItems : frontdeskNavItems;
  const bgGradient = userType === 'admin' 
    ? 'from-blue-900 to-blue-800' 
    : 'from-cyan-800 to-blue-800';

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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b ${bgGradient} text-white transition-transform duration-300 ease-in-out transform md:translate-x-0 md:static md:inset-auto md:h-screen shadow-xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <GymLogo className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">FitFlix</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Logo - desktop */}
        <div className="hidden md:flex items-center space-x-2 p-6 border-b border-white/10">
          <div className="bg-white/20 p-2 rounded-lg">
            <GymLogo className="h-8 w-8" />
          </div>
          <span className="text-xl font-bold">FitFlix</span>
        </div>

        {/* User Type Badge */}
        <div className="px-6 py-3">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            userType === 'admin' 
              ? 'bg-blue-500/20 text-blue-200' 
              : 'bg-cyan-500/20 text-cyan-200'
          }`}>
            {userType === 'admin' ? 'Central Admin' : 'Front Desk'}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-2 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              end={item.end}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                    : 'text-gray-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Version info */}
        <div className="absolute bottom-0 w-full p-4 text-xs text-gray-300 border-t border-white/10">
          <p>FitFlix {userType === 'admin' ? 'Admin' : 'Front Desk'} v1.0.0</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;