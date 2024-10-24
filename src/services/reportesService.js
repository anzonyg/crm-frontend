import axios from 'axios';
import API_BASE_URL from '../dir';

export const obtenerCotizacionesFiltradas = async (filtros) => {
  const url = `${API_BASE_URL}reportecotizacion`;
  console.log(`Realizando petición a: ${url}`);
  try {
    const response = await axios.post(url, filtros);
    return response.data;
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    return [];
  }
};
