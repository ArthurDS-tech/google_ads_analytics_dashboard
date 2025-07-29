import apiClient from '../utils/apiClient';

class ApiUmbler {
  async getClientes() {
    // Busca todos os clientes do backend
    return await apiClient.get('/clientes');
  }

  async getMensagensCliente(clienteId) {
    // Busca as mensagens de um cliente específico
    return await apiClient.get(`/clientes/${clienteId}/mensagens`);
  }
}

export default new ApiUmbler();