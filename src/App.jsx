import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import DashboardHome from './DashboardHome';
import AvailableBlood from './AvailableBlood';
import EmergencyHospitals from './EmergencyHospitals';
import WantToDonate from './WantToDonate';
import AIPredictions from './AIPredictions';
import Donors from './Donors';
import Requests from './Requests';

function App() {
  return (
    <Router>
      <div className="App font-sans text-gray-800 bg-teal-50/30 min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes 
              The Dashboard component contains the Sidebar and the <Outlet />
          */}
          <Route element={<Dashboard />}>
            
            {/* This is the fix: 
                'index' tells React to show DashboardHome when the URL is exactly "/dashboard"
            */}
            <Route path="/dashboard" index element={<DashboardHome />} />
            
            {/* Nested Sub-pages */}
            <Route path="/available-blood" element={<AvailableBlood />} />
            <Route path="/emergency-hospitals" element={<EmergencyHospitals />} />
            <Route path="/want-to-donate" element={<WantToDonate />} />
            
            <Route path="/ai-predictions" element={<AIPredictions />} />
            <Route path="/donors" element={<Donors />} />
            <Route path="/requests" element={<Requests />} />
          </Route>

          {/* Catch-all 404 - Redirects back to login/home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;