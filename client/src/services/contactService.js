import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const contactService = {
  getAllContacts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contacts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  getContactById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with id ${id}:`, error);
      throw error;
    }
  },

  createContact: async (contactData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/contacts`, contactData);
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },

  updateContact: async (id, contactData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/contacts/${id}`, contactData);
      return response.data;
    } catch (error) {
      console.error(`Error updating contact with id ${id}:`, error);
      throw error;
    }
  },

  deleteContact: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting contact with id ${id}:`, error);
      throw error;
    }
  }
};

export default contactService; 