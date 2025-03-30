class Profissional {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.documento = data.documento;
    this.conselho = data.conselho;
    this.especialidade = data.especialidade;
    this.email = data.email;
    this.telefone = data.telefone;
    this.ativo = data.ativo;
  }
  
  static fromAPI(apiData) {
    return new Profissional({
      id: apiData.id,
      nome: apiData.nome,
      documento: apiData.documento,
      conselho: apiData.conselho,
      especialidade: apiData.especialidade,
      email: apiData.email,
      telefone: apiData.telefone,
      ativo: apiData.ativo !== false // default true
    });
  }
  
  toAPI() {
    return {
      id: this.id,
      nome: this.nome,
      documento: this.documento,
      conselho: this.conselho,
      especialidade: this.especialidade,
      email: this.email,
      telefone: this.telefone,
      ativo: this.ativo
    };
  }
}

module.exports = Profissional;