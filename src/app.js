const express = require('express');
const cors = require('cors');
const { setupSSERoutes } = require('./sse-simple');

const app = express();

// Configurar CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'clinicaNasNuvens-cid']
}));

// Middleware para parsing JSON
app.use(express.json());

// Logging de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Configurar rotas SSE
setupSSERoutes(app);

// Rotas da API
app.get('/api/pacientes', (req, res) => {
  res.json([{id: "123", nome: "Exemplo Paciente"}]);
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Tratamento de erros globais
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
