import React, { useState } from 'react';
import { Search, Plus, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'walk-in' | 'phone' | 'website' | 'referral';
  interest: string;
  status: 'new' | 'contacted' | 'scheduled' | 'converted';
  createdAt: string;
  notes: string;
}

const leads: Lead[] = [
  {
    id: 'LD-001',
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@email.com',
    phone: '+1 (555) 123-4567',
    source: 'walk-in',
    interest: 'Weight Loss Program',
    status: 'new',
    createdAt: '2024-01-15',
    notes: 'Interested in personal training sessions'
  },
  {
    id: 'LD-002',
    name: 'Robert Taylor',
    email: 'robert.taylor@email.com',
    phone: '+1 (555) 234-5678',
    source: 'phone',
    interest: 'Group Classes',
    status: 'contacted',
    createdAt: '2024-01-15',
    notes: 'Prefers evening classes, works full-time'
  },
  {
    id: 'LD-003',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    phone: '+1 (555) 345-6789',
    source: 'referral',
    interest: 'Basic Membership',
    status: 'scheduled',
    createdAt: '2024-01-14',
    notes: 'Referred by existing member Sarah Johnson'
  }
];

const FrontDeskLeads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'walk-in': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'website': return 'bg-purple-100 text-purple-800';
      case 'referral': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-3xl font-bold text-gray-800">Lead Management</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Lead
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
              <p className="text-cyan-100">Total Leads</p>
              <p className="text-2xl font-bold">47</p>
            </div>
            <Phone className="h-8 w-8 text-cyan-200" />
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
              <p className="text-green-100">Contacted</p>
              <p className="text-2xl font-bold">23</p>
            </div>
            <Mail className="h-8 w-8 text-green-200" />
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
              <p className="text-purple-100">Scheduled</p>
              <p className="text-2xl font-bold">12</p>
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
              <p className="text-orange-100">Converted</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <MapPin className="h-8 w-8 text-orange-200" />
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
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
        >
          <option value="all">All Sources</option>
          <option value="walk-in">Walk-in</option>
          <option value="phone">Phone</option>
          <option value="website">Website</option>
          <option value="referral">Referral</option>
        </select>
      </motion.div>

      {/* Leads Grid */}
      <div className="grid gap-6">
        {filteredLeads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{lead.name}</h3>
                <p className="text-gray-600">{lead.interest}</p>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
                  {lead.source.replace('-', ' ').toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                  {lead.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{lead.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{lead.phone}</span>
              </div>
            </div>

            <div className="mb-4 text-sm text-gray-600">
              <span className="font-medium">Created:</span> {lead.createdAt}
            </div>

            <div className="mb-4">
              <span className="font-medium text-gray-700">Notes:</span>
              <p className="text-gray-600 text-sm mt-1">{lead.notes}</p>
            </div>

            <div className="flex space-x-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm"
              >
                <Phone className="h-4 w-4 inline mr-2" />
                Call
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Mail className="h-4 w-4 inline mr-2" />
                Email
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

export default FrontDeskLeads;