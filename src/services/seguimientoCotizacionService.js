import axios from 'axios';
import API_BASE_URL from '../dir';  // Asegúrate de que la ruta de `API_BASE_URL` sea correcta

// Obtener la lista de cotizaciones aprobadas
export const getCotizacionesAprobadas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}cotizacionesAprobadas`);
    return response; // Devolvemos el objeto `response` completo para consistencia
  } catch (error) {
    console.error('Error al obtener cotizaciones aprobadas:', error);
    throw error;
  }
};

// Obtener una cotización aprobada por ID
export const getCotizacionById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}cotizacionesAprobadas/${id}`);
    return response; // Devolvemos el objeto `response` completo
  } catch (error) {
    console.error('Error al obtener cotización aprobada por ID:', error);
    throw error;
  }
};
