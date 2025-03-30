/**
 * Configurações de autenticação para a API da Clínica nas Nuvens
 */
const auth = {
  baseURL: process.env.CLINICA_NAS_NUVENS_API_URL || 'https://api.clinicanasnuvens.com.br',
  clientId: process.env.CLINICA_NAS_NUVENS_CLIENT_ID,
  clientSecret: process.env.CLINICA_NAS_NUVENS_CLIENT_SECRET,
  cid: process.env.CLINICA_NAS_NUVENS_CID,
  
  // Obtém a string de autenticação Basic em formato Base64
  getBasicAuth() {
    return Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
  }
};

module.exports = auth;
