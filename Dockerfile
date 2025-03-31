FROM node:20-alpine
WORKDIR /app

# Instalação de dependências do sistema e git
RUN apk add --no-cache curl tzdata git

# Configurar timezone
ENV TZ=America/Sao_Paulo

# Clonar o repositório
RUN git clone https://github.com/rrm297/mcp-clinica-nas-nuvens-api.git /tmp/repo && \
    cp -r /tmp/repo/* /app/

# Clonar diretamente o repositório MCP para o node_modules
RUN mkdir -p /app/node_modules/@modelcontextprotocol && \
    git clone https://github.com/modelcontextprotocol/servers.git /app/node_modules/@modelcontextprotocol/server-http

# Instalar outras dependências do projeto
RUN npm install --ignore-scripts

# Verificar a estrutura de diretórios para debug
RUN ls -la /app/node_modules/@modelcontextprotocol/server-http

# Porta que será exposta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
