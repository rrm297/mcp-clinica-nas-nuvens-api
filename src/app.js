const express = require('express');
const cors = require('cors');
const { setupSSERoutes } = require('./sse-simple');
const pacienteRoutes = require('./routes/pacienteRoutes');
const profissionalRoutes = require('./routes/profissionalRoutes');
const agendaRoutes = require('./routes/agendaRoutes');
const atendimentoRoutes = require('./routes/atendimentoRoutes');
const { logger } = require('./utils/logger');
const app = express();

// Middleware de diagnóstico
app.use((req, res, next) => {
  console.log(`[DIAGNÓSTICO] Requisição recebida: ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Logging de requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Log de diagnóstico de importação
console.log('Importando rotas SSE');
console.log('Função setupSSERoutes:', typeof setupSSERoutes);

// Configurar rotas SSE primeiro
try {
  setupSSERoutes(app);
  console.log('Rotas SSE configuradas com sucesso');
} catch (error) {
  console.error('Erro ao configurar rotas SSE:', error);
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Log de diagnóstico de rotas
console.log('Configurando rotas da API');

// Rotas da API
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/profissionais', profissionalRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/atendimentos', atendimentoRoutes);

// Log de rotas registradas
console.log('Rotas registradas:');
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Rota: ${r.route.path}`);
  }
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  console.log(`[DIAGNÓSTICO] Rota não encontrada: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Tratamento de erros globais
app.use((err, req, res, next) => {
  logger.error('Erro não tratado:', err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
  
  // Log adicional de diagnóstico
  console.log('Servidor iniciado. Rotas configuradas:');
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log(`Rota: ${r.route.path}`);
    }
  });

  // Emitir evento ready para hooks
  if (app.emit) {
    app.emit('ready');
  }
});

module.exports = app;
