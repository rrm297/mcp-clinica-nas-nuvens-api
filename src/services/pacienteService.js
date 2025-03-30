const api = require('../config/axios');
const Paciente = require('../models/Paciente');
const { logger } = require('../utils/logger');

class PacienteService {
  async listarPacientes(filtros = {}) {
    try {
      const params = {};
      
      if (filtros.nome) params.nome = filtros.nome;
      if (filtros.cpf) params.cpf = filtros.cpf;
      if (filtros.ativo !== undefined) params.ativo = filtros.ativo;
      
      const response = await api.get('/api/pacientes', { params });
      
      return response.data.map(pacienteData => Paciente.fromAPI(pacienteData));
    } catch (error) {
      logger.error('Erro ao listar pacientes', error);
      throw error;
    }
  }
  
  async buscarPacientePorId(id) {
    try {
      const response = await api.get(`/api/pacientes/${id}`);
      
      return Paciente.fromAPI(response.data);
    } catch (error) {
      logger.error(`Erro ao buscar paciente id=${id}`, error);
      throw error;
    }
  }
  
  async buscarPacientePorCpf(cpf) {
    try {
      const response = await api.get(`/api/pacientes/cpf/${cpf}`);
      
      return Paciente.fromAPI(response.data);
    } catch (error) {
      logger.error(`Erro ao buscar paciente por CPF=${cpf}`, error);
      throw error;
    }
  }
  
  async criarPaciente(pacienteData) {
    try {
      const paciente = new Paciente(pacienteData);
      const response = await api.post('/api/pacientes', paciente.toAPI());
      
      return Paciente.fromAPI(response.data);
    } catch (error) {
      logger.error('Erro ao criar paciente', error);
      throw error;
    }
  }
  
  async atualizarPaciente(id, pacienteData) {
    try {
      // Garantir que o id no objeto corresponde ao id do path
      pacienteData.id = id;
      
      const paciente = new Paciente(pacienteData);
      const response = await api.put(`/api/pacientes/${id}`, paciente.toAPI());
      
      return Paciente.fromAPI(response.data);
    } catch (error) {
      logger.error(`Erro ao atualizar paciente id=${id}`, error);
      throw error;
    }
  }
  
  async desativarPaciente(id) {
    try {
      const response = await api.delete(`/api/pacientes/${id}`);
      return response.status === 200 || response.status === 204;
    } catch (error) {
      logger.error(`Erro ao desativar paciente id=${id}`, error);
      throw error;
    }
  }
}

module.exports = new PacienteService();