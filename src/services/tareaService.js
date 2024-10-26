import axios from 'axios';
import API_BASE_URL from '../dir';  // Asegúrate de que la ruta de `API_BASE_URL` sea correcta

// Obtener todas las tareas
export const getTareas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}tareas`);
    return response;  // Retorna el objeto `response` completo
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    throw error;
  }
};

// Obtener tarea por ID
export const getTareaById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}tareas/${id}`);
    return response;  // Retorna el objeto `response` completo
  } catch (error) {
    console.error(`Error al obtener la tarea con ID ${id}:`, error);
    throw error;
  }
};

// Crear una nueva tarea
export const createTarea = async (tarea) => {
  console.log('Datos enviados al crear tarea:', tarea);  // Debugging
  try {
    const response = await axios.post(`${API_BASE_URL}tareas`, tarea);
    return response;  // Retorna el objeto `response` completo
  } catch (error) {
    console.error('Error al crear la tarea:', error.response?.data || error.message);
    throw error;
  }
};

// Actualizar una tarea existente
export const updateTarea = async (id, tarea) => {
  console.log('Datos enviados al actualizar tarea:', tarea);  // Debugging
  try {
    const response = await axios.put(`${API_BASE_URL}tareas/${id}`, tarea);
    return response;  // Retorna el objeto `response` completo
  } catch (error) {
    console.error(`Error al actualizar la tarea con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una tarea
export const deleteTarea = async (id) => {
  console.log('ID de la tarea eliminada:', id);  // Debugging
  try {
    const response = await axios.delete(`${API_BASE_URL}tareas/${id}`);
    return response;  // Retorna el objeto `response` completo
  } catch (error) {
    console.error(`Error al eliminar la tarea con ID ${id}:`, error);
    throw error;
  }
};
