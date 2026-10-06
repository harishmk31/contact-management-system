import React, { useState, useEffect } from 'react';
import { X, Edit3, AlertCircle, Loader2 } from 'lucide-react';

const EditContactModal = ({ isOpen, contact, onClose, onContactUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        phone: contact.phone || '',
        email: contact.email || '',
      });
      setErrors({});
      setServerError('');
    }
  }, [contact]);

  if (!isOpen || !contact) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Name cannot be empty.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      errs.phone = 'Phone must contain exactly 10 digits.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. user@domain.com).';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      const identifier = contact.contactId || contact._id;
      await onContactUpdated(identifier, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
      });
      onClose();
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.message) {
        setServerError(responseData.message);
      } else if (responseData?.errors && Array.isArray(responseData.errors)) {
        setServerError(responseData.errors.join(', '));
      } else {
        setServerError('Failed to update contact. Please check your network.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Edit3 size={20} color="#0284c7" />
            <span>Edit Contact ({contact.contactId})</span>
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverError && (
              <div className="form-banner-error">
                <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
                {serverError}
              </div>
            )}

            <div className="form-group">
              <label>Contact ID (Read-only)</label>
              <input
                type="text"
                className="form-input"
                value={contact.contactId}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-name">Full Name *</label>
              <input
                id="edit-name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="field-error-text">
                  <AlertCircle size={13} /> {errors.name}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-phone">Phone Number (10 Digits) *</label>
              <input
                id="edit-phone"
                name="phone"
                type="text"
                maxLength={10}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <div className="field-error-text">
                  <AlertCircle size={13} /> {errors.phone}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-email">Email Address *</label>
              <input
                id="edit-email"
                name="email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="field-error-text">
                  <AlertCircle size={13} /> {errors.email}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                'Update Contact'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;
