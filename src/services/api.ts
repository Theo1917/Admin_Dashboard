// API Configuration
// Minimal JsonValue type for API fields
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
const RAW_API_BASE_URL = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL || 'http://localhost:3000';
const normalizeApiBase = (url: string) => {
  const trimmed = url.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};
const API_BASE_URL = normalizeApiBase(RAW_API_BASE_URL);

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
  publishedAt?: string;
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

// Event Types
export interface Event {
  id: string;
  title: string;
  title1?: string;
  title2?: string;
  title3?: string;
  description: string;
  details?: JsonValue; // Json field
  descriptionBlocks?: { title: string; description?: string; items?: string[] }[];
  coverImage?: string;
  imageUrls?: string[];
  location?: string;
  date: string;
  entryFee?: number; // Will be converted from Decimal
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  responseCount?: number; // Computed field
  confirmedCount?: number; // Computed field
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistrationData {
  name: string;
  phone: string;
  email: string;
}

export interface EventResponse {
  id: string;
  eventId: string;
  name: string;
  phone: string;
  email: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
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
        ...options.headers,
      },
      credentials: 'include',
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
    return this.request<{ blogs: Blog[]; total: number }>('/blogs/status/PUBLISHED');
  }

  async getBlogBySlug(slug: string): Promise<Blog> {
    return this.request<Blog>(`/blogs/slug/${slug}`);
  }

  // Event API methods
  async getAllEvents(): Promise<{ events: Event[] }> {
    return this.request<{ success: boolean; events: Event[] }>('/events').then(response => ({ events: response.events }));
  }

  async getEventById(id: string): Promise<Event> {
    return this.request<{ success: boolean; event: Event }>(`/events/${id}`).then(response => response.event);
  }

  async createEvent(data: Partial<Event>): Promise<Event> {
    return this.request<{ success: boolean; event: Event }>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(response => response.event);
  }

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    return this.request<{ success: boolean; event: Event }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then(response => response.event);
  }

  async deleteEvent(id: string): Promise<{ message: string }> {
    return this.request<{ success: boolean; message: string }>(`/events/${id}`, {
      method: 'DELETE',
    }).then(response => ({ message: response.message }));
  }

  async publishEvent(id: string): Promise<Event> {
    return this.request<{ success: boolean; event: Event }>(`/events/${id}/publish`, {
      method: 'PATCH',
    }).then(response => response.event);
  }

  async cancelEvent(id: string): Promise<Event> {
    return this.request<{ success: boolean; event: Event }>(`/events/${id}/cancel`, {
      method: 'PATCH',
    }).then(response => response.event);
  }

  async completeEvent(id: string): Promise<Event> {
    return this.request<{ success: boolean; event: Event }>(`/events/${id}/complete`, {
      method: 'PATCH',
    }).then(response => response.event);
  }

  async getEventResponses(eventId: string): Promise<{ responses: EventResponse[] }> {
    return this.request<{ success: boolean; responses: EventResponse[] }>(`/events/${eventId}/responses`).then(response => ({ responses: response.responses }));
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

// Events API
export const eventApi = {
  getAll: () => apiClient.getAllEvents(),
  getById: (id: string) => apiClient.getEventById(id),
  create: (data: Partial<Event>) => apiClient.createEvent(data),
  update: (id: string, data: Partial<Event>) => apiClient.updateEvent(id, data),
  delete: (id: string) => apiClient.deleteEvent(id),
  publish: (id: string) => apiClient.publishEvent(id),
  cancel: (id: string) => apiClient.cancelEvent(id),
  complete: (id: string) => apiClient.completeEvent(id),
  getResponses: (eventId: string) => apiClient.getEventResponses(eventId),
};
