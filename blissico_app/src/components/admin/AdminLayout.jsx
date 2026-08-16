// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-content">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="admin-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;