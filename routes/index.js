const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');

// Rota de health check
router.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

// Rotas para Tarefas
router.post('/tarefas', tarefaController.criarTarefa);
router.get('/tarefas', tarefaController.listarTarefas);
router.get('/tarefas/:id', tarefaController.obterTarefa);
router.put('/tarefas/:id', tarefaController.atualizarTarefa);
router.delete('/tarefas/:id', tarefaController.excluirTarefa);

module.exports = router;