FROM node:20-alpine
WORKDIR /app
# Instalação de dependências do sistema
RUN apk add --no-cache curl tzdata
# Configurar timezone
ENV TZ=America/Sao_Paulo
# Copiar arquivos de projeto
COPY package*.json ./
# Instalar dependências
RUN npm install
# Copiar resto do código
COPY . .
# Porta que será exposta
EXPOSE 3000
# Comando para iniciar a aplicação
CMD ["npm", "start"]
