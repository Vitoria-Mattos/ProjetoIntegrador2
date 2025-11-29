// backend/routes/livros.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Rota: listar livros disponíveis (exemplares_disponiveis > 0)
router.get('/disponiveis', (req, res) => {
  const sql = `
    SELECT id, titulo, autor, editora, ano_publicacao, categoria, exemplares_disponiveis
    FROM livros
    WHERE exemplares_disponiveis > 0
    ORDER BY titulo;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Erro ao buscar livros:', err);
      return res.status(500).json({ error: 'Erro ao buscar livros disponíveis.' });
    }
    res.json(results);
  });
});

module.exports = router;
