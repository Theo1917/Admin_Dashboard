import React, { useState } from 'react';
import { Search, CreditCard, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface MembershipRenewal {
  id: string;
  memberName: string;
  memberId: string;
  currentPlan: 'basic' | 'premium' | 'elite';
  expiryDate: string;
  daysUntilExpiry: number;
  status: 'expired' | 'expiring-soon' | 'due-soon' | 'renewed';
  lastPayment: string;
  amount: number;
  avatar: string;
}

const renewals: MembershipRenewal[] = [
  {
    id: 'RNW-001',
    memberName: 'John Smith',
    memberId: 'MBR-001',
    currentPlan: 'premium',
    expiryDate: '2024-01-20',
    daysUntilExpiry: 5,
    status: 'expiring-soon',
    lastPayment: '2023-12-20',
    amount: 49.99,
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'RNW-002',
    memberName: 'Sarah Johnson',
    memberId: 'MBR-002',
    currentPlan: 'basic',
    expiryDate: '2024-01-12',
    daysUntilExpiry: -3,
    status: 'expired',
    lastPayment: '2023-12-12',
    amount: 29.99,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'RNW-003',
    memberName: 'Mike Davis',
    memberId: 'MBR-003',
    currentPlan: 'elite',
    expiryDate: '2024-02-05',
    daysUntilExpiry: 21,
    status: 'due-soon',
    lastPayment: '2024-01-05',
    amount: 79.99,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'RNW-004',
    memberName: 'Emily Brown',
    memberId: 'MBR-004',
    currentPlan: 'premium',
    expiryDate: '2024-02-15',
    daysUntilExpiry: 31,
    status: 'renewed',
    lastPayment: '2024-01-15',
    amount: 49.99,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const FrontDeskMembership: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      case 'expiring-soon': return <Clock className="h-4 w-4" />;
      case 'due-soon': return <Calendar className="h-4 w-4" />;
      case 'renewed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-800';
      case 'expiring-soon': return 'bg-orange-100 text-orange-800';
      case 'due-soon': return 'bg-yellow-100 text-yellow-800';
      case 'renewed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'elite': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRenewals = renewals.filter(renewal => {
    const matchesSearch = renewal.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         renewal.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || renewal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const expiredCount = renewals.filter(r => r.status === 'expired').length;
  const expiringSoonCount = renewals.filter(r => r.status === 'expiring-soon').length;
  const dueSoonCount = renewals.filter(r => r.status === 'due-soon').length;
  const renewedCount = renewals.filter(r => r.status === 'renewed').length;

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-3xl font-bold text-gray-800">Membership Renewals</h1>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Expired</p>
              <p className="text-2xl font-bold">{expiredCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-200" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Expiring Soon</p>
              <p className="text-2xl font-bold">{expiringSoonCount}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-200" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Due Soon</p>
              <p className="text-2xl font-bold">{dueSoonCount}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-200" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Renewed</p>
              <p className="text-2xl font-bold">{renewedCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-200" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by member name or ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="expired">Expired</option>
          <option value="expiring-soon">Expiring Soon</option>
          <option value="due-soon">Due Soon</option>
          <option value="renewed">Renewed</option>
        </select>
      </motion.div>

      {/* Renewals List */}
      <div className="space-y-4">
        {filteredRenewals.map((renewal, index) => (
          <motion.div
            key={renewal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={renewal.avatar}
                  alt={renewal.memberName}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{renewal.memberName}</h3>
                  <p className="text-gray-600">{renewal.memberId}</p>
                  <div className="flex space-x-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(renewal.currentPlan)}`}>
                      {renewal.currentPlan.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(renewal.status)}`}>
                      {getStatusIcon(renewal.status)}
                      <span className="ml-1">{renewal.status.replace('-', ' ').toUpperCase()}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">${renewal.amount}</p>
                <p className="text-sm text-gray-600">Monthly</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <span className="text-sm font-medium text-gray-700">Expiry Date:</span>
                <p className="text-sm text-gray-600">{renewal.expiryDate}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Days Until Expiry:</span>
                <p className={`text-sm font-semibold ${
                  renewal.daysUntilExpiry < 0 ? 'text-red-600' :
                  renewal.daysUntilExpiry <= 7 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {renewal.daysUntilExpiry < 0 ? `${Math.abs(renewal.daysUntilExpiry)} days overdue` : `${renewal.daysUntilExpiry} days`}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Last Payment:</span>
                <p className="text-sm text-gray-600">{renewal.lastPayment}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Actions:</span>
                <div className="flex space-x-2 mt-1">
                  {renewal.status !== 'renewed' && (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                    >
                      <CreditCard className="h-3 w-3 inline mr-1" />
                      Renew
                    </motion.button>
                  )}
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    Contact
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FrontDeskMembership;