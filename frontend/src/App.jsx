import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/contacts';

function App() {
  // State variables
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form input state for adding contacts
  const [formData, setFormData] = useState({
    contactId: '',
    name: '',
    phone: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Editing state
  const [editContact, setEditContact] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', phone: '', email: '' });
  const [editErrors, setEditErrors] = useState({});

  // Details popup state
  const [viewContact, setViewContact] = useState(null);

  // Helper to show status message (success / error)
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 4000);
  };

  // 1. Fetch all contacts from backend
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setContacts(res.data.data || []);
    } catch (err) {
      showMessage(err.response?.data?.message || 'Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Form Validation rule check
  const validateForm = (data) => {
    const errors = {};
    if (!data.contactId || !data.contactId.trim()) {
      errors.contactId = 'Contact ID is required';
    }
    if (!data.name || !data.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!data.phone || !data.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(data.phone.trim())) {
      errors.phone = 'Phone must be exactly 10 digits';
    }
    if (!data.email || !data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = 'Invalid email address';
    }
    return errors;
  };

  // 2. Handle Add Contact Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const res = await axios.post(API_URL, formData);
      showMessage(res.data.message || 'Contact added successfully!', 'success');
      setFormData({ contactId: '', name: '', phone: '', email: '' });
      setFormErrors({});
      fetchContacts();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add contact';
      showMessage(errorMsg, 'error');
    }
  };

  // 3. Handle Delete Contact
  const handleDelete = async (contact) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${contact.name}?`);
    if (!confirmDelete) return;

    try {
      const id = contact.contactId || contact._id;
      const res = await axios.delete(`${API_URL}/${id}`);
      showMessage(res.data.message || 'Contact deleted successfully!', 'success');
      fetchContacts();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to delete contact', 'error');
    }
  };

  // 4. Open Edit Modal
  const openEditModal = (contact) => {
    setEditContact(contact);
    setEditFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
    });
    setEditErrors({});
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!editFormData.name.trim()) errors.name = 'Name is required';
    if (!editFormData.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(editFormData.phone.trim())) {
      errors.phone = 'Phone must be exactly 10 digits';
    }
    if (!editFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email.trim())) {
      errors.email = 'Invalid email address';
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    try {
      const id = editContact.contactId || editContact._id;
      const res = await axios.put(`${API_URL}/${id}`, editFormData);
      showMessage(res.data.message || 'Contact updated successfully!', 'success');
      setEditContact(null);
      fetchContacts();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update contact', 'error');
    }
  };

  // 5. Filter contacts by search (Name, Phone, Email, or Contact ID)
  const filteredContacts = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.contactId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container">
      {/* Page Header */}
      <div className="header-box">
        <h1>Contact Management System</h1>
        <p>Simple Node.js + Express + MongoDB CRUD Application</p>
      </div>

      {/* Status Banner */}
      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Main Content Layout */}
      <div className="layout-grid">
        {/* Left: Add Contact Form */}
        <div className="box">
          <h2>Add New Contact</h2>
          <form onSubmit={handleAddSubmit}>
            <div className="form-group">
              <label>Contact ID:</label>
              <input
                type="text"
                placeholder="e.g. C101"
                value={formData.contactId}
                onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
              />
              {formErrors.contactId && <div className="error-text">{formErrors.contactId}</div>}
            </div>

            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {formErrors.name && <div className="error-text">{formErrors.name}</div>}
            </div>

            <div className="form-group">
              <label>Phone (10 digits):</label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {formErrors.phone && <div className="error-text">{formErrors.phone}</div>}
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="text"
                placeholder="e.g. rahul@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {formErrors.email && <div className="error-text">{formErrors.email}</div>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              Add Contact
            </button>
          </form>
        </div>

        {/* Right: Contact List Table & Search */}
        <div className="box">
          <h2>
            Contact List ({filteredContacts.length} of {contacts.length})
          </h2>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p>Loading contacts...</p>
          ) : filteredContacts.length === 0 ? (
            <div className="empty-state">No contacts found.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id || contact.contactId}>
                      <td>{contact.contactId}</td>
                      <td><strong>{contact.name}</strong></td>
                      <td>{contact.phone}</td>
                      <td>{contact.email}</td>
                      <td>
                        <button
                          className="btn btn-view"
                          onClick={() => setViewContact(contact)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-edit"
                          onClick={() => openEditModal(contact)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(contact)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Simple View Details Modal */}
      {viewContact && (
        <div className="modal-overlay" onClick={() => setViewContact(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Contact Details</h3>
            <p><strong>Contact ID:</strong> {viewContact.contactId}</p>
            <p><strong>Name:</strong> {viewContact.name}</p>
            <p><strong>Phone:</strong> {viewContact.phone}</p>
            <p><strong>Email:</strong> {viewContact.email}</p>
            <p><small style={{ color: '#888' }}>Database ID: {viewContact._id}</small></p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setViewContact(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Edit Modal */}
      {editContact && (
        <div className="modal-overlay" onClick={() => setEditContact(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Contact ({editContact.contactId})</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
                {editErrors.name && <div className="error-text">{editErrors.name}</div>}
              </div>

              <div className="form-group">
                <label>Phone (10 digits):</label>
                <input
                  type="text"
                  maxLength={10}
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
                {editErrors.phone && <div className="error-text">{editErrors.phone}</div>}
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="text"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
                {editErrors.email && <div className="error-text">{editErrors.email}</div>}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditContact(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
