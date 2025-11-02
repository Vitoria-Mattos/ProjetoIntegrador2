require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// ====================
// 📦 Conexão com o Banco
// ====================
const db = new sqlite3.Database('./biblioteca.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite');
  }
});

// Criar tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT,
    titulo TEXT,
    autor TEXT,
    numPaginas INTEGER,
    categoria TEXT
  )
`);

// ====================
// 📚 Rotas de Livros
// ====================

// ✅ Rota principal: Exibe o formulário
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "CadastroLivros.html"));
});

// Cadastrar livro
app.post('/livros/cadastrar', (req, res) => {
  const { codigo, titulo, autor, numPaginas, categoria } = req.body;

  if (!codigo || !titulo || !autor || !numPaginas || !categoria) {
    return res.status(400).json({ erro: 'Preencha todos os campos!' });
  }

  const sql = `INSERT INTO livros (codigo, titulo, autor, numPaginas, categoria)
               VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [codigo, titulo, autor, numPaginas, categoria], function (err) {
    if (err) {
      console.error('Erro ao salvar no banco:', err.message);
      return res.status(500).json({ erro: 'Erro ao salvar no banco.' });
    }
    res.status(201).json({ mensagem: 'Livro cadastrado com sucesso!' });
  });
});

// Listar livros
app.get('/livros/listar', (req, res) => {
  db.all('SELECT * FROM livros', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar livros.' });
    }
    res.json(rows);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'API da Biblioteca no ar!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
