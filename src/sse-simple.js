const SSE = require('express-sse');
const { v4: uuidv4 } = require('uuid');

// Instância SSE global
const sse = new SSE();

// Cache de mensagens
const messageCache = {
  pending: new Map(),
  results: new Map()
};

// Configurar rotas SSE para Express
const setupSSERoutes = (app) => {
  console.log('Configurando rotas SSE');

  // Endpoint SSE principal
  app.get('/sse', (req, res) => {
    console.log('Tentativa de conexão SSE', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });
    
    // Adicionar cabeçalhos de CORS explícitos
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    sse.init(req, res);
  });
  
  // Resto do código permanece igual ao anteriormente compartilhado
};

module.exports = {
  setupSSERoutes,
  sse
};
