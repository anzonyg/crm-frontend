import axios from 'axios';

import API_BASE_URL from '../dir';


export const getLeads = async () => {
  return await axios.get(`${API_BASE_URL}leads`);
};

export const createLead = async (lead) => {
  return await axios.post(`${API_BASE_URL}leads`, lead);
};

export const updateLead = async (id, lead) => {
  return await axios.post(`${API_BASE_URL}leads/${id}`, lead);
};

export const getLeadById = async (id) => {
  return await axios.get(`${API_BASE_URL}leads/${id}`);
};

export const deleteLead = async (id) => {
  return await axios.delete(`${API_BASE_URL}leads/${id}`);
};
