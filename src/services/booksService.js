import axios from 'axios';

// URL base do backend
const API_URL = 'http://localhost:3000/books'; 
// Token de autenticação entraria aqui.

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`, // Exemplo de token
  },
});

export const createBook = (bookData) => api.post('/', bookData);
export const getAllBooks = () => api.get('/');
export const updateBook = (id, bookData) => {
    console.log(`ID que vem de parâmetro: ${id}`);
    console.log("Dados:", bookData);
    api.put(`/${id}`, bookData);
}
export const deleteBook = (id) => api.delete(`/${id}`);