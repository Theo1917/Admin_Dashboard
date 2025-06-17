import React, { useState } from 'react';
import { Search, Plus, MapPin, Users, Calendar, Settings, TrendingUp, Building } from 'lucide-react';
import { motion } from 'framer-motion';

interface Gym {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  manager: string;
  capacity: number;
  currentMembers: number;
  status: 'active' | 'maintenance' | 'closed';
  openingHours: string;
  facilities: string[];
  revenue: number;
  image: string;
}

const gyms: Gym[] = [
  {
    id: 'GYM-001',
    name: 'FitFlix Downtown',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '+1 (555) 123-4567',
    email: 'downtown@fitflix.com',
    manager: 'Sarah Johnson',
    capacity: 500,
    currentMembers: 423,
    status: 'active',
    openingHours: '5:00 AM - 11:00 PM',
    facilities: ['Cardio Equipment', 'Weight Training', 'Group Classes', 'Swimming Pool', 'Sauna'],
    revenue: 45000,
    image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'GYM-002',
    name: 'FitFlix Uptown',
    address: '456 Broadway',
    city: 'New York',
    state: 'NY',
    zipCode: '10025',
    phone: '+1 (555) 234-5678',
    email: 'uptown@fitflix.com',
    manager: 'Mike Davis',
    capacity: 350,
    currentMembers: 298,
    status: 'active',
    openingHours: '6:00 AM - 10:00 PM',
    facilities: ['Cardio Equipment', 'Weight Training', 'Group Classes', 'Yoga Studio'],
    revenue: 32000,
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'GYM-003',
    name: 'FitFlix Midtown',
    address: '789 Park Avenue',
    city: 'New York',
    state: 'NY',
    zipCode: '10016',
    phone: '+1 (555) 345-6789',
    email: 'midtown@fitflix.com',
    manager: 'Emily Brown',
    capacity: 600,
    currentMembers: 567,
    status: 'maintenance',
    openingHours: '5:30 AM - 11:30 PM',
    facilities: ['Cardio Equipment', 'Weight Training', 'Group Classes', 'Swimming Pool', 'Basketball Court'],
    revenue: 52000,
    image: 'https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const AdminGymManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const filteredGyms = gyms.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gym.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || gym.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-3xl font-bold text-gray-800">Gym Management</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Gym
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Gyms</p>
              <p className="text-2xl font-bold">{gyms.length}</p>
            </div>
            <Building className="h-8 w-8 text-blue-200" />
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
              <p className="text-green-100">Active Gyms</p>
              <p className="text-2xl font-bold">{gyms.filter(g => g.status === 'active').length}</p>
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
              <p className="text-purple-100">Total Members</p>
              <p className="text-2xl font-bold">{gyms.reduce((sum, gym) => sum + gym.currentMembers, 0)}</p>
            </div>
            <Users className="h-8 w-8 text-purple-200" />
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
              <p className="text-orange-100">Total Revenue</p>
              <p className="text-2xl font-bold">${gyms.reduce((sum, gym) => sum + gym.revenue, 0).toLocaleString()}</p>
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
            placeholder="Search gyms..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="closed">Closed</option>
        </select>
      </motion.div>

      {/* Gyms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGyms.map((gym, index) => (
          <motion.div
            key={gym.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
          >
            <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${gym.image})` }}>
              <div className="h-full bg-black bg-opacity-40 flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{gym.name}</h3>
                  <p className="text-white/80">{gym.city}, {gym.state}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(gym.status)}`}>
                  {gym.status.charAt(0).toUpperCase() + gym.status.slice(1)}
                </span>
                <span className="text-sm text-gray-600">Manager: {gym.manager}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="text-lg font-semibold">{gym.capacity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Members</p>
                  <p className="text-lg font-semibold">{gym.currentMembers}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Occupancy</span>
                  <span>{getOccupancyPercentage(gym.currentMembers, gym.capacity)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getOccupancyPercentage(gym.currentMembers, gym.capacity)}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Facilities:</p>
                <div className="flex flex-wrap gap-1">
                  {gym.facilities.map((facility, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium">Hours:</p>
                  <p>{gym.openingHours}</p>
                </div>
                <div>
                  <p className="font-medium">Monthly Revenue:</p>
                  <p className="text-green-600 font-semibold">${gym.revenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Settings className="h-4 w-4 inline mr-2" />
                  Manage
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  <MapPin className="h-4 w-4 inline mr-2" />
                  View Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminGymManagement;