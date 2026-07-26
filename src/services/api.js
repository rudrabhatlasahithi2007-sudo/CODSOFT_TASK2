import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT bearer token to requests
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('taskpulse_user') || 'null');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const loginApi = (email, password) => API.post('/auth/login', { email, password });
export const registerApi = (data) => API.post('/auth/register', data);
export const getMeApi = () => API.get('/auth/me');

// Project Services
export const fetchProjectsApi = (params) => API.get('/projects', { params });
export const fetchProjectByIdApi = (id) => API.get(`/projects/${id}`);
export const createProjectApi = (data) => API.post('/projects', data);
export const updateProjectApi = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProjectApi = (id) => API.delete(`/projects/${id}`);

// Task Services
export const fetchTasksApi = (params) => API.get('/tasks', { params });
export const fetchTaskByIdApi = (id) => API.get(`/tasks/${id}`);
export const createTaskApi = (data) => API.post('/tasks', data);
export const updateTaskApi = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTaskApi = (id) => API.delete(`/tasks/${id}`);
export const addCommentApi = (id, content) => API.post(`/tasks/${id}/comments`, { content });
export const uploadAttachmentApi = (id, formData) => API.post(`/tasks/${id}/attachments`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// User & Analytics Services
export const fetchUsersApi = () => API.get('/users');
export const fetchUserDetailsApi = (id) => API.get(`/users/${id}`);
export const updateProfileApi = (id, data) => API.put(`/users/${id}`, data);
export const fetchAnalyticsApi = () => API.get('/analytics');

export default API;
