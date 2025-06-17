import React, { useState } from 'react';
import { Search, Filter, User, Calendar, CreditCard, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: 'basic' | 'premium' | 'elite';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastVisit: string;
  totalVisits: number;
  avatar: string;
}

const customers: Customer[] = [
  {
    id: 'MBR-001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    membershipType: 'premium',
    status: 'active',
    joinDate: '2023-06-15',
    lastVisit: '2024-01-15',
    totalVisits: 127,
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'MBR-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 234-5678',
    membershipType: 'basic',
    status: 'active',
    joinDate: '2023-08-22',
    lastVisit: '2024-01-14',
    totalVisits: 89,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'MBR-003',
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+1 (555) 345-6789',
    membershipType: 'elite',
    status: 'active',
    joinDate: '2023-03-10',
    lastVisit: '2024-01-15',
    totalVisits: 203,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'MBR-004',
    name: 'Emily Brown',
    email: 'emily.brown@email.com',
    phone: '+1 (555) 456-7890',
    membershipType: 'premium',
    status: 'inactive',
    joinDate: '2023-09-05',
    lastVisit: '2024-01-08',
    totalVisits: 45,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const FrontDeskCustomers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'elite': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMembership = membershipFilter === 'all' || customer.membershipType === membershipFilter;
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesMembership && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-3xl font-bold text-gray-800">Present Customers</h1>
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
              <p className="text-cyan-100">Total Members</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
            <User className="h-8 w-8 text-cyan-200" />
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
              <p className="text-green-100">Active Today</p>
              <p className="text-2xl font-bold">127</p>
            </div>
            <Activity className="h-8 w-8 text-green-200" />
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
              <p className="text-purple-100">Premium Members</p>
              <p className="text-2xl font-bold">456</p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-200" />
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
              <p className="text-orange-100">New This Month</p>
              <p className="text-2xl font-bold">34</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-200" />
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
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={membershipFilter}
          onChange={(e) => setMembershipFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
        >
          <option value="all">All Memberships</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="elite">Elite</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </motion.div>

      {/* Customers Grid */}
      <div className="grid gap-6">
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
                  <p className="text-gray-600">{customer.email}</p>
                  <p className="text-gray-600">{customer.phone}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMembershipColor(customer.membershipType)}`}>
                  {customer.membershipType.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                  {customer.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <span className="text-sm font-medium text-gray-700">Member ID:</span>
                <p className="text-sm text-gray-600">{customer.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Join Date:</span>
                <p className="text-sm text-gray-600">{customer.joinDate}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Last Visit:</span>
                <p className="text-sm text-gray-600">{customer.lastVisit}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Total Visits:</span>
                <p className="text-sm text-gray-600">{customer.totalVisits}</p>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm"
              >
                Check In
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                View Profile
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Edit
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FrontDeskCustomers;