import React from 'react';
import { Users, BookOpen, Layers, ShieldCheck } from 'lucide-react';

const Sidebar = ({ totalContacts }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <BookOpen size={20} color="#ffffff" />
        </div>
        <span>Contact CMS</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-item active">
          <Users size={18} />
          <span>All Contacts</span>
        </div>
        <div className="nav-item">
          <Layers size={18} />
          <span>Groups</span>
        </div>
        <div className="nav-item">
          <ShieldCheck size={18} />
          <span>Security & API</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <span className="system-status-dot"></span>
        <span>MongoDB Connected</span>
      </div>
    </aside>
  );
};

export default Sidebar;
