const axios = require('axios');
const auth = require('./auth');
const { logger } = require('../utils/logger');

const api = axios.create({
  baseURL: auth.baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para autenticação automática
api.interceptors.request.use(async (config) => {
  if (auth.isTokenExpired()) {
    try {
      const response = await axios.post(`${auth.baseURL}/api/login`, {
        username: auth.username,
        password: auth.password
      });
      
      auth.setToken(
        response.data.token,
        response.data.expiresIn || 3600 // Padrão de 1 hora
      );
    } catch (error) {
      logger.error('Erro ao obter token de autenticação', error);
      throw new Error('Falha na autenticação com a API da Clínica nas Nuvens');
    }
  }
  
  config.headers.Authorization = `Bearer ${auth.token}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para tratamento de erros nas respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      logger.error(`Erro na requisição: Status ${error.response.status}`, {
        data: error.response.data,
        method: error.config.method,
        url: error.config.url
      });
      
      // Se token expirado, invalidar token atual
      if (error.response.status === 401) {
        auth.token = null;
        auth.expiresAt = null;
      }
    } else {
      logger.error('Erro na comunicação com a API', error);
    }
    
    return Promise.reject(error);
  }
);

module.exports = api;