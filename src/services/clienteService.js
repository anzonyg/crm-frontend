import axios from 'axios';
import API_BASE_URL from '../dir';  // Asegúrate de que la ruta de `API_BASE_URL` sea correcta

// Obtener todos los clientes
export const getClientes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}clientes`);
    return response;
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    throw error;
  }
};

// Obtener un cliente específico por ID
export const getClienteById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}clientes/${id}`);
    return response;
  } catch (error) {
    console.error('Error al obtener el cliente por ID:', error);
    throw error;
  }
};

// Crear un nuevo cliente
export const createCliente = async (cliente) => {
  console.log('Datos enviados al crear cliente:', cliente);  // Debugging
  try {
    const response = await axios.post(`${API_BASE_URL}clientes`, cliente);
    return response;
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    throw error;
  }
};

// Actualizar un cliente existente
export const updateCliente = async (id, cliente) => {
  console.log('Datos enviados al actualizar cliente:', cliente);  // Debugging
  try {
    const response = await axios.put(`${API_BASE_URL}clientes/${id}`, cliente);
    return response;
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    throw error;
  }
};

// Eliminar un cliente existente
export const deleteCliente = async (id) => {
  console.log('Datos eliminados:', id);  // Debugging
  try {
    const response = await axios.delete(`${API_BASE_URL}clientes/${id}`);
    return response;
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    throw error;
  }
};