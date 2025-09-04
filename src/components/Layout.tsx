import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Users, FileText, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { leadApi } from '../services/leads';
import { authService } from '../services/auth';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newLeads, setNewLeads] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    const fetchNew = async () => {
      try {
        const res = await leadApi.getAll();
        const count = res.data?.filter((l: any) => l.status === 'NEW').length || 0;
        if (mounted) setNewLeads(count);
      } catch (e) {}
    };
    fetchNew();
    const id = setInterval(fetchNew, 15000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Blogs', href: '/blogs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Fitflix Admin</h1>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                    {item.name === 'Leads' && newLeads > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs px-2 py-0.5">
                        {newLeads}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;