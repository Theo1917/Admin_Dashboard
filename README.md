# Fitflix Admin Dashboard

A clean, minimalistic admin dashboard focused on lead management and blog management.

## Features

- **Dashboard**: Overview of key metrics for leads and blogs
- **Lead Management**: View, filter, and manage leads with status updates
- **Blog Management**: Manage blog posts with publishing, scheduling, and status controls
- **Clean UI**: Modern, responsive design built with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

## Backend Integration

The dashboard integrates with the Fitflix backend API:

- **Leads API**: `/api/leads/*`
- **Blogs API**: `/api/blogs/*`

### API Endpoints Used

#### Leads
- `GET /api/leads` - Get all leads
- `PATCH /api/leads/:id/status` - Update lead status
- `DELETE /api/leads/:id` - Delete lead

#### Blogs
- `GET /api/blogs` - Get all blogs
- `PATCH /api/blogs/:id/publish` - Publish blog
- `PATCH /api/blogs/:id/draft` - Save as draft
- `PATCH /api/blogs/:id/schedule` - Schedule blog
- `DELETE /api/blogs/:id` - Delete blog

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx          # Main layout with sidebar
│   └── ProtectedRoute.tsx  # Route protection
├── pages/
│   ├── Dashboard.tsx       # Main dashboard
│   ├── Leads.tsx          # Lead management
│   ├── Blogs.tsx          # Blog management
│   └── Login.tsx          # Login page
├── services/
│   ├── api.ts             # Blog API client
│   ├── auth.ts            # Authentication service
│   └── leads.ts           # Leads API client
└── App.tsx                # Main app component
```

## Technologies Used

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Notifications**: Sonner
- **Build Tool**: Vite

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Customization

### Adding New Features

1. Create new page components in `src/pages/`
2. Add routes in `src/App.tsx`
3. Add navigation items in `src/components/Layout.tsx`
4. Create corresponding API services if needed

### Styling

The dashboard uses Tailwind CSS for styling. Custom styles can be added in `src/index.css`.

## Security Notes

- This is a demo version with hardcoded credentials
- In production, implement proper authentication with your backend
- Update the `authService` to integrate with your authentication system
- Add proper JWT token handling and refresh mechanisms

## Support

For issues or questions, please refer to the main Fitflix project documentation.
