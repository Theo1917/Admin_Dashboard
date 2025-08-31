import React, { useState, useEffect } from 'react';
import { Search, Phone, Mail, MapPin, Calendar, TrendingUp, Loader2, BarChart3, Edit, Trash2, UserPlus, Table, Kanban, ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { config } from '../../lib/config';

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'INTERESTED' | 'CONVERTED' | 'LOST';
  interest?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

interface LeadResponse {
  success: boolean;
  data: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface LeadStats {
  total: number;
  today: number;
  yesterday: number;
  thisWeek: number;
  thisMonth: number;
  bySource: Record<string, number>;
  byStatus: Record<string, number>;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: Lead['status'];
  color: string;
  leads: Lead[];
}

const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showAddLead, setShowAddLead] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [stats, setStats] = useState<LeadStats>({
    total: 0,
    today: 0,
    yesterday: 0,
    thisWeek: 0,
    thisMonth: 0,
    bySource: {},
    byStatus: {}
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Kanban columns configuration
  const columns: KanbanColumn[] = [
    { id: 'new', title: 'New Leads', status: 'NEW', color: 'bg-blue-500', leads: [] },
    { id: 'contacted', title: 'Contacted', status: 'CONTACTED', color: 'bg-yellow-500', leads: [] },
    { id: 'interested', title: 'Interested', status: 'INTERESTED', color: 'bg-orange-500', leads: [] },
    { id: 'converted', title: 'Converted', status: 'CONVERTED', color: 'bg-green-500', leads: [] },
    { id: 'lost', title: 'Lost', status: 'LOST', color: 'bg-red-500', leads: [] }
  ];

  // Organize leads into columns
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>(columns);

  useEffect(() => {
    fetchLeads();
    calculateStats();
  }, [dateFilter, customDateRange]);

  // Debug phone numbers on load
  useEffect(() => {
    if (leads.length > 0) {
      console.log('Current leads data:', leads);
      leads.forEach(lead => {
        console.log(`Lead ${lead.id}: phone = ${lead.phone} (type: ${typeof lead.phone})`);
      });
    }
  }, [leads]);

  useEffect(() => {
    organizeLeadsIntoColumns();
  }, [leads, searchTerm, sourceFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: '1',
        limit: '1000', // Get all leads for Kanban view
      });

      // Add date filtering
      if (dateFilter === 'custom' && customDateRange.start && customDateRange.end) {
        params.append('startDate', customDateRange.start);
        params.append('endDate', customDateRange.end);
      } else if (dateFilter !== 'all') {
        const { start, end } = getDateRange(dateFilter);
        params.append('startDate', start);
        params.append('endDate', end);
      }

      const response = await fetch(`${config.api.baseUrl}/api/leads?${params.toString()}`);
      const result: LeadResponse = await response.json();

      if (result.success) {
        setLeads(result.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort leads based on search, source filters, and sorting options
  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (lead.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                           lead.phone.includes(searchTerm);
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      return matchesSearch && matchesSource;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Sort handler
  const handleSort = (column: 'name' | 'createdAt' | 'status') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Sort icon component
  const SortIcon = ({ column }: { column: 'name' | 'createdAt' | 'status' }) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
    }
    return sortOrder === 'asc' ?
      <ArrowUp className="h-3 w-3 text-blue-600" /> :
      <ArrowDown className="h-3 w-3 text-blue-600" />;
  };

  // Export to CSV functionality
  const exportToCSV = () => {
    if (filteredLeads.length === 0) {
      alert('No leads to export');
      return;
    }

    const csvHeaders = [
      'Name',
      'Email',
      'Phone',
      'Source',
      'Status',
      'Interest',
      'Location',
      'Notes',
      'Created Date'
    ];

    const csvRows = filteredLeads.map(lead => [
      lead.name,
      lead.email || '',
      String(lead.phone),
      lead.source,
      lead.status,
      lead.interest || '',
      lead.location || '',
      lead.notes || '',
      formatDate(lead.createdAt)
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const organizeLeadsIntoColumns = () => {
    const updatedColumns = columns.map(column => ({
      ...column,
      leads: filteredLeads.filter(lead => lead.status === column.status)
    }));

    setKanbanColumns(updatedColumns);
  };

  const calculateStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newStats: LeadStats = {
      total: leads.length,
      today: leads.filter(lead => new Date(lead.createdAt) >= today).length,
      yesterday: leads.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        return leadDate >= yesterday && leadDate < today;
      }).length,
      thisWeek: leads.filter(lead => new Date(lead.createdAt) >= thisWeek).length,
      thisMonth: leads.filter(lead => new Date(lead.createdAt) >= thisMonth).length,
      bySource: {},
      byStatus: {}
    };

    // Calculate by source and status
    leads.forEach(lead => {
      newStats.bySource[lead.source] = (newStats.bySource[lead.source] || 0) + 1;
      newStats.byStatus[lead.status] = (newStats.byStatus[lead.status] || 0) + 1;
    });

    setStats(newStats);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeLead = leads.find(lead => lead.id === active.id);
    const targetColumn = kanbanColumns.find(col => col.id === over.id);

    if (activeLead && targetColumn) {
      const newStatus = targetColumn.status;

      try {
        console.log('Updating lead status:', activeLead.id, 'to', newStatus);
        console.log('Lead data:', activeLead);

        // Update lead status in backend
        await updateLeadStatus(activeLead.id, newStatus);

        // Update local state
        setLeads(prev => prev.map(lead =>
          lead.id === activeLead.id ? { ...lead, status: newStatus } : lead
        ));

        console.log('Lead status updated successfully');
      } catch (error) {
        console.error('Error updating lead status:', error);
      }
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      console.log('Making API call to:', `${config.api.baseUrl}/api/leads/${leadId}/status`);
      console.log('Request payload:', { status: newStatus });

      const response = await fetch(`${config.api.baseUrl}/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to update lead status: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('API response:', result);
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`${config.api.baseUrl}/api/leads/${leadId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLeads(prev => prev.filter(lead => lead.id !== leadId));
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const getDateRange = (filter: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
          switch (filter) {
        case 'today': {
          return { start: today.toISOString(), end: now.toISOString() };
        }
        case 'yesterday': {
          const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
          return { start: yesterday.toISOString(), end: today.toISOString() };
        }
        case 'thisWeek': {
          const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
          return { start: weekStart.toISOString(), end: now.toISOString() };
        }
        case 'thisMonth': {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          return { start: monthStart.toISOString(), end: now.toISOString() };
        }
        case 'last7Days': {
          const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return { start: sevenDaysAgo.toISOString(), end: now.toISOString() };
        }
        case 'last30Days': {
          const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return { start: thirtyDaysAgo.toISOString(), end: now.toISOString() };
        }
        default:
          return { start: '', end: '' };
      }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'callback-form': 'bg-blue-100 text-blue-800',
      'website': 'bg-green-100 text-green-800',
      'social-media': 'bg-purple-100 text-purple-800',
      'referral': 'bg-orange-100 text-orange-800',
      'walk-in': 'bg-gray-100 text-gray-800'
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading leads...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-2">
            {viewMode === 'kanban' ? 'Manage and track your leads in a Kanban board' : 'Excel-like table view for detailed lead management'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Kanban className="h-4 w-4" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table className="h-4 w-4" />
              Table
            </button>
          </div>
          <button
            onClick={() => setShowAddLead(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-lg shadow border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-lg shadow border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-lg shadow border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-4 rounded-lg shadow border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.byStatus.CONVERTED || 0}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-lg shadow border border-gray-200"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search leads by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Sources</option>
            <option value="callback-form">Callback Form</option>
            <option value="website">Website</option>
            <option value="social-media">Social Media</option>
            <option value="referral">Referral</option>
            <option value="walk-in">Walk-in</option>
          </select>
          
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="last7Days">Last 7 Days</option>
              <option value="last30Days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Export Button - Only show in table view */}
          {viewMode === 'table' && filteredLeads.length > 0 && (
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>

        {/* Custom Date Range Picker */}
        {dateFilter === 'custom' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 flex gap-4 items-end"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Content based on view mode */}
      {viewMode === 'kanban' ? (
        /* Kanban Board */
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {kanbanColumns.map((column) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-50 rounded-lg p-4 min-h-[600px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                    <h3 className="font-semibold text-gray-800">{column.title}</h3>
                    <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
                      {column.leads.length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <SortableContext
                  items={column.leads.map(lead => lead.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    <AnimatePresence>
                      {column.leads.map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          onDelete={deleteLead}
                          onEdit={setEditingLead}
                        />
                      ))}
                    </AnimatePresence>

                    {column.leads.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No leads</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </motion.div>
            ))}
          </div>
        </DndContext>
      ) : (
        /* Excel-like Table View */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Lead Details
                      <SortIcon column="name" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <SortIcon column="status" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-2">
                      Created
                      <SortIcon column="createdAt" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {leads.length === 0
                        ? "No leads found. Try adjusting your filters or add a new lead."
                        : "No leads match your current filters. Try adjusting your search criteria."}
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{lead.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{lead.interest || 'General inquiry'}</div>
                          {lead.notes && (
                            <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                              {lead.notes}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {lead.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="truncate max-w-xs">{lead.email}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span>{String(lead.phone)}</span>
                          </div>
                          {lead.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="truncate max-w-xs">{lead.location}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                          className="text-sm px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="INTERESTED">Interested</option>
                          <option value="CONVERTED">Converted</option>
                          <option value="LOST">Lost</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
                          {lead.source.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingLead(lead)}
                            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Lead"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Summary */}
          {filteredLeads.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span>Total: <span className="font-medium">{leads.length}</span> leads</span>
                  <span>Filtered: <span className="font-medium">{filteredLeads.length}</span> leads</span>
                  {(searchTerm || sourceFilter !== 'all') && (
                    <span className="text-blue-600">
                      Showing {filteredLeads.length} of {leads.length} leads
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {Object.entries(stats.byStatus).map(([status, count]) => (
                    <span key={status} className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${
                        status === 'NEW' ? 'bg-blue-500' :
                        status === 'CONTACTED' ? 'bg-yellow-500' :
                        status === 'INTERESTED' ? 'bg-orange-500' :
                        status === 'CONVERTED' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}></span>
                      {status}: <span className="font-medium">{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Add/Edit Lead Modal would go here */}
      {/* For now, just a placeholder */}
    </div>
  );
};

// Lead Card Component
interface LeadCardProps {
  lead: Lead;
  onDelete: (id: string) => void;
  onEdit: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onDelete, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="space-y-3">
        {/* Lead Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm">{lead.name}</h4>
            <p className="text-xs text-gray-500">{lead.interest || 'General inquiry'}</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(lead);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(lead.id);
              }}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Lead Details */}
        <div className="space-y-2">
          {lead.email && (
            <div className="flex items-center gap-2 text-xs">
              <Mail className="h-3 w-3 text-gray-400" />
              <span className="text-gray-600 truncate">{lead.email}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs">
            <Phone className="h-3 w-3 text-gray-400" />
            <span className="text-gray-600">{String(lead.phone)}</span>
          </div>
          
          {lead.location && (
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="h-3 w-3 text-gray-400" />
              <span className="text-gray-600 truncate">{lead.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span className="text-gray-600">{formatDate(lead.createdAt)}</span>
          </div>
        </div>

        {/* Source Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
            {lead.source.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        {/* Notes Preview */}
        {lead.notes && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600 line-clamp-2">{lead.notes}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getSourceColor = (source: string) => {
  const colors: Record<string, string> = {
    'callback-form': 'bg-blue-100 text-blue-800',
    'website': 'bg-green-100 text-green-800',
    'social-media': 'bg-purple-100 text-purple-800',
    'referral': 'bg-orange-100 text-orange-800',
    'walk-in': 'bg-gray-100 text-gray-800'
  };
  return colors[source] || 'bg-gray-100 text-gray-800';
};

export default AdminLeads;