const setupSSERoutes = (app) => {
  console.log('Configurando rotas SSE');

  // Rota SSE com tratamento explícito
  app.get('/sse', (req, res) => {
    console.log('Conexão SSE recebida', {
      headers: req.headers,
      method: req.method
    });

    // Cabeçalhos CORS explícitos
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-open');

    // Manter conexão aberta
    req.on('close', () => {
      console.log('Cliente SSE desconectado');
    });

    // Inicialização SSE
    try {
      sse.init(req, res);
    } catch (error) {
      console.error('Erro na inicialização SSE:', error);
      res.status(500).json({ error: 'Falha na inicialização SSE' });
    }
  });
};
