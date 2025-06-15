import React from 'react';
import { Users, Calendar, Dumbbell, TrendingUp, DollarSign, Activity } from 'lucide-react';
import StatCard from '../components/StatCard';
import ActivityChart from '../components/ActivityChart';
import RecentActivities from '../components/RecentActivities';
import UpcomingClasses from '../components/UpcomingClasses';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Members" 
          value="1,248" 
          change="12%" 
          isPositive={true}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatCard 
          title="Active Classes" 
          value="42" 
          change="8%" 
          isPositive={true}
          icon={Calendar}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatCard 
          title="Trainers" 
          value="18" 
          change="2" 
          isPositive={true}
          icon={Dumbbell}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
        <StatCard 
          title="Revenue" 
          value="$24,500" 
          change="18%" 
          isPositive={true}
          icon={DollarSign}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart title="Gym Attendance" />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>

      {/* Additional Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Membership Growth</h3>
          <div className="h-80">
            <ActivityChart title="" />
          </div>
        </div>
        <div>
          <UpcomingClasses />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;