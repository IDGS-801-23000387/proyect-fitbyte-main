import api from "../../../api/axiosConfig";
 
export const getRutinasRequest = () => api.get("/Rutinas");

 
export const getRutinaByIdRequest = (id) => api.get(`/Rutinas/${id}`);

 
export const createRutinaRequest = (formData) =>
  api.post("/Rutinas/crear", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

 
export const updateRutinaRequest = (id, formData) =>
  api.put(`/Rutinas/actualizar/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

 
export const deleteRutinaRequest = (id) => api.delete(`/Rutinas/${id}`);
