import React, { useState } from 'react';
import { Search, UserCheck, Clock, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface CheckIn {
  id: string;
  memberName: string;
  memberId: string;
  checkInTime: string;
  checkOutTime?: string;
  duration?: string;
  membershipType: 'basic' | 'premium' | 'elite';
  avatar: string;
}

const checkIns: CheckIn[] = [
  {
    id: 'CHK-001',
    memberName: 'John Smith',
    memberId: 'MBR-001',
    checkInTime: '2024-01-15 08:30',
    checkOutTime: '2024-01-15 10:15',
    duration: '1h 45m',
    membershipType: 'premium',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'CHK-002',
    memberName: 'Sarah Johnson',
    memberId: 'MBR-002',
    checkInTime: '2024-01-15 09:15',
    membershipType: 'basic',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'CHK-003',
    memberName: 'Mike Davis',
    memberId: 'MBR-003',
    checkInTime: '2024-01-15 07:45',
    checkOutTime: '2024-01-15 09:30',
    duration: '1h 45m',
    membershipType: 'elite',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'CHK-004',
    memberName: 'Emily Brown',
    memberId: 'MBR-004',
    checkInTime: '2024-01-15 10:00',
    membershipType: 'premium',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const FrontDeskCheckIns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'elite': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCheckIns = checkIns.filter(checkIn => {
    const matchesSearch = checkIn.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checkIn.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'active' && !checkIn.checkOutTime) ||
                         (filterType === 'completed' && checkIn.checkOutTime);
    return matchesSearch && matchesFilter;
  });

  const activeCheckIns = checkIns.filter(c => !c.checkOutTime).length;
  const completedCheckIns = checkIns.filter(c => c.checkOutTime).length;

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-3xl font-bold text-gray-800">Member Check-ins</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
        >
          <UserCheck className="h-5 w-5 mr-2" />
          Quick Check-in
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-cyan-500 to-blue-500 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100">Today's Check-ins</p>
              <p className="text-2xl font-bold">{checkIns.length}</p>
            </div>
            <UserCheck className="h-8 w-8 text-cyan-200" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Currently Active</p>
              <p className="text-2xl font-bold">{activeCheckIns}</p>
            </div>
            <Clock className="h-8 w-8 text-green-200" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-indigo-500 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Completed</p>
              <p className="text-2xl font-bold">{completedCheckIns}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-200" />
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
              <p className="text-orange-100">Peak Hours</p>
              <p className="text-2xl font-bold">9-11 AM</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-200" />
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
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
        >
          <option value="all">All Check-ins</option>
          <option value="active">Currently Active</option>
          <option value="completed">Completed</option>
        </select>
      </motion.div>

      {/* Check-ins List */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-out Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCheckIns.map((checkIn, index) => (
                <motion.tr 
                  key={checkIn.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={checkIn.avatar} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{checkIn.memberName}</div>
                        <div className="text-sm text-gray-500">{checkIn.memberId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {checkIn.checkInTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {checkIn.checkOutTime || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {checkIn.duration || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMembershipColor(checkIn.membershipType)}`}>
                        {checkIn.membershipType.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        checkIn.checkOutTime ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {checkIn.checkOutTime ? 'COMPLETED' : 'ACTIVE'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!checkIn.checkOutTime && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-cyan-600 hover:text-cyan-900 transition-colors"
                      >
                        Check Out
                      </motion.button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FrontDeskCheckIns;