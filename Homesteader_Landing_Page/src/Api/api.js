import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

export const getProperties = () => API.get("/properties");
export const loginUser = (data) => API.post("/auth/login", data);
export const loginSuperAdmin = (data) => API.post("/superadmin/login", data);
export const logoutSuperAdmin = () => API.post("/superadmin/logout");
export const registerSuperAdmin = (data) => API.post("/superadmin/admins", data);
export const getSubAdmins = () => API.get("/fetchdata");
export const registerSubAdmin = (data) => API.post("/saveSub", data);
export const updateSubAdmin = (id, data) => API.put(`/updateSub/${id}`, data);
export const deleteSubAdmin = (id) => API.delete(`/deleteSub/${id}`);
export const submitEnquiry = (data) => API.post("/enquiries", data);
export const submitAgencyApplication = (data) =>
  API.post("/agency", {
    aaname: data.agencyName.trim(),
    aacontact: data.contactName.trim(),
    aaemail: data.email.trim(),
    aamobile: data.phone.trim(),
    aaplace: data.serviceArea.trim(),
    aanote: data.description.trim(),
  });
export const getAdminEnquiries = () => API.get("/superadmin/enquiries");
export const updateEnquiryStatus = (id, status) =>
  API.patch(`/superadmin/enquiries/${id}/status`, { status });
export const getAgencyApplications = () =>
  API.get("/superadmin/agency-applications");
export const updateAgencyApplicationStatus = (id, status) =>
  API.patch(`/superadmin/agency-applications/${id}/status`, { status });