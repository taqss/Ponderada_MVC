// Testes para o Gerenciador de Tarefas
const request = require('supertest');
const express = require('express');

// Mock do banco de dados para testes
jest.mock('../config/database', () => ({
  query: jest.fn()
}));

const app = express();
app.use(express.json());

// Importar rotas após o mock
const routes = require('../routes');
app.use('/api', routes);

describe('API de Tarefas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/health', () => {
    test('deve retornar status UP', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'UP' });
    });
  });

  describe('GET /api/tarefas', () => {
    test('deve listar tarefas', async () => {
      const mockTarefas = [
        {
          id: 1,
          titulo: 'Teste',
          nota: 'Descrição teste',
          data_criacao: new Date().toISOString(),
          prazo_conclusao: null
        }
      ];

      const { query } = require('../config/database');
      query.mockResolvedValue({ rows: mockTarefas });

      const response = await request(app)
        .get('/api/tarefas')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/tarefas', () => {
    test('deve criar nova tarefa', async () => {
      const novaTarefa = {
        titulo: 'Nova Tarefa',
        nota: 'Descrição da nova tarefa',
        prazo_conclusao: '2024-12-31'
      };

      const mockResult = {
        id: 1,
        ...novaTarefa,
        data_criacao: new Date().toISOString()
      };

      const { query } = require('../config/database');
      query.mockResolvedValue({ rows: [mockResult] });

      const response = await request(app)
        .post('/api/tarefas')
        .send(novaTarefa)
        .expect(201);

      expect(response.body.titulo).toBe(novaTarefa.titulo);
    });

    test('deve retornar erro se título não fornecido', async () => {
      const tarefaInvalida = {
        nota: 'Sem título'
      };

      const response = await request(app)
        .post('/api/tarefas')
        .send(tarefaInvalida)
        .expect(400);

      expect(response.body.error).toBe('O título é obrigatório');
    });
  });
});

// Testes unitários para utilitários
describe('Utilitários', () => {
  test('deve formatar data corretamente', () => {
    // Como os utilitários são frontend, testamos a lógica aqui
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    };

    const testDate = '2024-01-15T10:30:00Z';
    const formatted = formatDate(testDate);

    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  test('deve verificar se data está vencida', () => {
    const isOverdue = (dateString) => {
      if (!dateString) return false;
      const deadline = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return deadline < today;
    };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    expect(isOverdue(yesterday.toISOString())).toBe(true);
    expect(isOverdue(tomorrow.toISOString())).toBe(false);
  });
});