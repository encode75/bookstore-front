// src/services/authService.js
import axios from 'axios';

// URL base do backend para autenticação 
const API_BASE_URL = 'http://localhost:3000'; 
const API_AUTH_URL = `${API_BASE_URL}/login`; // Endpoint específico

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Realiza a chamada POST para o endpoint de login.
 * @param {string} username - Nome de usuário.
 * @param {string} password - Senha.
 * @returns {Promise} Retorna a promessa da chamada Axios.
 */
export const login = async (username, password) => {
    // Rota: router.post('/login', userController.loginUser);
    return api.post('/login', { username, password });
};

