// routes/index.js
const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

// Rotas para o CRUD de usuários
router.post('/Usuário', UsuarioController.criarUsuario);
router.get('/Usuário', UsuarioController.listarUsuarios);
router.put('/Usuário/:id', UsuarioController.editarUsuario);
router.delete('/Usuário/:id', UsuarioController.excluirUsuario);

module.exports = router;