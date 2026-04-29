import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Import Role Dashboards
import StudentDashboard from './dashboards/StudentDashboard';
import FreelancerDashboard from './dashboards/FreelancerDashboard';
import ClubDashboard from './dashboards/ClubDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

function Dashboard() {
  const { user } = useContext(AuthContext);

  // Protected Route Logic
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role-Based Routing
  const renderDashboard = () => {
    switch (user.role) {
      case 'STUDENT':
        return <StudentDashboard user={user} />;
      case 'FREELANCER':
        return <FreelancerDashboard user={user} />;
      case 'CLUB':
        return <ClubDashboard user={user} />;
      case 'ADMIN':
        return <AdminDashboard user={user} />;
      default:
        return <StudentDashboard user={user} />;
    }
  };

  return (
    <div className="dashboard-container">
      {renderDashboard()}
    </div>
  );
}

export default Dashboard;
