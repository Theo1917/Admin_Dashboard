import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminTickets from './pages/admin/Tickets';
import AdminLeads from './pages/admin/Leads';
import AdminUserManagement from './pages/admin/UserManagement';
import AdminGymManagement from './pages/admin/GymManagement';
import AdminRevenue from './pages/admin/Revenue';

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
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Layout userType="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="user-management" element={<AdminUserManagement />} />
          <Route path="gym-management" element={<AdminGymManagement />} />
          <Route path="revenue" element={<AdminRevenue />} />
        </Route>

        {/* Front Desk Routes */}
        <Route path="/frontdesk" element={<Layout userType="frontdesk" />}>
          <Route index element={<FrontDeskDashboard />} />
          <Route path="tickets" element={<FrontDeskTickets />} />
          <Route path="leads" element={<FrontDeskLeads />} />
          <Route path="customers" element={<FrontDeskCustomers />} />
          <Route path="check-ins" element={<FrontDeskCheckIns />} />
          <Route path="targets" element={<FrontDeskTargets />} />
          <Route path="membership" element={<FrontDeskMembership />} />
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login\" replace />} />
      </Routes>
    </Router>
  );
}

export default App;