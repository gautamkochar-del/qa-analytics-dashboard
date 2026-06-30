import api from "./axios";

export const getBugs = async (params = {}) => {
  const { data } = await api.get("/bugs", { params });
  return data;
};

export const createBug = async (bugData) => {
  const { data } = await api.post("/bugs", bugData);
  return data;
};

export const updateBug = async (id, bugData) => {
  const { data } = await api.put(`/bugs/${id}`, bugData);
  return data;
};

export const deleteBug = async (id) => {
  const { data } = await api.delete(`/bugs/${id}`);
  return data;
};
