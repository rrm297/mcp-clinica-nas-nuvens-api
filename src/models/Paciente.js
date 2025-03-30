class Paciente {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.cpf = data.cpf;
    this.dataNascimento = data.dataNascimento;
    this.sexo = data.sexo;
    this.telefone = data.telefone;
    this.email = data.email;
    this.endereco = data.endereco;
    this.convenio = data.convenio;
    this.numeroCarteira = data.numeroCarteira;
    this.observacoes = data.observacoes;
    this.ativo = data.ativo;
  }
  
  static fromAPI(apiData) {
    return new Paciente({
      id: apiData.id,
      nome: apiData.nome,
      cpf: apiData.cpf,
      dataNascimento: apiData.dataNascimento,
      sexo: apiData.sexo,
      telefone: apiData.telefone,
      email: apiData.email,
      endereco: {
        logradouro: apiData.logradouro,
        numero: apiData.numero,
        complemento: apiData.complemento,
        bairro: apiData.bairro,
        cidade: apiData.cidade,
        estado: apiData.estado,
        cep: apiData.cep
      },
      convenio: apiData.convenio,
      numeroCarteira: apiData.numeroCarteira,
      observacoes: apiData.observacoes,
      ativo: apiData.ativo !== false // default true
    });
  }
  
  toAPI() {
    return {
      id: this.id,
      nome: this.nome,
      cpf: this.cpf,
      dataNascimento: this.dataNascimento,
      sexo: this.sexo,
      telefone: this.telefone,
      email: this.email,
      logradouro: this.endereco?.logradouro,
      numero: this.endereco?.numero,
      complemento: this.endereco?.complemento,
      bairro: this.endereco?.bairro,
      cidade: this.endereco?.cidade,
      estado: this.endereco?.estado,
      cep: this.endereco?.cep,
      convenio: this.convenio,
      numeroCarteira: this.numeroCarteira,
      observacoes: this.observacoes,
      ativo: this.ativo
    };
  }
}

module.exports = Paciente;