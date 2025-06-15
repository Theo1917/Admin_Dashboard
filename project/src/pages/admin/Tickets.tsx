import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  reporter: string;
  createdAt: string;
  updatedAt: string;
  category: string;
}

const tickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Equipment malfunction in Gym A',
    description: 'Treadmill #3 is making unusual noises and needs immediate attention.',
    status: 'open',
    priority: 'high',
    assignee: 'John Smith',
    reporter: 'Sarah Johnson',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    category: 'Equipment'
  },
  {
    id: 'TKT-002',
    title: 'Member complaint about cleanliness',
    description: 'Multiple members have reported cleanliness issues in the locker room.',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Mike Davis',
    reporter: 'Emily Brown',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-15',
    category: 'Facility'
  },
  {
    id: 'TKT-003',
    title: 'Payment system error',
    description: 'Payment processing is failing for new memberships.',
    status: 'urgent',
    priority: 'urgent',
    assignee: 'Tech Team',
    reporter: 'Front Desk',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    category: 'System'
  },
  {
    id: 'TKT-004',
    title: 'AC not working in Yoga studio',
    description: 'Air conditioning system needs repair in the yoga studio.',
    status: 'resolved',
    priority: 'medium',
    assignee: 'Maintenance',
    reporter: 'Lisa Wilson',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-14',
    category: 'HVAC'
  }
];

const AdminTickets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-3xl font-bold text-gray-800">Support Tickets</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Ticket
        </motion.button>
      </motion.div>

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
            placeholder="Search tickets..."
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
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </motion.div>

      {/* Tickets Grid */}
      <div className="grid gap-6">
        {filteredTickets.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{ticket.title}</h3>
                  <span className="text-sm text-gray-500">#{ticket.id}</span>
                </div>
                <p className="text-gray-600 mb-4">{ticket.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    <span className="ml-1 capitalize">{ticket.status.replace('-', ' ')}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {ticket.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Assignee:</span>
                    <p>{ticket.assignee}</p>
                  </div>
                  <div>
                    <span className="font-medium">Reporter:</span>
                    <p>{ticket.reporter}</p>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>
                    <p>{ticket.createdAt}</p>
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span>
                    <p>{ticket.updatedAt}</p>
                  </div>
                </div>
              </div>
              
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminTickets;