class Atendimento {
  constructor(data) {
    this.id = data.id;
    this.agendaId = data.agendaId;
    this.profissionalId = data.profissionalId;
    this.pacienteId = data.pacienteId;
    this.dataAtendimento = data.dataAtendimento;
    this.queixa = data.queixa;
    this.historico = data.historico;
    this.examesFisicos = data.examesFisicos;
    this.diagnostico = data.diagnostico;
    this.conduta = data.conduta;
    this.receituario = data.receituario;
    this.examesComplementares = data.examesComplementares;
    this.status = data.status; // EM_ANDAMENTO, FINALIZADO
  }
  
  static fromAPI(apiData) {
    return new Atendimento({
      id: apiData.id,
      agendaId: apiData.agendaId,
      profissionalId: apiData.profissionalId,
      pacienteId: apiData.pacienteId,
      dataAtendimento: apiData.dataAtendimento,
      queixa: apiData.queixa,
      historico: apiData.historico,
      examesFisicos: apiData.examesFisicos,
      diagnostico: apiData.diagnostico,
      conduta: apiData.conduta,
      receituario: apiData.receituario,
      examesComplementares: apiData.examesComplementares,
      status: apiData.status
    });
  }
  
  toAPI() {
    return {
      id: this.id,
      agendaId: this.agendaId,
      profissionalId: this.profissionalId,
      pacienteId: this.pacienteId,
      dataAtendimento: this.dataAtendimento,
      queixa: this.queixa,
      historico: this.historico,
      examesFisicos: this.examesFisicos,
      diagnostico: this.diagnostico,
      conduta: this.conduta,
      receituario: this.receituario,
      examesComplementares: this.examesComplementares,
      status: this.status
    };
  }
}

module.exports = Atendimento;