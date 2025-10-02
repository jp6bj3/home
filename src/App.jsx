import React, { useState } from 'react';
import Login from './pages/Login';
import NGOAdminDashboard from './pages/NGOAdmin/Dashboard';
import StoreDashboard from './pages/Store/Dashboard';
import AssociationDashboard from './pages/Association/Dashboard';
import HomelessDashboard from './pages/Homeless/Dashboard';
import { USER_ROLES } from './constants/userRoles';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const renderDashboard = () => {
    switch (currentUser?.role) {
      case USER_ROLES.NGO_ADMIN:
      case USER_ROLES.NGO_PARTNER:
        return <NGOAdminDashboard user={currentUser} onLogout={handleLogout} />;
      case USER_ROLES.STORE:
        return <StoreDashboard user={currentUser} onLogout={handleLogout} />;
      case USER_ROLES.ASSOCIATION_ADMIN:
      case USER_ROLES.ASSOCIATION_PARTNER:
        return <AssociationDashboard user={currentUser} onLogout={handleLogout} />;
      case USER_ROLES.HOMELESS:
        return <HomelessDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return renderDashboard();
}

export default App;
