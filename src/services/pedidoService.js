import axios from 'axios';

const API_URL = 'http://localhost:4000/api/gestiondepedidos';

// Obtener todos los pedidos
export const getGestionPedidos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        throw error;
    }
};

// Obtener un pedido por su ID
export const getGestionPedidoById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el pedido con ID ${id}:`, error);
        throw error;
    }
};

// Crear un nuevo pedido
export const createGestionPedido = async (pedido) => {
    try {
        const response = await axios.post(API_URL, pedido);
        return response.data;
    } catch (error) {
        console.error("Error al crear el pedido:", error.response || error.message);
        throw error;
    }
};

// Actualizar un pedido existente
export const updateGestionPedido = async (id, pedido) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, pedido);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar el pedido con ID ${id}:`, error);
        throw error;
    }
};

// Eliminar un pedido
export const deleteGestionPedido = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar el pedido con ID ${id}:`, error);
        throw error;
    }
};
