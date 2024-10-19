import axios from 'axios';
import API_BASE_URL from '../dir';

export const getEventosActividades = async () => {
    return await axios.get(`${API_BASE_URL}eventosActividades`);
};

export const createEventoActividad = async (evento) => {
    console.log('Datos enviados al crear:', evento);  // Debugging
    return await axios.post(`${API_BASE_URL}eventosActividades`, evento);
};

export const updateEventoActividad = async (id, evento) => {
    console.log('Datos enviados al actualizar:', evento);  // Debugging
    return await axios.post(`${API_BASE_URL}eventosActividades/${id}`, evento);
};

export const getEventoActividadById = async (id) => {
    return await axios.get(`${API_BASE_URL}eventosActividades/${id}`);
};

export const deleteEventoActividad = async (id) => {
    return await axios.delete(`${API_BASE_URL}eventosActividades/${id}`);
};
