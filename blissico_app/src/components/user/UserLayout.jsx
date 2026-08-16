// src/components/user/UserLayout.jsx
import React, { useState } from 'react';
import UserSidebar from './UserSidebar';
import UserTopbar from './UserTopbar';
import './UserLayout.css';

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="user-layout-wrapper">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="user-main-content">
        <UserTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="user-page-body">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;