import React, { useState } from 'react';
import { Target, TrendingUp, Calendar, Award, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TargetData {
  id: string;
  title: string;
  current: number;
  target: number;
  period: 'monthly' | 'quarterly';
  category: 'checkins' | 'leads' | 'renewals' | 'revenue';
  deadline: string;
}

const targets: TargetData[] = [
  {
    id: 'TGT-001',
    title: 'Monthly Check-ins',
    current: 2847,
    target: 3000,
    period: 'monthly',
    category: 'checkins',
    deadline: '2024-01-31'
  },
  {
    id: 'TGT-002',
    title: 'New Leads',
    current: 47,
    target: 60,
    period: 'monthly',
    category: 'leads',
    deadline: '2024-01-31'
  },
  {
    id: 'TGT-003',
    title: 'Membership Renewals',
    current: 89,
    target: 100,
    period: 'monthly',
    category: 'renewals',
    deadline: '2024-01-31'
  },
  {
    id: 'TGT-004',
    title: 'Quarterly Revenue',
    current: 125000,
    target: 150000,
    period: 'quarterly',
    category: 'revenue',
    deadline: '2024-03-31'
  }
];

const FrontDeskTargets: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'checkins': return <BarChart3 className="h-6 w-6" />;
      case 'leads': return <TrendingUp className="h-6 w-6" />;
      case 'renewals': return <Award className="h-6 w-6" />;
      case 'revenue': return <Target className="h-6 w-6" />;
      default: return <Target className="h-6 w-6" />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'checkins': return 'from-cyan-500 to-blue-500';
      case 'leads': return 'from-green-500 to-emerald-500';
      case 'renewals': return 'from-purple-500 to-indigo-500';
      case 'revenue': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredTargets = targets.filter(target => 
    selectedPeriod === 'all' || target.period === selectedPeriod
  );

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-3xl font-bold text-gray-800">Targets & Goals</h1>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
        >
          <option value="all">All Periods</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTargets.map((target, index) => {
          const percentage = getProgressPercentage(target.current, target.target);
          return (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${getCategoryGradient(target.category)} p-6 rounded-xl text-white`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  {getCategoryIcon(target.category)}
                </div>
                <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
                  {target.period.toUpperCase()}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{target.title}</h3>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Current: {target.category === 'revenue' ? `$${target.current.toLocaleString()}` : target.current}</span>
                <span>Target: {target.category === 'revenue' ? `$${target.target.toLocaleString()}` : target.target}</span>
              </div>
              
              <div className="mt-2 text-xs opacity-80">
                Deadline: {target.deadline}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Progress */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Detailed Progress</h3>
        
        <div className="space-y-6">
          {filteredTargets.map((target, index) => {
            const percentage = getProgressPercentage(target.current, target.target);
            const remaining = target.target - target.current;
            
            return (
              <motion.div
                key={target.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`bg-gradient-to-br ${getCategoryGradient(target.category)} p-2 rounded-lg text-white`}>
                      {getCategoryIcon(target.category)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{target.title}</h4>
                      <p className="text-sm text-gray-600">{target.period} target</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{percentage}%</p>
                    <p className="text-sm text-gray-600">Complete</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Current:</span>
                    <p className="font-semibold">
                      {target.category === 'revenue' ? `$${target.current.toLocaleString()}` : target.current}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Target:</span>
                    <p className="font-semibold">
                      {target.category === 'revenue' ? `$${target.target.toLocaleString()}` : target.target}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Remaining:</span>
                    <p className="font-semibold">
                      {target.category === 'revenue' ? `$${remaining.toLocaleString()}` : remaining}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Deadline: {target.deadline}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    percentage >= 90 ? 'bg-green-100 text-green-800' :
                    percentage >= 70 ? 'bg-blue-100 text-blue-800' :
                    percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {percentage >= 90 ? 'Excellent' :
                     percentage >= 70 ? 'Good' :
                     percentage >= 50 ? 'Fair' : 'Needs Attention'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Performance Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-800">Targets on Track</h4>
            <p className="text-2xl font-bold text-green-600">
              {filteredTargets.filter(t => getProgressPercentage(t.current, t.target) >= 70).length}
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Target className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-gray-800">Needs Attention</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {filteredTargets.filter(t => {
                const p = getProgressPercentage(t.current, t.target);
                return p >= 50 && p < 70;
              }).length}
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
            <h4 className="font-semibold text-gray-800">Behind Target</h4>
            <p className="text-2xl font-bold text-red-600">
              {filteredTargets.filter(t => getProgressPercentage(t.current, t.target) < 50).length}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FrontDeskTargets;