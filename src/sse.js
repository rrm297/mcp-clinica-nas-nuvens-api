const SSE = require('express-sse');
const { v4: uuidv4 } = require('uuid');
const { ResourceRegistry, ToolRegistry, PromptRegistry } = require('@modelcontextprotocol/sdk/server');

// Instância SSE global
const sse = new SSE();

// Registros para recursos MCP
const resourceRegistry = new ResourceRegistry();
const toolRegistry = new ToolRegistry();
const promptRegistry = new PromptRegistry();

// Cache de mensagens para manter estado entre conexões
const messageCache = {
  pending: new Map(),
  results: new Map()
};

// Ferramentas disponíveis para o cliente MCP
const setupTools = () => {
  // Ferramenta para listar pacientes
  toolRegistry.register({
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
    },
    execute: async ({ filtroNome, filtroCpf }) => {
      // Importar o serviço
      const pacienteService = require('./services/pacienteService');
      
      try {
        const filtros = {};
        if (filtroNome) filtros.nome = filtroNome;
        if (filtroCpf) filtros.cpf = filtroCpf;
        
        const pacientes = await pacienteService.listarPacientes(filtros);
        return pacientes;
      } catch (error) {
        throw new Error(`Erro ao listar pacientes: ${error.message}`);
      }
    }
  });
  
  // Ferramenta para buscar paciente por ID
  toolRegistry.register({
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
    },
    execute: async ({ id }) => {
      const pacienteService = require('./services/pacienteService');
      
      try {
        const paciente = await pacienteService.buscarPacientePorId(id);
        return paciente;
      } catch (error) {
        throw new Error(`Erro ao buscar paciente: ${error.message}`);
      }
    }
  });
  
  // Adicione mais ferramentas conforme necessário
};

// Configurar rotas SSE para Express
const setupSSERoutes = (app) => {
  // Inicializar ferramentas
  setupTools();
  
  // Endpoint SSE principal
  app.get('/sse', (req, res) => {
    sse.init(req, res);
  });
  
  // Endpoint para enviar mensagens para o servidor
  app.post('/api/messages', async (req, res) => {
    try {
      const message = req.body;
      const messageId = message.id || uuidv4();
      
      // Processar a mensagem com base no método
      if (message.method === 'tool/call') {
        const tool = toolRegistry.get(message.params.name);
        if (!tool) {
          return res.status(404).json({
            id: messageId,
            error: { code: -32601, message: `Ferramenta não encontrada: ${message.params.name}` }
          });
        }
        
        // Armazenar a mensagem pendente
        messageCache.pending.set(messageId, message);
        
        try {
          // Executar a ferramenta
          const result = await tool.execute(message.params.arguments || {});
          
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
        const tools = toolRegistry.list();
        const response = {
          id: messageId,
          result: { tools }
        };
        messageCache.results.set(messageId, response);
        sse.send(response, 'message');
        return res.status(200).json(response);
      } else if (message.method === 'resource/list') {
        // Listar recursos disponíveis
        const resources = resourceRegistry.list();
        const response = {
          id: messageId,
          result: resources
        };
        messageCache.results.set(messageId, response);
        sse.send(response, 'message');
        return res.status(200).json(response);
      } else if (message.method === 'prompt/list') {
        // Listar prompts disponíveis
        const prompts = promptRegistry.list();
        const response = {
          id: messageId,
          result: prompts
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
};

module.exports = {
  setupSSERoutes,
  sse
};
