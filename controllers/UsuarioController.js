// controllers/UsuarioController.js
const pool = require('../config/database');

// Criar um novo usuário
exports.criarUsuario = async (req, res) => {
  const { nome, idade } = req.body;

  const query = 'INSERT INTO Usuário (nome, idade,) VALUES ($1, $2) RETURNING *';
  const values = [nome, idade];

  try {
    const result = await pool.query(query, values);
    const usuario = result.rows[0];
    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  const query = 'SELECT * FROM Usuário';

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar dados de um usuário
exports.editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, idade, email } = req.body;

  const query = `
    UPDATE Usuário SET nome = $1, idade = $2, email = $3, updated_at = CURRENT_TIMESTAMP
    WHERE id = $4 RETURNING *`;
  const values = [nome, idade, email, id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário(a) não encontrado(a)' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Excluir um usuário
exports.excluirUsuario = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM Usuário WHERE id = $1 RETURNING *';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário(a) não encontrado(a)' });
    }
    res.status(200).json({ message: 'Usuário(a) excluído(a) com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};