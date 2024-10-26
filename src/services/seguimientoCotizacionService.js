import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/cotizacionesAprobadas'; // Apunta a la ruta correcta en el backend

// Obtener la lista de cotizaciones aprobadas
export const getCotizacionesAprobadas = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener cotizaciones aprobadas:', error);
        throw error;
    }
};
// Obtener una cotización aprobada por ID
export const getCotizacionById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener cotización aprobada por ID:", error);
        throw error;
    }
};
