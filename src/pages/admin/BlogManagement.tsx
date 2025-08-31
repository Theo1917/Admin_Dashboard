import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  FileText,
  Search,
  Filter,
  Upload,
  FileJson
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { blogApi, Blog, CreateBlogData } from '@/services/api';
import BlogStatusManager from '@/components/BlogStatusManager';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  scheduledPublishAt: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

interface FormErrors {
  title?: string;
  content?: string;
  slug?: string;
}

// JSON Import Component
const JsonImportZone = ({ onImport }: { onImport: (blogs: CreateBlogData[]) => void }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setIsProcessing(true);

    try {
      const files = Array.from(e.dataTransfer.files);
      const jsonFiles = files.filter(file => file.type === 'application/json' || file.name.endsWith('.json'));

      if (jsonFiles.length === 0) {
        toast.error('Please drop a JSON file');
        setIsProcessing(false);
        return;
      }

      const file = jsonFiles[0];
      const text = await file.text();
      const data = JSON.parse(text);

      // Handle different JSON formats
      let blogs: CreateBlogData[] = [];

      if (Array.isArray(data)) {
        // If it's an array of blogs
        blogs = data.map(blog => ({
          title: blog.title || 'Untitled Blog',
          slug: blog.slug || blog.title?.toLowerCase().replace(/\s+/g, '-') || 'untitled-blog',
          excerpt: blog.excerpt || blog.content?.substring(0, 160) || '',
          content: blog.content || '# Untitled Blog\n\nNo content provided.',
          coverImage: blog.coverImage || blog.image || '',
          status: (blog.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') || 'DRAFT',
          metaTitle: blog.metaTitle || blog.title || 'Untitled Blog',
          metaDescription: blog.metaDescription || blog.excerpt || blog.content?.substring(0, 160) || '',
          metaKeywords: blog.metaKeywords || blog.keywords || blog.tags?.join(', ') || ''
        }));
      } else if (data.blogs && Array.isArray(data.blogs)) {
        // If it's an object with a blogs array
        blogs = data.blogs.map(blog => ({
          title: blog.title || 'Untitled Blog',
          slug: blog.slug || blog.title?.toLowerCase().replace(/\s+/g, '-') || 'untitled-blog',
          excerpt: blog.excerpt || blog.content?.substring(0, 160) || '',
          content: blog.content || '# Untitled Blog\n\nNo content provided.',
          coverImage: blog.coverImage || blog.image || '',
          status: (blog.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') || 'DRAFT',
          metaTitle: blog.metaTitle || blog.title || 'Untitled Blog',
          metaDescription: blog.metaDescription || blog.excerpt || blog.content?.substring(0, 160) || '',
          metaKeywords: blog.metaKeywords || blog.keywords || blog.tags?.join(', ') || ''
        }));
      } else if (data.title || data.content) {
        // If it's a single blog object
        blogs = [{
          title: data.title || 'Untitled Blog',
          slug: data.slug || data.title?.toLowerCase().replace(/\s+/g, '-') || 'untitled-blog',
          excerpt: data.excerpt || data.content?.substring(0, 160) || '',
          content: data.content || '# Untitled Blog\n\nNo content provided.',
          coverImage: data.coverImage || data.image || '',
          status: (data.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') || 'DRAFT',
          metaTitle: data.metaTitle || data.title || 'Untitled Blog',
          metaDescription: data.metaDescription || data.excerpt || data.content?.substring(0, 160) || '',
          metaKeywords: data.metaKeywords || data.keywords || data.tags?.join(', ') || ''
        }];
      } else {
        throw new Error('Invalid JSON format. Expected an array of blogs or a single blog object.');
      }

      if (blogs.length > 0) {
        onImport(blogs);
        toast.success(`Successfully imported ${blogs.length} blog${blogs.length > 1 ? 's' : ''}`);
      } else {
        toast.error('No valid blog data found in the JSON file');
      }
    } catch (error) {
      console.error('JSON import error:', error);
      toast.error('Failed to import JSON file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please select a JSON file');
      return;
    }

    setIsProcessing(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Use the same processing logic as drop
      let blogs: CreateBlogData[] = [];

      if (Array.isArray(data)) {
        blogs = data.map(blog => ({
          title: blog.title || 'Untitled Blog',
          slug: blog.slug || blog.title?.toLowerCase().replace(/\s+/g, '-') || 'untitled-blog',
          excerpt: blog.excerpt || blog.content?.substring(0, 160) || '',
          content: blog.content || '# Untitled Blog\n\nNo content provided.',
          coverImage: blog.coverImage || blog.image || '',
          status: (blog.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') || 'DRAFT',
          metaTitle: blog.metaTitle || blog.title || 'Untitled Blog',
          metaDescription: blog.metaDescription || blog.excerpt || blog.content?.substring(0, 160) || '',
          metaKeywords: blog.metaKeywords || blog.keywords || blog.tags?.join(', ') || ''
        }));
      } else if (data.blogs && Array.isArray(data.blogs)) {
        blogs = data.blogs.map(blog => ({
          title: blog.title || 'Untitled Blog',
          slug: blog.slug || blog.title?.toLowerCase().replace(/\s+/g, '-') || 'untitled-blog',
          excerpt: blog.excerpt || blog.content?.substring(0, 160) || '',
          content: blog.content || '# Untitled Blog\n\nNo content provided.',
          coverImage: blog.coverImage || blog.image || '',
          status: (blog.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') || 'DRAFT',
          metaTitle: blog.metaTitle || blog.title || 'Untitled Blog',
          metaDescription: blog.metaDescription || blog.excerpt || blog.content?.substring(0, 160) || '',
          metaKeywords: blog.metaKeywords || blog.keywords || blog.tags?.join(', ') || ''
        }));
      } else if (data.title || data.content) {
        blogs = [{
          title: data.title || 'Untitled Blog',
          slug: data.slug || data.title?.toLowerCase().replace(/\s+/g, '-') || 'untitled-blog',
          excerpt: data.excerpt || data.content?.substring(0, 160) || '',
          content: data.content || '# Untitled Blog\n\nNo content provided.',
          coverImage: data.coverImage || data.image || '',
          status: (data.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') || 'DRAFT',
          metaTitle: data.metaTitle || data.title || 'Untitled Blog',
          metaDescription: data.metaDescription || data.excerpt || data.content?.substring(0, 160) || '',
          metaKeywords: data.metaKeywords || data.keywords || data.tags?.join(', ') || ''
        }];
      }

      if (blogs.length > 0) {
        onImport(blogs);
        toast.success(`Successfully imported ${blogs.length} blog${blogs.length > 1 ? 's' : ''}`);
      } else {
        toast.error('No valid blog data found in the JSON file');
      }
    } catch (error) {
      console.error('JSON import error:', error);
      toast.error('Failed to import JSON file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FileJson className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">
            {isProcessing ? 'Processing...' : 'Drop JSON file here'}
          </h3>
          <p className="text-sm text-gray-500">
            {isProcessing 
              ? 'Please wait while we process your file...'
              : 'Drag and drop a JSON file, or click to browse'
            }
          </p>
        </div>
        
        {!isProcessing && (
          <div className="mt-4">
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
              id="json-file-input"
            />
            <label
              htmlFor="json-file-input"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              Browse Files
            </label>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Supported JSON formats:</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Array of blog objects: <code>[{"{title, content, ...}"}]</code></li>
          <li>Object with blogs array: <code>{"{blogs: [{title, content, ...}]}"}</code></li>
          <li>Single blog object: <code>{"{title, content, ...}"}</code></li>
        </ul>
      </div>
    </div>
  );
};

// Markdown Editor Component
const MarkdownEditor = ({ value, onChange, placeholder = "Write your blog content in Markdown..." }: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">Content (Markdown)</label>
        <div className="text-xs text-slate-500">
          Supports Markdown syntax
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[400px] font-mono text-sm"
      />
      <div className="text-xs text-slate-500">
        <strong>Markdown Tips:</strong> Use # for headings, **bold**, *italic*, [links](url), ![images](url)
      </div>
    </div>
  );
};

// Blog Form Component
const BlogForm = ({ blog, onSubmit, onCancel, isEditing = false }: {
  blog?: Blog;
  onSubmit: (data: BlogFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}) => {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    coverImage: blog?.coverImage || '',
    status: blog?.status || 'DRAFT',
    scheduledPublishAt: blog?.scheduledPublishAt || '',
    metaTitle: blog?.metaTitle || '',
    metaDescription: blog?.metaDescription || '',
    metaKeywords: blog?.metaKeywords || ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const generateExcerpt = () => {
    const excerpt = formData.content
      .replace(/[#*`]/g, '')
      .replace(/\n/g, ' ')
      .substring(0, 160)
      .trim();
    setFormData(prev => ({ ...prev, excerpt }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Title *</label>
          <Input
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter blog title"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Slug *</label>
          <div className="flex space-x-2">
            <Input
              value={formData.slug}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="blog-url-slug"
              className={errors.slug ? 'border-red-500' : ''}
            />
            <Button type="button" variant="outline" onClick={generateSlug} size="sm">
              Generate
            </Button>
          </div>
          {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Excerpt</label>
        <div className="flex space-x-2">
          <Textarea
            value={formData.excerpt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Brief description of the blog post"
            rows={3}
          />
          <Button type="button" variant="outline" onClick={generateExcerpt} size="sm">
            Generate
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Cover Image URL</label>
        <Input
          value={formData.coverImage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Status</label>
        <Select value={formData.status} onValueChange={(value: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED') => setFormData(prev => ({ ...prev, status: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.status === 'SCHEDULED' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Schedule Publication</label>
          <Input
            type="datetime-local"
            value={formData.scheduledPublishAt ? new Date(formData.scheduledPublishAt).toISOString().slice(0, 16) : ''}
            min={new Date().toISOString().slice(0, 16)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value) {
                // Convert datetime-local to ISO string for storage
                const scheduledDate = new Date(e.target.value);
                setFormData(prev => ({ ...prev, scheduledPublishAt: scheduledDate.toISOString() }));
              } else {
                setFormData(prev => ({ ...prev, scheduledPublishAt: '' }));
              }
            }}
            required={formData.status === 'SCHEDULED'}
          />
          <p className="text-sm text-slate-500">Set when this blog should be published automatically</p>
        </div>
      )}

      <MarkdownEditor
        value={formData.content}
        onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
      />
      {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}

      {/* SEO Fields */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Meta Title</label>
            <Input
              value={formData.metaTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
              placeholder="SEO title for search engines"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Meta Description</label>
            <Input
              value={formData.metaDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
              placeholder="SEO description for search engines"
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium text-slate-700">Meta Keywords</label>
          <Input
            value={formData.metaKeywords}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, metaKeywords: e.target.value }))}
            placeholder="fitness, gym, workout, bangalore (comma separated)"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Blog' : 'Create Blog'}
        </Button>
      </div>
    </form>
  );
};

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showImportZone, setShowImportZone] = useState(false);

  // Load blogs from API
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogApi.getAll();
        console.log('Blogs loaded:', response.blogs); // Debug log
        
        // Validate blog data structure
        const validBlogs = response.blogs.filter(blog => {
          if (!blog || typeof blog !== 'object') {
            console.warn('Invalid blog object:', blog);
            return false;
          }
          if (!blog.id || !blog.title) {
            console.warn('Blog missing required fields:', blog);
            return false;
          }
          return true;
        });
        
        console.log('Valid blogs:', validBlogs);
        setBlogs(validBlogs);
      } catch (error) {
        console.error('Failed to load blogs:', error);
        toast.error('Failed to load blogs. Please try again.');
        // Fallback to empty array if API fails
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const handleCreateBlog = async (blogData: BlogFormData) => {
    try {
      const createData: CreateBlogData = {
        title: blogData.title,
        slug: blogData.slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        coverImage: blogData.coverImage || undefined,
        status: blogData.status,
        metaTitle: blogData.metaTitle || undefined,
        metaDescription: blogData.metaDescription || undefined,
        metaKeywords: blogData.metaKeywords || undefined,
      };
      
      const newBlog = await blogApi.create(createData);
      setBlogs(prev => [newBlog, ...prev]);
      setShowForm(false);
      toast.success('Blog created successfully!');
    } catch (error) {
      console.error('Failed to create blog:', error);
      toast.error('Failed to create blog. Please try again.');
    }
  };

  const handleUpdateBlog = async (blogData: BlogFormData) => {
    if (!editingBlog) return;
    
    try {
      const updateData: Partial<CreateBlogData> = {
        title: blogData.title,
        slug: blogData.slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        coverImage: blogData.coverImage || undefined,
        status: blogData.status,
        metaTitle: blogData.metaTitle || undefined,
        metaDescription: blogData.metaDescription || undefined,
        metaKeywords: blogData.metaKeywords || undefined,
      };
      
      const updatedBlog = await blogApi.update(editingBlog.id, updateData);
      setBlogs(prev => prev.map(blog => 
        blog.id === editingBlog.id ? updatedBlog : blog
      ));
      setEditingBlog(null);
      toast.success('Blog updated successfully!');
    } catch (error) {
      console.error('Failed to update blog:', error);
      toast.error('Failed to update blog. Please try again.');
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      await blogApi.delete(blogId);
      setBlogs(prev => prev.filter(blog => blog.id !== blogId));
      toast.success('Blog deleted successfully!');
    } catch (error) {
      console.error('Failed to delete blog:', error);
      toast.error('Failed to delete blog. Please try again.');
    }
  };

  const handleScheduleBlog = async (blogId: string, scheduledTime: string) => {
    try {
      console.log('Scheduling blog:', blogId, 'with time:', scheduledTime);
      
      // Convert datetime-local to ISO string
      const scheduledDate = new Date(scheduledTime);
      const isoString = scheduledDate.toISOString();
      console.log('Converted to ISO:', isoString);
      
      const updatedBlog = await blogApi.schedule(blogId, isoString);
      
      setBlogs(prev => prev.map(blog => 
        blog.id === blogId ? updatedBlog : blog
      ));
      
      toast.success('Blog scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule blog:', error);
      toast.error('Failed to schedule blog');
    }
  };

  const handleUnscheduleBlog = async (blogId: string) => {
    try {
      const updatedBlog = await blogApi.unschedule(blogId);
      
      setBlogs(prev => prev.map(blog => 
        blog.id === blogId ? updatedBlog : blog
      ));
      
      toast.success('Blog unscheduled successfully!');
    } catch (error) {
      console.error('Failed to unschedule blog:', error);
      toast.error('Failed to unschedule blog');
    }
  };

  const handleBulkImport = async (blogs: CreateBlogData[]) => {
    try {
      setLoading(true);
      const createdBlogs: Blog[] = [];
      
      for (const blogData of blogs) {
        try {
          const newBlog = await blogApi.create(blogData);
          createdBlogs.push(newBlog);
        } catch (error) {
          console.error(`Failed to create blog "${blogData.title}":`, error);
          toast.error(`Failed to create blog "${blogData.title}"`);
        }
      }
      
      if (createdBlogs.length > 0) {
        setBlogs(prev => [...createdBlogs, ...prev]);
        toast.success(`Successfully created ${createdBlogs.length} blog${createdBlogs.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Bulk import error:', error);
      toast.error('Failed to import blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    // Add null checks for blog properties
    if (!blog || !blog.title) return false;
    
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (blog.excerpt?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      DRAFT: 'bg-yellow-100 text-yellow-800',
      SCHEDULED: 'bg-blue-100 text-blue-800',
      PUBLISHED: 'bg-green-100 text-green-800',
      ARCHIVED: 'bg-slate-100 text-slate-800'
    };
    return (
      <Badge className={variants[status] || 'bg-slate-100 text-slate-800'}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Blog Management</h1>
          <p className="text-slate-600 mt-2">Create and manage blog posts for the Fitflix website</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={() => setShowImportZone(!showImportZone)} 
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            {showImportZone ? 'Hide Import' : 'Import JSON'}
          </Button>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Blog
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* JSON Import Zone */}
      {showImportZone && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Import Blogs from JSON</h3>
              <p className="text-sm text-slate-600">Drag and drop a JSON file or click to browse to automatically create blogs</p>
            </div>
            <JsonImportZone onImport={handleBulkImport} />
          </CardContent>
        </Card>
      )}

      {/* Blog List */}
      <div className="grid gap-6">
        {filteredBlogs.map((blog) => {
          // Skip rendering if blog is missing required properties
          if (!blog || !blog.id || !blog.title) {
            return null;
          }
          
          return (
            <Card key={blog.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-slate-900">{blog.title}</h3>
                  </div>
                  <p className="text-slate-600 mb-3">{blog.excerpt || 'No excerpt available'}</p>
                  
                  {/* Blog Status Manager */}
                  <BlogStatusManager
                    blogId={blog.id}
                    currentStatus={blog.status}
                    scheduledPublishAt={blog.scheduledPublishAt}
                    onStatusChange={(newStatus) => {
                      setBlogs(prev => prev.map(b => 
                        b.id === blog.id ? { ...b, status: newStatus as any } : b
                      ));
                    }}
                  />

                  {/* Scheduling Actions for Draft Blogs */}
                  {blog.status === 'DRAFT' && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-700">Schedule for publication:</span>
                        <Input
                          type="datetime-local"
                          className="w-48"
                          min={new Date().toISOString().slice(0, 16)}
                          onChange={(e) => {
                            if (e.target.value) {
                              // Convert datetime-local to ISO string
                              const scheduledDate = new Date(e.target.value);
                              handleScheduleBlog(blog.id, scheduledDate.toISOString());
                            }
                          }}
                        />
                        <Button 
                          size="sm"
                          onClick={() => {
                            const now = new Date();
                            now.setHours(now.getHours() + 1);
                            handleScheduleBlog(blog.id, now.toISOString());
                          }}
                        >
                          Schedule in 1 hour
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Scheduled Blog Info */}
                  {blog.status === 'SCHEDULED' && blog.scheduledPublishAt && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-blue-600">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Scheduled to publish on {new Date(blog.scheduledPublishAt).toLocaleDateString()} at {new Date(blog.scheduledPublishAt).toLocaleTimeString()}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUnscheduleBlog(blog.id)}
                        >
                          Unschedule
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-500 mt-3">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{blog.author?.username || 'Unknown Author'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'No date'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>{blog.slug || 'No slug'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingBlog(blog)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Blog</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteBlog(blog.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>

      {/* Create/Edit Blog Dialog */}
      <Dialog open={showForm || !!editingBlog} onOpenChange={() => {
        setShowForm(false);
        setEditingBlog(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBlog ? 'Edit Blog' : 'Create New Blog'}
            </DialogTitle>
          </DialogHeader>
          <BlogForm
            blog={editingBlog || undefined}
            onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}
            onCancel={() => {
              setShowForm(false);
              setEditingBlog(null);
            }}
            isEditing={!!editingBlog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;
