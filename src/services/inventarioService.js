import axios from 'axios';
import API_BASE_URL from '../dir';

// Obtener la lista de inventarios
export const getInventarios = async () => {
    console.log(`${API_BASE_URL}inventarios`);
    return await axios.get(`${API_BASE_URL}inventarios`);
};

// Crear un nuevo inventario
export const createInventario = async (inventario) => {
    return await axios.post(`${API_BASE_URL}inventarios`, inventario);
};

// Actualizar un inventario existente por ID
export const updateInventario = async (id, inventario) => {
    return await axios.post(`${API_BASE_URL}inventarios/${id}`, inventario);
};

// Obtener un inventario por ID
export const getInventarioById = async (id) => {
    return await axios.get(`${API_BASE_URL}inventarios/${id}`);
};
