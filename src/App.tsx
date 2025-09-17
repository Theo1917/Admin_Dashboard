import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import Login from './pages/Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages - Dashboard, Leads, Blogs, and Events
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Blogs from './pages/Blogs';
import Events from './pages/Events';

function App() {
  return (
    <HelmetProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes - Simplified */}
          <Route path="/" element={
            <ProtectedRoute requireAdmin={true}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="events" element={<Events />} />
          </Route>

          {/* Redirect any other routes to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;