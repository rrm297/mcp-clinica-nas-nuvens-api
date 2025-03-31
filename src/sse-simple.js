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
  
  // Endpoint para enviar mensagens ao servidor
  app.post('/api/messages', async (req, res) => {
    try {
      const message = req.body;
      const messageId = message.id || uuidv4();
      
      console.log('Mensagem recebida', {
        message,
        messageId,
        timestamp: new Date().toISOString()
      });
      
      // Processar a mensagem com base no método
      if (message.method === 'tool/call') {
        // Exemplo: Chamar uma função da API de pacientes
        const pacienteService = require('./services/pacienteService');
        
        try {
          let result;
          
          // Baseado no nome da ferramenta, chamar o serviço apropriado
          if (message.params.name === 'listarPacientes') {
            result = await pacienteService.listarPacientes(message.params.arguments || {});
          } else if (message.params.name === 'buscarPacientePorId') {
            if (!message.params.arguments?.id) {
              throw new Error('ID do paciente é obrigatório');
            }
            result = await pacienteService.buscarPacientePorId(message.params.arguments.id);
          } else {
            throw new Error(`Ferramenta não encontrada: ${message.params.name}`);
          }
          
          // Armazenar o resultado
          const response = {
            id: messageId,
            result
          };
          messageCache.results.set(messageId, response);
          
          // Enviar o resultado via SSE
          sse.send(response, 'message');
          
          return res.status(200).json(response);
        } catch (error) {
          const errorResponse = {
            id: messageId,
            error: { code: -32000, message: error.message }
          };
          messageCache.results.set(messageId, errorResponse);
          sse.send(errorResponse, 'message');
          return res.status(500).json(errorResponse);
        }
      } else if (message.method === 'tool/list') {
        // Listar ferramentas disponíveis
        const tools = [
          {
            name: 'listarPacientes',
            description: 'Lista todos os pacientes cadastrados na Clínica nas Nuvens',
            inputSchema: {
              type: 'object',
              properties: {
                filtroNome: {
                  type: 'string',
                  description: 'Filtrar pacientes por nome (opcional)'
                },
                filtroCpf: {
                  type: 'string',
                  description: 'Filtrar pacientes por CPF (opcional)'
                }
              }
            }
          },
          {
            name: 'buscarPacientePorId',
            description: 'Busca um paciente pelo ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'ID do paciente',
                  required: true
                }
              }
            }
          }
        ];
        
        const response = {
          id: messageId,
          result: { tools }
        };
        messageCache.results.set(messageId, response);
        sse.send(response, 'message');
        return res.status(200).json(response);
      } else {
        // Método não suportado
        const errorResponse = {
          id: messageId,
          error: { code: -32601, message: `Método não suportado: ${message.method}` }
        };
        messageCache.results.set(messageId, errorResponse);
        sse.send(errorResponse, 'message');
        return res.status(400).json(errorResponse);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      return res.status(500).json({
        id: req.body.id || uuidv4(),
        error: { code: -32000, message: error.message }
      });
    }
  });

  // Adicionar rota OPTIONS para pré-flight CORS
  app.options('/sse', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
  });
};

module.exports = {
  setupSSERoutes,
  sse
};
