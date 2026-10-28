import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

export const getProperties = () => API.get("/properties");
export const loginUser = (data) => API.post("/auth/login", data);
export const loginSuperAdmin = (data) => API.post("/superadmin/login", data);
export const logoutSuperAdmin = () => API.post("/superadmin/logout");
export const submitEnquiry = (data) => API.post("/enquiries", data);
export const submitAgencyApplication = (data) =>
  API.post("/agency-applications", data);
export const getAdminEnquiries = () => API.get("/superadmin/enquiries");
export const updateEnquiryStatus = (id, status) =>
  API.patch(`/superadmin/enquiries/${id}/status`, { status });
export const getAgencyApplications = () =>
  API.get("/superadmin/agency-applications");
export const updateAgencyApplicationStatus = (id, status) =>
  API.patch(`/superadmin/agency-applications/${id}/status`, { status });