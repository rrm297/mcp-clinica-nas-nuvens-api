const express = require('express');
const cors = require('cors');
const { setupSSERoutes } = require('./sse-simple');
const pacienteRoutes = require('./routes/pacienteRoutes');
const profissionalRoutes = require('./routes/profissionalRoutes');
const agendaRoutes = require('./routes/agendaRoutes');
const atendimentoRoutes = require('./routes/atendimentoRoutes');
const { logger } = require('./utils/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging de requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Configurar rotas SSE
setupSSERoutes(app);

// Rotas da API
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/profissionais', profissionalRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/atendimentos', atendimentoRoutes);

// Tratamento de erros 404
app.use((req, res) => {
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
  // Emitir evento ready para hooks
  if (app.emit) {
    app.emit('ready');
  }
});

module.exports = app;
