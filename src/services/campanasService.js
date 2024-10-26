import axios from 'axios';
import API_BASE_URL from '../dir';  // Asegúrate de que la ruta de `API_BASE_URL` sea correcta

// Obtener todas las campañas
export const getCampanas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}campanas`);
    return response;
  } catch (error) {
    console.error('Error al obtener las campañas:', error);
    throw error;
  }
};

// Crear una nueva campaña
export const createCampanas = async (campanas) => {
  console.log('Datos enviados al crear:', campanas);  // Debugging
  try {
    const response = await axios.post(`${API_BASE_URL}campanas`, campanas);
    return response;
  } catch (error) {
    console.error('Error al crear la campaña:', error);
    throw error;
  }
};

// Actualizar una campaña existente
export const updateCampanas = async (id, campanas) => {
  console.log('Datos enviados al actualizar:', campanas);  // Debugging
  try {
    const response = await axios.put(`${API_BASE_URL}campanas/${id}`, campanas);
    return response;
  } catch (error) {
    console.error('Error al actualizar la campaña:', error);
    throw error;
  }
};

// Obtener una campaña específica por ID
export const getCampanasById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}campanas/${id}`);
    return response;
  } catch (error) {
    console.error('Error al obtener la campaña por ID:', error);
    throw error;
  }
};

// Eliminar una campaña existente
export const deleteCampanas = async (id) => {
  console.log('Datos eliminados:', id);  // Debugging
  try {
    const response = await axios.delete(`${API_BASE_URL}campanas/${id}`);
    return response;
  } catch (error) {
    console.error('Error al eliminar:', error);
    throw error;
  }
};

// Obtener informacion de campanas para el dashboard
export const getCampanasDashboard = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}campanas-dashboard`);
    return response;
  } catch (error) {
    console.error('Error al obtener las campañas:', error);
    throw error;
  }
};

// Obtener todas las campañas
export const getReporteCampanas = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}campanas-reporte${params}`);
    return response;
  } catch (error) {
    console.error('Error al obtener las campañas:', error);
    throw error;
  }
};
