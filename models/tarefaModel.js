const { query } = require('../config/database');

module.exports = {
  async criar(titulo, nota, prazo_conclusao) {
    const result = await query(
      `INSERT INTO Tarefas (titulo, nota, prazo_conclusao) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [titulo, nota, prazo_conclusao]
    );
    return result.rows[0];
  },

  async listar() {
    const result = await query(
      `SELECT id, titulo, nota, data_criacao, prazo_conclusao 
       FROM Tarefas 
       ORDER BY data_criacao DESC`
    );
    return result.rows;
  },

  async buscarPorId(id) {
    const result = await query(
      `SELECT * FROM Tarefas WHERE id = $1`, 
      [id]
    );
    return result.rows[0];
  },

  async atualizar(id, titulo, nota, prazo_conclusao) {
    const result = await query(
      `UPDATE Tarefas 
       SET titulo = $1, nota = $2, prazo_conclusao = $3 
       WHERE id = $4 
       RETURNING *`,
      [titulo, nota, prazo_conclusao, id]
    );
    return result.rows[0];
  },

  async deletar(id) {
    const result = await query(
      `DELETE FROM Tarefas 
       WHERE id = $1 
       RETURNING id, titulo`,
      [id]
    );
    return result.rows[0];
  }
};