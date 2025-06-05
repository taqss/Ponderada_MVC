// controllers/tarefaController.js
const pool = require('../config/database');

// Helper para formatar datas e padronizar resposta
const formatarTarefa = (tarefa) => ({
  id: tarefa.id,
  titulo: tarefa.titulo,
  nota: tarefa.nota,
  data_criacao: new Date(tarefa.data_criacao).toISOString(),
  prazo_conclusao: tarefa.prazo_conclusao ? new Date(tarefa.prazo_conclusao).toISOString() : null
});

exports.criarTarefa = async (req, res) => {
  const { titulo, nota, prazo_conclusao } = req.body;
  
  try {
    // Validação mínima
    if (!titulo) {
      return res.status(400).json({ error: 'O título é obrigatório' });
    }

    const query = `
      INSERT INTO Tarefas (titulo, nota, prazo_conclusao) 
      VALUES ($1, $2, $3) 
      RETURNING *`;
    
    const result = await pool.query(query, [
      titulo, 
      nota || null, 
      prazo_conclusao || null
    ]);
    
    res.status(201).json(formatarTarefa(result.rows[0]));
    
  } catch (err) {
    console.error('Erro ao criar tarefa:', err);
    res.status(500).json({ 
      error: 'Erro ao criar tarefa',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
};

exports.listarTarefas = async (req, res) => {
  try {
    const query = `
      SELECT id, titulo, nota, data_criacao, prazo_conclusao
      FROM Tarefas 
      ORDER BY data_criacao DESC`;
    
    const result = await pool.query(query);
    res.status(200).json(result.rows.map(formatarTarefa));
    
  } catch (err) {
    console.error('Erro ao listar tarefas:', err);
    res.status(500).json({ 
      error: 'Erro ao listar tarefas',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
};

exports.obterTarefa = async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = `
      SELECT id, titulo, nota, data_criacao, prazo_conclusao
      FROM Tarefas 
      WHERE id = $1`;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.status(200).json(formatarTarefa(result.rows[0]));
    
  } catch (err) {
    console.error('Erro ao obter tarefa:', err);
    res.status(500).json({ 
      error: 'Erro ao obter tarefa',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
};

exports.atualizarTarefa = async (req, res) => {
  const { id } = req.params;
  const { titulo, nota, prazo_conclusao } = req.body;
  
  try {
    if (!titulo) {
      return res.status(400).json({ error: 'O título é obrigatório' });
    }

    const query = `
      UPDATE Tarefas 
      SET titulo = $1, 
          nota = $2, 
          prazo_conclusao = $3
      WHERE id = $4
      RETURNING *`;
    
    const result = await pool.query(query, [
      titulo, 
      nota || null, 
      prazo_conclusao || null, 
      id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.status(200).json(formatarTarefa(result.rows[0]));
    
  } catch (err) {
    console.error('Erro ao atualizar tarefa:', err);
    res.status(500).json({ 
      error: 'Erro ao atualizar tarefa',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
};

exports.concluirTarefa = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      DELETE FROM Tarefas
      WHERE id = $1
      RETURNING id, titulo`;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.status(200).json({
      success: true,
      message: 'Tarefa marcada como concluída!',
      tarefa: {
        id: result.rows[0].id,
        titulo: result.rows[0].titulo
      }
    });

  } catch (err) {
    console.error('Erro ao concluir tarefa:', err);
    res.status(500).json({
      error: 'Erro ao concluir tarefa',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
};

exports.excluirTarefa = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      DELETE FROM Tarefas
      WHERE id = $1
      RETURNING id, titulo`;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.status(200).json({
      success: true,
      message: 'Tarefa excluída com sucesso',
      tarefa: {
        id: result.rows[0].id,
        titulo: result.rows[0].titulo
      }
    });

  } catch (err) {
    console.error('Erro ao excluir tarefa:', err);
    res.status(500).json({
      error: 'Erro ao excluir tarefa',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
};