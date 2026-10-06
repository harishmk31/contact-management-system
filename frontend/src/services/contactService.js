import axios from 'axios';

// The backend Express server runs on port 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const contactService = {
  // GET /contacts - Fetch all contacts
  getAllContacts: async () => {
    const response = await apiClient.get('/contacts');
    return response.data;
  },

  // GET /contacts/:id - Fetch a single contact by contactId or _id
  getContactById: async (id) => {
    const response = await apiClient.get(`/contacts/${id}`);
    return response.data;
  },

  // POST /contacts - Create a new contact
  createContact: async (contactData) => {
    const response = await apiClient.post('/contacts', contactData);
    return response.data;
  },

  // PUT /contacts/:id - Update contact details
  updateContact: async (id, updateData) => {
    const response = await apiClient.put(`/contacts/${id}`, updateData);
    return response.data;
  },

  // DELETE /contacts/:id - Delete a contact
  deleteContact: async (id) => {
    const response = await apiClient.delete(`/contacts/${id}`);
    return response.data;
  },
};

export default contactService;
