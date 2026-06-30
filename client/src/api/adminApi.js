import api from "./axios";

// === Users ===
export const getUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const createUser = async (userData) => {
  const { data } = await api.post("/users", userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

export const toggleUserStatus = async (id) => {
  const { data } = await api.patch(`/users/${id}/disable`);
  return data;
};

export const resetUserPassword = async (id, newPassword) => {
  const { data } = await api.patch(`/users/${id}/reset-password`, { newPassword });
  return data;
};

// === Roles ===
export const getRoles = async () => {
  const { data } = await api.get("/admin/roles");
  return data;
};

// === Departments ===
export const getDepartments = async () => {
  const { data } = await api.get("/admin/departments");
  return data;
};

export const createDepartment = async (deptData) => {
  const { data } = await api.post("/admin/departments", deptData);
  return data;
};

// === Teams ===
export const getTeams = async () => {
  const { data } = await api.get("/admin/teams");
  return data;
};

export const createTeam = async (teamData) => {
  const { data } = await api.post("/admin/teams", teamData);
  return data;
};
