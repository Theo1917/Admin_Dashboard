import React from 'react';
import { Users, Ticket, UserPlus, Building, DollarSign, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, change, isPositive, icon: Icon, gradient }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-lg text-white`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
            {isPositive ? '+' : ''}{change} from last month
          </p>
        )}
      </div>
      <div className="bg-white/20 p-3 rounded-lg">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </motion.div>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold text-gray-800">Central Admin Dashboard</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
        >
          Generate Report
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value="2,847" 
          change="12%" 
          isPositive={true}
          icon={Users}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard 
          title="Open Tickets" 
          value="23" 
          change="5%" 
          isPositive={false}
          icon={Ticket}
          gradient="from-orange-500 to-red-500"
        />
        <StatCard 
          title="New Leads" 
          value="156" 
          change="18%" 
          isPositive={true}
          icon={UserPlus}
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard 
          title="Total Revenue" 
          value="$124,500" 
          change="22%" 
          isPositive={true}
          icon={DollarSign}
          gradient="from-purple-500 to-indigo-500"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Analytics</h3>
          <div className="h-80 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Activity className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600">Revenue chart will be displayed here</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { action: 'New user registered', time: '2 min ago', type: 'success' },
              { action: 'Ticket #1234 resolved', time: '15 min ago', type: 'info' },
              { action: 'Payment received', time: '1 hour ago', type: 'success' },
              { action: 'System maintenance', time: '2 hours ago', type: 'warning' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
          >
            <Building className="h-6 w-6 mb-2" />
            <p className="font-medium">Manage Gyms</p>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
          >
            <UserPlus className="h-6 w-6 mb-2" />
            <p className="font-medium">View Leads</p>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
          >
            <DollarSign className="h-6 w-6 mb-2" />
            <p className="font-medium">Revenue Report</p>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;