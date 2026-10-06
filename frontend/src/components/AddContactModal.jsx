import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

const AddContactModal = ({ isOpen, onClose, onContactCreated }) => {
  const [formData, setFormData] = useState({
    contactId: '',
    name: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.contactId.trim()) {
      errs.contactId = 'Contact ID cannot be empty.';
    }
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
      errs.email = 'Please provide a valid email format (e.g., user@domain.com).';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being typed into
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
      await onContactCreated({
        contactId: formData.contactId.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
      });
      // Close and clear state
      setFormData({ contactId: '', name: '', phone: '', email: '' });
      setErrors({});
      onClose();
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.message) {
        setServerError(responseData.message);
      } else if (responseData?.errors && Array.isArray(responseData.errors)) {
        setServerError(responseData.errors.join(', '));
      } else {
        setServerError('An error occurred while creating the contact. Please check your network.');
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
            <UserPlus size={20} color="#4f46e5" />
            <span>Add New Contact</span>
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
              <label htmlFor="contactId">Contact ID *</label>
              <input
                id="contactId"
                name="contactId"
                type="text"
                placeholder="e.g. C101"
                className={`form-input ${errors.contactId ? 'error' : ''}`}
                value={formData.contactId}
                onChange={handleChange}
                autoFocus
              />
              {errors.contactId && (
                <div className="field-error-text">
                  <AlertCircle size={13} /> {errors.contactId}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Jane Doe"
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
              <label htmlFor="phone">Phone Number (10 Digits) *</label>
              <input
                id="phone"
                name="phone"
                type="text"
                maxLength={10}
                placeholder="e.g. 9876543210"
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
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. jane@example.com"
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
                'Save Contact'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContactModal;
