import React from 'react';
import { BookUser, Database, Server } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="top-navbar">
      <div className="navbar-title-group">
        <h1>Contact Management System</h1>
        <p>Full-Stack MERN Application Dashboard</p>
      </div>

      <div className="navbar-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
          <Server size={15} color="#4f46e5" />
          <span>Express Port: <strong>5000</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
          <Database size={15} color="#10b981" />
          <span>Database: <strong>contact_management</strong></span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
