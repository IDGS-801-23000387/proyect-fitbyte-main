import api from "../../../api/axiosConfig";

 
export const registrarVisita = async (data) => {
  const res = await api.post("VentaVisita/registrar", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

 
export const getVisitas = async () => {
  const res = await api.get("VentaVisita");
  return res.data;
};

 
export const getVisitasHoy = async () => {
  const res = await api.get("VentaVisita/hoy");
  return res.data;
};

 
export const getVisitasAyer = async () => {
  const res = await api.get("VentaVisita/ayer");
  return res.data;
};
 
export const getVisitasSemana = async () => {
  const res = await api.get("VentaVisita/semana");
  return res.data;
};

 
export const getVisitasMes = async () => {
  const res = await api.get("VentaVisita/mes");
  return res.data;
};
