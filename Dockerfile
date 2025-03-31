FROM node:20-alpine
WORKDIR /app

# Instalação de dependências do sistema e git
RUN apk add --no-cache curl tzdata git

# Configurar timezone
ENV TZ=America/Sao_Paulo

# Clonar o repositório
RUN git clone https://github.com/rrm297/mcp-clinica-nas-nuvens-api.git /tmp/repo && \
    cp -r /tmp/repo/* /app/

# Modificar package.json para incluir dependência MCP
RUN sed -i 's/"dependencies": {/"dependencies": {\n    "@modelcontextprotocol\/server-http": "github:modelcontextprotocol\/servers#main",/' package.json

# Instalar dependências com logs detalhados para depuração
RUN npm install --verbose
RUN npm list | grep modelcontextprotocol || echo "Pacote não instalado!"

# Corrigir potencial problema de módulo não encontrado  
RUN npm install github:modelcontextprotocol/servers#main --save

# Porta que será exposta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
