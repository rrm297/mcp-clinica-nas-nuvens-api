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
  // Endpoint SSE principal
  app.get('/sse', (req, res) => {
    // Headers específicos para SSE e CORS
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Inicializar conexão SSE
    sse.init(req, res);
    
    // Enviar um evento inicial para confirmar conexão
    sse.send({type: 'connection', status: 'established', id: uuidv4()}, 'connection');
    
    // Gerenciar desconexão
    req.on('close', () => {
      console.log('Cliente SSE desconectado');
    });
  });
  
  // Configurar CORS para o endpoint de mensagens
  app.options('/api/messages', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, clinicaNasNuvens-cid');
    res.status(200).end();
  });
  
  // Endpoint para enviar mensagens ao servidor
  app.post('/api/messages', async (req, res) => {
    // Configurar CORS para a resposta
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
      console.log('Recebido POST em /api/messages:', JSON.stringify(req.body));
      
      const message = req.body;
      const messageId = message.id || uuidv4();
      
      // Processar a mensagem com base no método
      if (message.method === 'tool/call') {
        try {
          let result;
          
          // Baseado no nome da ferramenta, chamar o serviço apropriado
          if (message.params.name === 'listarPacientes') {
            result = [{id: "123", nome: "Exemplo Paciente"}];
          } else if (message.params.name === 'buscarPacientePorId') {
            if (!message.params.arguments?.id) {
              throw new Error('ID do paciente é obrigatório');
            }
            result = {id: message.params.arguments.id, nome: "Exemplo Paciente"};
          } else {
            throw new Error(`Ferramenta não encontrada: ${message.params.name}`);
          }
          
          // Armazenar o resultado
          const response = {
            jsonrpc: "2.0",
            id: messageId,
            result
          };
          messageCache.results.set(messageId, response);
          
          // Enviar o resultado via SSE
          sse.send(response, 'message');
          
          return res.status(200).json(response);
        } catch (error) {
          const errorResponse = {
            jsonrpc: "2.0",
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
                  description: 'ID do paciente'
                }
              },
              required: ['id']
            }
          }
        ];
        
        const response = {
          jsonrpc: "2.0",
          id: messageId,
          result: { tools }
        };
        messageCache.results.set(messageId, response);
        sse.send(response, 'message');
        return res.status(200).json(response);
      } else if (message.method === 'resource/list') {
        // Mock para resource/list
        const response = {
          jsonrpc: "2.0",
          id: messageId,
          result: []
        };
        sse.send(response, 'message');
        return res.status(200).json(response);
      } else if (message.method === 'prompt/list') {
        // Mock para prompt/list
        const response = {
          jsonrpc: "2.0",
          id: messageId,
          result: []
        };
        sse.send(response, 'message');
        return res.status(200).json(response);
      } else {
        // Método não suportado
        const errorResponse = {
          jsonrpc: "2.0",
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
        jsonrpc: "2.0",
        id: req.body.id || uuidv4(),
        error: { code: -32000, message: error.message }
      });
    }
  });
};

module.exports = {
  setupSSERoutes,
  sse
};
