import React from 'react';
import { X, User, Phone, Mail, Hash, Calendar, Clock } from 'lucide-react';

const ContactDetailsModal = ({ isOpen, contact, onClose, onEdit }) => {
  if (!isOpen || !contact) return null;

  const initials = contact.name
    ? contact.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'C';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <User size={20} color="#4f46e5" />
            <span>Contact Details</span>
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 700,
              }}
            >
              {initials}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{contact.name}</h3>
              <span className="contact-id-badge" style={{ marginTop: '0.25rem' }}>ID: {contact.contactId}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
              <Phone size={18} color="#6366f1" />
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Phone Number</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>{contact.phone}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
              <Mail size={18} color="#6366f1" />
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>{contact.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
              <Hash size={18} color="#6366f1" />
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>MongoDB _id</p>
                <p style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#475569' }}>{contact._id || 'N/A'}</p>
              </div>
            </div>

            {contact.createdAt && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>
                    <Calendar size={13} /> CREATED AT
                  </div>
                  <p style={{ fontSize: '0.82rem', marginTop: '0.2rem', color: '#1e293b' }}>{formatDate(contact.createdAt)}</p>
                </div>
                <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>
                    <Clock size={13} /> UPDATED AT
                  </div>
                  <p style={{ fontSize: '0.82rem', marginTop: '0.2rem', color: '#1e293b' }}>{formatDate(contact.updatedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onClose();
              onEdit(contact);
            }}
          >
            Edit Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsModal;
