export const baseURL = "http://localhost:5000";
export const myHeaders = { Authorization: localStorage.getItem("token") };
export const today = new Date().toISOString().split("T")[0];
