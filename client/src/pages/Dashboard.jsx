import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Import Role Dashboards
import StudentDashboard from './dashboards/StudentDashboard';
import FreelancerDashboard from './dashboards/FreelancerDashboard';
import ClubDashboard from './dashboards/ClubDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  // Protected Route Logic
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role-Based Routing
  const renderDashboard = () => {
    switch (user.role) {
      case 'STUDENT':
        return <StudentDashboard />;
      case 'FREELANCER':
        return <FreelancerDashboard />;
      case 'CLUB':
        return <ClubDashboard />;
      case 'ADMIN':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="dashboard-container">
      {renderDashboard()}
    </div>
  );
}

export default Dashboard;
