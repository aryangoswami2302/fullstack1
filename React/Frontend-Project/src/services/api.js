import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export const api = {
  // Plans
  getPlans: async () => {
    const response = await axios.get(`${API_BASE}/plans`);
    return response.data;
  },
  createPlan: async (planData) => {
    const response = await axios.post(`${API_BASE}/plans`, planData);
    return response.data;
  },
  updatePlan: async (id, planData) => {
    const response = await axios.put(`${API_BASE}/plans/${id}`, planData);
    return response.data;
  },
  deletePlan: async (id) => {
    const response = await axios.delete(`${API_BASE}/plans/${id}`);
    return response.data;
  },

  // Members
  getMembers: async () => {
    const response = await axios.get(`${API_BASE}/members`);
    return response.data;
  },
  createMember: async (memberData) => {
    const response = await axios.post(`${API_BASE}/members`, memberData);
    return response.data;
  },
  updateMember: async (id, memberData) => {
    const response = await axios.put(`${API_BASE}/members/${id}`, memberData);
    return response.data;
  },
  deleteMember: async (id) => {
    const response = await axios.delete(`${API_BASE}/members/${id}`);
    return response.data;
  }
};
