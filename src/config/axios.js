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

// Interceptor para adicionar cabeçalhos de autenticação
api.interceptors.request.use(async (config) => {
  // Adicionar autenticação Basic
  config.headers.Authorization = `Basic ${auth.getBasicAuth()}`;
  
  // Adicionar o token CID ao cabeçalho
  if (auth.cid) {
    config.headers['clinicaNasNuvens-cid'] = auth.cid;
  }
  
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
      
      // Se token expirado ou credenciais inválidas
      if (error.response.status === 401) {
        logger.error('Credenciais inválidas ou expiradas');
      }
    } else {
      logger.error('Erro na comunicação com a API', error);
    }
    
    return Promise.reject(error);
  }
);

module.exports = api;
