import React from 'react';
import { Users, PhoneCall, MailCheck } from 'lucide-react';

const DashboardStats = ({ totalContacts, filteredCount }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <p>Total Contacts</p>
          <h3>{totalContacts}</h3>
        </div>
        <div className="stat-icon indigo">
          <Users size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <p>Filtered Results</p>
          <h3>{filteredCount}</h3>
        </div>
        <div className="stat-icon emerald">
          <PhoneCall size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <p>Database Status</p>
          <h3 style={{ fontSize: '1.25rem', color: '#10b981' }}>Live Sync</h3>
        </div>
        <div className="stat-icon amber">
          <MailCheck size={24} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
