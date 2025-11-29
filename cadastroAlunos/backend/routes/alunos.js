// backend/routes/alunos.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Validadores
function validateEmail(email){ return /^[a-zA-Z0-9._%+-]+@puccampinas\.edu\.br$/.test(email); }
function validateRA(ra){ return /^\d{8}$/.test(ra); }
function validateTelefone(tel){ return /^\(19\)\s?\d{4,5}-\d{4}$/.test(tel); }

// LISTAR TODOS
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM alunos ORDER BY id DESC';
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar alunos.' });
    res.json(results);
  });
});

// BUSCAR POR RA
router.get('/:ra', (req, res) => {
  const { ra } = req.params;

  const sql = 'SELECT * FROM alunos WHERE ra = ? LIMIT 1';
  db.query(sql, [ra], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor.' });
    if (results.length === 0) return res.status(404).json({ error: 'Aluno não encontrado.' });
    res.json(results[0]);
  });
});

// CADASTRAR
router.post('/', (req, res) => {
  const { nome, ra, curso, email, telefone } = req.body;

  if (!nome || !ra || !curso || !email || !telefone)
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  if (!validateRA(ra))
    return res.status(400).json({ error: 'RA deve ter 8 números.' });
  if (!validateEmail(email))
    return res.status(400).json({ error: 'Email deve ser institucional.' });
  if (!validateTelefone(telefone))
    return res.status(400).json({ error: 'Telefone inválido.' });

  const checkSQL = 'SELECT 1 FROM alunos WHERE ra = ? LIMIT 1';
  
  db.query(checkSQL, [ra], (err, r) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor.' });
    if (r.length) return res.status(400).json({ error: 'Este RA já está cadastrado.' });

    const insertSQL = `
      INSERT INTO alunos (nome, ra, curso, email, telefone)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertSQL, [nome, ra, curso, email, telefone], (err2, result2) => {
      if (err2) return res.status(500).json({ error: 'Erro ao cadastrar aluno.' });
      res.status(201).json({ message: 'Aluno cadastrado com sucesso!', id: result2.insertId });
    });
  });
});

module.exports = router;
