import api from "../../../api/axiosConfig";

 
export const getMembresias = async () => {
  const res = await api.get("Membresias");
  return res.data;
};

 
export const registrarMembresia = async (data) => {
  const res = await api.post("Membresias/registrar", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};


 
export const editarMembresia = async (id, data) => {
  const res = await api.put(`Membresias/editar/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};



 
export const renovarMembresia = async (id) => {
  const nuevaFecha = new Date();
  nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);

  const body = {
    nuevaFechaVencimiento: nuevaFecha.toISOString(),
    tipoPago: "Efectivo",
    montoPagado: 0,
  };

  const res = await api.put(`Membresias/renovar/${id}`, body);
  return res.data;
};
 
export const eliminarMembresia = async (id) => {
  const res = await api.delete(`Membresias/${id}`);
  return res.data;
};

 
export const getMembresiasPorVencer = async () => {
  const res = await api.get("Membresias/por-vencer");
  return res.data;
};

