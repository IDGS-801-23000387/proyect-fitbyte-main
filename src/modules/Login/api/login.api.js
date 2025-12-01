import api from "../../../api/axiosConfig";

export const loginRequest = (usuario, contrasena) => {
  return api.post("AuthAdmin/login", {
    usuario,
    contrasena,
  });
};
