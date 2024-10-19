import axios from 'axios';
import API_BASE_URL from '../dir';

export const getCotizaciones = async () => {
    return await axios.get(`${API_BASE_URL}cotizaciones`);
};

export const createCotizacion = async (cotizacion) => {
    console.log('Datos enviados al crear:', cotizacion);  // Debugging
    return await axios.post(`${API_BASE_URL}cotizaciones`, cotizacion);
};

export const updateCotizacion = async (id, cotizacion) => {
    console.log('Datos enviados al actualizar:', cotizacion);  // Debugging
    return await axios.post(`${API_BASE_URL}cotizaciones/${id}`, cotizacion);
};

export const getCotizacionById = async (id) => {
    return await axios.get(`${API_BASE_URL}cotizaciones/${id}`);
};

export const deleteCotizacion = async (id) => {
    return await axios.delete(`${API_BASE_URL}cotizaciones/${id}`);
};

export const approveCotizacion = async (id) => {
    try {
        // Aprobar la cotización seleccionada y desaprobar las demás en el backend
        await axios.patch(`${API_BASE_URL}cotizaciones/${id}/aprobar`);
    } catch (error) {
        console.error("Error al aprobar la cotización:", error);
        throw error;
    }
};

