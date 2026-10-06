import React from 'react';
import { Eye, Edit3, Trash2, Phone, Mail, Inbox, AlertTriangle, RefreshCw } from 'lucide-react';

const ContactTable = ({
  contacts,
  loading,
  error,
  onRefresh,
  onView,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="table-card">
        <div className="state-container">
          <div className="state-icon-circle animate-spin">
            <RefreshCw size={28} color="#4f46e5" />
          </div>
          <h3>Loading Contacts...</h3>
          <p>Fetching contact records from Express & MongoDB.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-card">
        <div className="state-container">
          <div className="state-icon-circle" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
            <AlertTriangle size={28} />
          </div>
          <h3>Failed to Load Contacts</h3>
          <p>{error}</p>
          <button className="btn-secondary" onClick={onRefresh} style={{ marginTop: '0.75rem' }}>
            <RefreshCw size={15} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="table-card">
        <div className="state-container">
          <div className="state-icon-circle">
            <Inbox size={28} />
          </div>
          <h3>No Contacts Found</h3>
          <p>Get started by clicking the "Add Contact" button above or try clearing your search query.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Contact ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => {
              const initials = contact.name
                ? contact.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()
                : 'C';

              return (
                <tr key={contact._id || contact.contactId}>
                  <td>
                    <span className="contact-id-badge">{contact.contactId}</span>
                  </td>
                  <td>
                    <div className="contact-name-cell" onClick={() => onView(contact)}>
                      <div className="contact-avatar">{initials}</div>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>{contact.name}</strong>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569' }}>
                      <Phone size={14} color="#94a3b8" />
                      <span>{contact.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569' }}>
                      <Mail size={14} color="#94a3b8" />
                      <span>{contact.email}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="icon-btn view"
                        title="View Details"
                        onClick={() => onView(contact)}
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        className="icon-btn edit"
                        title="Edit Contact"
                        onClick={() => onEdit(contact)}
                      >
                        <Edit3 size={17} />
                      </button>
                      <button
                        className="icon-btn delete"
                        title="Delete Contact"
                        onClick={() => onDelete(contact)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTable;
