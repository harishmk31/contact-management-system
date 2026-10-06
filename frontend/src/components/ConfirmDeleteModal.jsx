import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, contact, onClose, onConfirm, isDeleting }) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ color: 'var(--danger)' }}>
            <AlertTriangle size={20} />
            <span>Confirm Deletion</span>
          </h2>
          <button className="modal-close-btn" onClick={onClose} disabled={isDeleting}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
            Are you sure you want to permanently delete the contact for:
          </p>
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '0.75rem 1rem' }}>
            <strong style={{ display: 'block', color: '#991b1b', fontSize: '1rem' }}>{contact.name}</strong>
            <span style={{ fontSize: '0.82rem', color: '#b91c1c' }}>ID: {contact.contactId} • {contact.email}</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.75rem' }}>
            This action cannot be undone and will permanently remove this record from MongoDB.
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={() => onConfirm(contact)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} /> Delete Contact
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
