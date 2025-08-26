import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminLeads from './pages/admin/Leads';
import AdminBlogManagement from './pages/admin/BlogManagement';

// Front Desk Pages
import FrontDeskDashboard from './pages/frontdesk/Dashboard';
import FrontDeskTickets from './pages/frontdesk/Tickets';
import FrontDeskLeads from './pages/frontdesk/Leads';
import FrontDeskCustomers from './pages/frontdesk/Customers';
import FrontDeskCheckIns from './pages/frontdesk/CheckIns';
import FrontDeskTargets from './pages/frontdesk/Targets';
import FrontDeskMembership from './pages/frontdesk/Membership';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <Layout userType="admin" />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="blogs" element={<AdminBlogManagement />} />
        </Route>

        {/* Front Desk Routes */}
        <Route path="/frontdesk" element={
          <ProtectedRoute>
            <Layout userType="frontdesk" />
          </ProtectedRoute>
        }>
          <Route index element={<FrontDeskDashboard />} />
          <Route path="tickets" element={<FrontDeskTickets />} />
          <Route path="leads" element={<FrontDeskLeads />} />
          <Route path="customers" element={<FrontDeskCustomers />} />
          <Route path="check-ins" element={<FrontDeskCheckIns />} />
          <Route path="targets" element={<FrontDeskTargets />} />
          <Route path="membership" element={<FrontDeskMembership />} />
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;