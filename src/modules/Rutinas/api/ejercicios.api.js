import api from "../../../api/axiosConfig";

 export const getEjerciciosPorRutinaRequest = (rutinaId) =>
  api.get(`/Ejercicios/por-rutina/${rutinaId}`);

 
export const getEjercicioByIdRequest = (id) =>
  api.get(`/Ejercicios/${id}`);

 
export const createEjercicioRequest = (data) =>
  api.post("/Ejercicios/crear", data);

 
export const updateEjercicioRequest = (id, data) =>
  api.put(`/Ejercicios/actualizar/${id}`, data);

 
export const deleteEjercicioRequest = (id) =>
  api.delete(`/Ejercicios/${id}`);
