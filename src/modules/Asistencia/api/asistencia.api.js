import api from "../../../api/axiosConfig";

export const verificarAsistenciaRequest = (codigoCliente) => {
  return api.post("/Asistencia/verificar", {
    codigocliente: codigoCliente,
  });
};
