import apiClient from '../utils/apiClient';

class ApiUmbler {
  async getClientes(params = {}) {
    // Busca todos os contatos do backend
    return await apiClient.get('/contacts', params);
  }

  async getMensagensCliente(contactId, params = {}) {
    // Busca as mensagens de um contato específico
    return await apiClient.get(`/messages/contact/${contactId}`, params);
  }
}

export default new ApiUmbler();