class Agenda {
  constructor(data) {
    this.id = data.id;
    this.profissionalId = data.profissionalId;
    this.pacienteId = data.pacienteId;
    this.data = data.data;
    this.horaInicio = data.horaInicio;
    this.horaFim = data.horaFim;
    this.status = data.status; // AGENDADO, CONFIRMADO, REALIZADO, CANCELADO
    this.tipo = data.tipo; // CONSULTA, RETORNO, EXAME
    this.observacoes = data.observacoes;
    this.convenio = data.convenio;
  }
  
  static fromAPI(apiData) {
    return new Agenda({
      id: apiData.id,
      profissionalId: apiData.profissionalId,
      pacienteId: apiData.pacienteId,
      data: apiData.data,
      horaInicio: apiData.horaInicio,
      horaFim: apiData.horaFim,
      status: apiData.status,
      tipo: apiData.tipo,
      observacoes: apiData.observacoes,
      convenio: apiData.convenio
    });
  }
  
  toAPI() {
    return {
      id: this.id,
      profissionalId: this.profissionalId,
      pacienteId: this.pacienteId,
      data: this.data,
      horaInicio: this.horaInicio,
      horaFim: this.horaFim,
      status: this.status,
      tipo: this.tipo,
      observacoes: this.observacoes,
      convenio: this.convenio
    };
  }
}

module.exports = Agenda;