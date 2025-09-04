import React, { useState, useEffect } from 'react';
import { Users, FileText, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { leadApi } from '../services/leads';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  scheduledBlogs: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    scheduledBlogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch leads data
        const leadsResponse = await leadApi.getAll();
        const totalLeads = leadsResponse.data?.length || 0;
        const newLeads = leadsResponse.data?.filter((lead: any) => lead.status === 'NEW').length || 0;

        // Fetch blogs data
        const blogsResponse = await apiClient.getAllBlogs();
        const totalBlogs = blogsResponse.blogs?.length || 0;
        const publishedBlogs = blogsResponse.blogs?.filter((blog: any) => blog.status === 'PUBLISHED').length || 0;
        const draftBlogs = blogsResponse.blogs?.filter((blog: any) => blog.status === 'DRAFT').length || 0;
        const scheduledBlogs = blogsResponse.blogs?.filter((blog: any) => blog.status === 'SCHEDULED').length || 0;

        setStats({
          totalLeads,
          newLeads,
          totalBlogs,
          publishedBlogs,
          draftBlogs,
          scheduledBlogs,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const id = setInterval(fetchStats, 15000);
    return () => clearInterval(id);
  }, []);

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      color: 'bg-blue-500',
      description: 'All leads in the system',
    },
    {
      title: 'New Leads',
      value: stats.newLeads,
      icon: TrendingUp,
      color: 'bg-green-500',
      description: 'Leads requiring attention',
    },
    {
      title: 'Total Blogs',
      value: stats.totalBlogs,
      icon: FileText,
      color: 'bg-purple-500',
      description: 'All blog posts',
    },
    {
      title: 'Published Blogs',
      value: stats.publishedBlogs,
      icon: FileText,
      color: 'bg-emerald-500',
      description: 'Live blog posts',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your leads and blog performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Blog Status Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Blog Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.publishedBlogs}</div>
            <div className="text-sm text-blue-600">Published</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.draftBlogs}</div>
            <div className="text-sm text-yellow-600">Drafts</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.scheduledBlogs}</div>
            <div className="text-sm text-purple-600">Scheduled</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => navigate('/leads')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <Users className="h-4 w-4 mr-2" />
            View All Leads
          </button>
          <button 
            onClick={() => navigate('/blogs')}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            Manage Blogs
          </button>
          <button 
            onClick={() => navigate('/blogs')}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
          >
            <Clock className="h-4 w-4 mr-2" />
            Schedule Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;