import axios from 'axios';
import API_BASE_URL from '../dir';  // Asegúrate de que la ruta de `API_BASE_URL` sea correcta

// Obtener todos los pedidos
export const getGestionPedidos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}gestiondepedidos`);
    return response;
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    throw error;
  }
};

// Obtener un pedido por su ID
export const getGestionPedidoById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}gestiondepedidos/${id}`);
    return response;
  } catch (error) {
    console.error(`Error al obtener el pedido con ID ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo pedido
export const createGestionPedido = async (pedido) => {
  console.log('Datos enviados al crear pedido:', pedido);  // Debugging
  try {
    const response = await axios.post(`${API_BASE_URL}gestiondepedidos`, pedido);
    return response;
  } catch (error) {
    console.error("Error al crear el pedido:", error.response?.data || error.message);
    throw error;
  }
};

// Actualizar un pedido existente
export const updateGestionPedido = async (id, pedido) => {
  console.log('Datos enviados al actualizar pedido:', pedido);  // Debugging
  try {
    const response = await axios.put(`${API_BASE_URL}gestiondepedidos/${id}`, pedido);
    return response;
  } catch (error) {
    console.error(`Error al actualizar el pedido con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un pedido
export const deleteGestionPedido = async (id) => {
  console.log('Datos eliminados:', id);  // Debugging
  try {
    const response = await axios.delete(`${API_BASE_URL}gestiondepedidos/${id}`);
    return response;
  } catch (error) {
    console.error(`Error al eliminar el pedido con ID ${id}:`, error);
    throw error;
  }
};
