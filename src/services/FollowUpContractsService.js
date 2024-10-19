import axios from 'axios';
import API_BASE_URL from '../dir';


export const getFollowUpContracts = async () => {
    console.log(`${API_BASE_URL}followupcontracts`);
  return await axios.get(`${API_BASE_URL}followupcontracts`);
};

export const createFollowUpContracts = async (followupcontracts) => {
  return await axios.post(`${API_BASE_URL}followupcontracts`, followupcontracts);
};

export const updateFollowUpContracts = async (id, followupcontracts) => {
  return await axios.post(`${API_BASE_URL}followupcontracts/${id}`, followupcontracts);
};

export const getFollowUpContractsById = async (id) => {
  return await axios.get(`${API_BASE_URL}followupcontracts/${id}`);
};
