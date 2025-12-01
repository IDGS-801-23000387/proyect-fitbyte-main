

import api from "../../../api/axiosConfig";

export const getPreRegistros = async () => {
  const res = await api.get("PreRegistros");
  return res.data;
};

export const aceptarPreRegistro = async (id) => {
  const res = await api.put(`PreRegistros/aceptar/${id}`);
  return res.data;
};

export const rechazarPreRegistro = async (id) => {
  const res = await api.put(`PreRegistros/rechazar/${id}`);
  return res.data;
};
