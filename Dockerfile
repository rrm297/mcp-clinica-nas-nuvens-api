FROM node:18-alpine

WORKDIR /app

# Instalação de dependências do sistema
RUN apk add --no-cache curl tzdata

# Configurar timezone
ENV TZ=America/Sao_Paulo

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código-fonte
COPY . .

# Criar arquivo de health check
RUN echo '#!/bin/sh\n\
curl -f http://localhost:${PORT:-3000}/health || exit 1' > /app/health-check.sh && \
chmod +x /app/health-check.sh

# Porta que será exposta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
