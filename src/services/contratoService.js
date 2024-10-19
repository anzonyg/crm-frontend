import axios from 'axios';
import API_BASE_URL from '../dir';


export const getContratos = async () => {
    console.log(`${API_BASE_URL}contratos`);
  return await axios.get(`${API_BASE_URL}contratos`);
};

export const createContrato = async (contrato) => {
  return await axios.post(`${API_BASE_URL}contratos`, contrato);
};

export const updateContrato = async (id, contrato) => {
  return await axios.post(`${API_BASE_URL}contratos/${id}`, contrato);
};

export const getContratoById = async (id) => {
  return await axios.get(`${API_BASE_URL}contratos/${id}`);
};
