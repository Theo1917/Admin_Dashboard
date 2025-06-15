import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface RevenueData {
  period: string;
  totalRevenue: number;
  membershipRevenue: number;
  personalTrainingRevenue: number;
  merchandiseRevenue: number;
  otherRevenue: number;
  growth: number;
}

const revenueData: RevenueData[] = [
  {
    period: 'January 2024',
    totalRevenue: 125000,
    membershipRevenue: 85000,
    personalTrainingRevenue: 25000,
    merchandiseRevenue: 10000,
    otherRevenue: 5000,
    growth: 12.5
  },
  {
    period: 'December 2023',
    totalRevenue: 118000,
    membershipRevenue: 82000,
    personalTrainingRevenue: 22000,
    merchandiseRevenue: 9000,
    otherRevenue: 5000,
    growth: 8.3
  },
  {
    period: 'November 2023',
    totalRevenue: 112000,
    membershipRevenue: 78000,
    personalTrainingRevenue: 20000,
    merchandiseRevenue: 9000,
    otherRevenue: 5000,
    growth: 5.2
  }
];

const gymRevenueBreakdown = [
  { name: 'FitFlix Downtown', revenue: 45000, percentage: 36, growth: 15.2 },
  { name: 'FitFlix Uptown', revenue: 32000, percentage: 26, growth: 8.7 },
  { name: 'FitFlix Midtown', revenue: 48000, percentage: 38, growth: 12.1 }
];

const AdminRevenue: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('January 2024');
  const [viewType, setViewType] = useState('monthly');

  const currentData = revenueData.find(data => data.period === selectedPeriod) || revenueData[0];

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-3xl font-bold text-gray-800">Revenue Analytics</h1>
        <div className="flex space-x-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-all duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Generate Report
          </motion.button>
        </div>
      </motion.div>

      {/* Period Selector */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {revenueData.map(data => (
            <option key={data.period} value={data.period}>{data.period}</option>
          ))}
        </select>
        <select
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="monthly">Monthly View</option>
          <option value="quarterly">Quarterly View</option>
          <option value="yearly">Yearly View</option>
        </select>
      </motion.div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Revenue</p>
              <p className="text-2xl font-bold">${currentData.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-blue-200 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +{currentData.growth}% from last month
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Membership Revenue</p>
              <p className="text-2xl font-bold">${currentData.membershipRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-200">
                {Math.round((currentData.membershipRevenue / currentData.totalRevenue) * 100)}% of total
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Personal Training</p>
              <p className="text-2xl font-bold">${currentData.personalTrainingRevenue.toLocaleString()}</p>
              <p className="text-sm text-purple-200">
                {Math.round((currentData.personalTrainingRevenue / currentData.totalRevenue) * 100)}% of total
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-200" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Other Revenue</p>
              <p className="text-2xl font-bold">${(currentData.merchandiseRevenue + currentData.otherRevenue).toLocaleString()}</p>
              <p className="text-sm text-orange-200">
                {Math.round(((currentData.merchandiseRevenue + currentData.otherRevenue) / currentData.totalRevenue) * 100)}% of total
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trends</h3>
        <div className="h-80 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-600">Revenue trend chart will be displayed here</p>
          </div>
        </div>
      </motion.div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Category</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Memberships</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(currentData.membershipRevenue / currentData.totalRevenue) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">${currentData.membershipRevenue.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Personal Training</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(currentData.personalTrainingRevenue / currentData.totalRevenue) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">${currentData.personalTrainingRevenue.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Merchandise</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(currentData.merchandiseRevenue / currentData.totalRevenue) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">${currentData.merchandiseRevenue.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Other</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: `${(currentData.otherRevenue / currentData.totalRevenue) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">${currentData.otherRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue by Gym Location */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Location</h3>
          <div className="space-y-4">
            {gymRevenueBreakdown.map((gym, index) => (
              <div key={gym.name} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{gym.name}</span>
                  <span className="text-sm font-medium">${gym.revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${gym.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{gym.percentage}%</span>
                  </div>
                  <span className={`text-sm flex items-center ${gym.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {gym.growth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {gym.growth > 0 ? '+' : ''}{gym.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminRevenue;