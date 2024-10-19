import axios from 'axios';
import API_BASE_URL from '../dir';

export const getProyectos = async () => {
  console.log(`${API_BASE_URL}proyectos`);
  return await axios.get(`${API_BASE_URL}proyectos`);
};

export const createProyecto = async (proyecto) => {
  return await axios.post(`${API_BASE_URL}proyectos`, proyecto);
};

export const updateProyecto = async (id, proyecto) => {
  return await axios.put(`${API_BASE_URL}proyectos/${id}`, proyecto); // Cambiado a PUT para actualizaciones
};

export const getProyectoById = async (id) => {
  return await axios.get(`${API_BASE_URL}proyectos/${id}`);
};
