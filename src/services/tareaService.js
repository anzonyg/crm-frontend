import axios from 'axios';

const API_URL = 'http://localhost:4000/api/tareas';  // Asegúrate de que el backend está corriendo en este puerto

// Obtener todas las tareas
export const getTareas = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Obtener tarea por ID
export const getTareaById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Crear una nueva tarea
export const createTarea = async (tarea) => {
    const response = await axios.post(API_URL, tarea);
    return response.data;
};

// Actualizar una tarea
export const updateTarea = async (id, tarea) => {
    const response = await axios.put(`${API_URL}/${id}`, tarea);
    return response.data;
};

// Eliminar una tarea
export const deleteTarea = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
