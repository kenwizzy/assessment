
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://backend:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getTodos = async () => {
  const response = await api.get('/todos');
  return response.data?.data ?? response.data ?? [];
};


export const createTodo = async (title) => {
  const response = await api.post('/todos', { title });
  return response.data?.data ?? response.data;
};

export const updateTodo = async (id, updates) => {
  const response = await api.put(`/todos/${id}`, updates);
  return response.data?.data ?? response.data;
};

export const deleteTodo = async (id) => {
  await api.delete(`/todos/${id}`);
  return true;
};

export const reorderTodos = async (orderData) => {
  const response = await api.post('/todos/reorder', {orderData});
  return response.data;
};

export const clearCompleted = async () => {
  await api.delete('/todos/clear-completed'); 
  return true;
};

export default api;