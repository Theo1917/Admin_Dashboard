// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';
import { authService } from './auth';

// Types
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  scheduledPublishAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
  updatedAt?: string;
  author: {
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface CreateBlogData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  scheduledPublishAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface UpdateBlogData extends CreateBlogData {
  id: string;
}

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
        ...options.headers,
      },
      credentials: 'include', // Include cookies for JWT authentication
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Blog API methods
  async getAllBlogs(): Promise<{ blogs: Blog[]; total: number }> {
    return this.request<{ blogs: Blog[]; total: number }>('/blogs');
  }

  async getBlogById(id: string): Promise<Blog> {
    return this.request<Blog>(`/blogs/${id}`);
  }

  async createBlog(data: CreateBlogData): Promise<Blog> {
    return this.request<Blog>('/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlog(id: string, data: Partial<CreateBlogData>): Promise<Blog> {
    return this.request<Blog>(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBlog(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/blogs/${id}`, {
      method: 'DELETE',
    });
  }

  async scheduleBlog(id: string, scheduledPublishAt: string): Promise<Blog> {
    return this.request<Blog>(`/blogs/${id}/schedule`, {
      method: 'PATCH',
      body: JSON.stringify({ scheduledPublishAt }),
    });
  }

  async unscheduleBlog(id: string): Promise<Blog> {
    return this.request<Blog>(`/blogs/${id}/unschedule`, {
      method: 'PATCH',
    });
  }

  async publishBlog(id: string): Promise<Blog> {
    return this.request<Blog>(`/blogs/${id}/publish`, {
      method: 'PATCH',
    });
  }

  async saveAsDraft(id: string): Promise<Blog> {
    return this.request<Blog>(`/blogs/${id}/draft`, {
      method: 'PATCH',
    });
  }

  // Published blogs (for public website)
  async getPublishedBlogs(): Promise<{ blogs: Blog[]; total: number }> {
    return this.request<{ blogs: Blog[]; total: number }>('/blogs/published');
  }

  async getBlogBySlug(slug: string): Promise<Blog> {
    return this.request<Blog>(`/blogs/slug/${slug}`);
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual API functions for convenience
export const blogApi = {
  getAll: () => apiClient.getAllBlogs(),
  getById: (id: string) => apiClient.getBlogById(id),
  create: (data: CreateBlogData) => apiClient.createBlog(data),
  update: (id: string, data: Partial<CreateBlogData>) => apiClient.updateBlog(id, data),
  delete: (id: string) => apiClient.deleteBlog(id),
  getPublished: () => apiClient.getPublishedBlogs(),
  getBySlug: (slug: string) => apiClient.getBlogBySlug(slug),
  schedule: (id: string, scheduledPublishAt: string) => apiClient.scheduleBlog(id, scheduledPublishAt),
  unschedule: (id: string) => apiClient.unscheduleBlog(id),
  publish: (id: string) => apiClient.publishBlog(id),
  saveAsDraft: (id: string) => apiClient.saveAsDraft(id),
};
