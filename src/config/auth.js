const auth = {
  baseURL: process.env.CLINICA_NAS_NUVENS_API_URL || 'https://api.clinicanasnuvens.com.br',
  username: process.env.CLINICA_NAS_NUVENS_USERNAME,
  password: process.env.CLINICA_NAS_NUVENS_PASSWORD,
  token: null,
  expiresAt: null,

  isTokenExpired() {
    if (!this.token || !this.expiresAt) {
      return true;
    }
    return new Date() >= this.expiresAt;
  },

  setToken(token, expiresIn) {
    this.token = token;
    this.expiresAt = new Date(Date.now() + expiresIn * 1000);
  }
};

module.exports = auth;