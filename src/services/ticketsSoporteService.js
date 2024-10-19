import axios from 'axios';
import API_BASE_URL from '../dir';  // Asegúrate de que la ruta de `API_BASE_URL` sea correcta

// Obtener todos los tickets de soporte
export const getTicketsSoporte = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}ticketsSoporte`);
        return response;
    } catch (error) {
        console.error('Error al obtener los tickets de soporte:', error);
        throw error;
    }
};

// Crear un nuevo ticket de soporte
export const createTicketsSoporte = async (ticket) => {
    console.log('Datos enviados al crear ticket:', ticket);  // Debugging
    try {
        const response = await axios.post(`${API_BASE_URL}ticketsSoporte`, ticket);
        return response;
    } catch (error) {
        console.error('Error al crear el ticket de soporte:', error);
        throw error;
    }
};

// Actualizar un ticket de soporte existente
export const updateTicketsSoporte = async (id, ticket) => {
    console.log('Datos enviados al actualizar ticket:', ticket);  // Debugging
    try {
        const response = await axios.put(`${API_BASE_URL}ticketsSoporte/${id}`, ticket);
        return response;
    } catch (error) {
        console.error('Error al actualizar el ticket de soporte:', error);
        throw error;
    }
};

// Obtener un ticket de soporte específico por ID
export const getTicketsSoporteById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}ticketsSoporte/${id}`);
        return response;
    } catch (error) {
        console.error('Error al obtener el ticket de soporte por ID:', error);
        throw error;
    }
};

// Eliminar un ticket de soporte existente
export const deleteTicketsSoporte = async (id) => {
    console.log('Datos eliminados del ticket de soporte:', id);  // Debugging
    try {
        const response = await axios.delete(`${API_BASE_URL}ticketsSoporte/${id}`);
        return response;
    } catch (error) {
        console.error('Error al eliminar el ticket de soporte:', error);
        throw error;
    }
};
