import React from 'react';
import { Users, Ticket, UserCheck, Target, CreditCard, TrendingUp, Activity, Clock } from 'lucide-react';
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
            {isPositive ? '+' : ''}{change} from yesterday
          </p>
        )}
      </div>
      <div className="bg-white/20 p-3 rounded-lg">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </motion.div>
);

const FrontDeskDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold text-gray-800">Front Desk Dashboard</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
        >
          Quick Check-in
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Check-ins" 
          value="127" 
          change="8%" 
          isPositive={true}
          icon={UserCheck}
          gradient="from-cyan-500 to-blue-500"
        />
        <StatCard 
          title="Active Tickets" 
          value="12" 
          change="3%" 
          isPositive={false}
          icon={Ticket}
          gradient="from-orange-500 to-red-500"
        />
        <StatCard 
          title="New Leads" 
          value="8" 
          change="25%" 
          isPositive={true}
          icon={Users}
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard 
          title="Renewals Due" 
          value="23" 
          change="5%" 
          isPositive={true}
          icon={CreditCard}
          gradient="from-purple-500 to-indigo-500"
        />
      </div>

      {/* Quick Actions and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Activity</h3>
          <div className="h-80 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Activity className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
              <p className="text-gray-600">Activity chart will be displayed here</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Check-ins</h3>
          <div className="space-y-4">
            {[
              { name: 'John Smith', time: '2 min ago', type: 'member' },
              { name: 'Sarah Johnson', time: '5 min ago', type: 'guest' },
              { name: 'Mike Davis', time: '12 min ago', type: 'member' },
              { name: 'Emily Brown', time: '18 min ago', type: 'member' },
              { name: 'David Wilson', time: '25 min ago', type: 'guest' },
            ].map((checkin, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  checkin.type === 'member' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{checkin.name}</p>
                  <p className="text-xs text-gray-500">{checkin.time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  checkin.type === 'member' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {checkin.type}
                </span>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
          >
            <UserCheck className="h-6 w-6 mb-2" />
            <p className="font-medium">Member Check-in</p>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
          >
            <Users className="h-6 w-6 mb-2" />
            <p className="font-medium">Add Lead</p>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
          >
            <CreditCard className="h-6 w-6 mb-2" />
            <p className="font-medium">Process Renewal</p>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
          >
            <Ticket className="h-6 w-6 mb-2" />
            <p className="font-medium">Create Ticket</p>
          </motion.button>
        </div>
      </motion.div>

      {/* Today's Schedule */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { time: '9:00 AM', event: 'Morning Yoga Class', instructor: 'Sarah Johnson', capacity: '15/20' },
            { time: '11:00 AM', event: 'HIIT Training', instructor: 'Mike Davis', capacity: '18/20' },
            { time: '2:00 PM', event: 'Pilates Session', instructor: 'Emily Brown', capacity: '12/15' },
          ].map((schedule, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{schedule.time}</span>
              </div>
              <h4 className="font-semibold text-gray-800">{schedule.event}</h4>
              <p className="text-sm text-gray-600">Instructor: {schedule.instructor}</p>
              <p className="text-sm text-gray-600">Capacity: {schedule.capacity}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FrontDeskDashboard;