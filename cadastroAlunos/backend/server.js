require('dotenv').config();
const express = require('express');
const cors = require('cors');
//const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Importa a rota dos alunos
const alunosRoutes = require('./routes/alunos');
app.use('/alunos', alunosRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'API do Programa do Aluno no ar!' });
});

// Importa a rota de livros
const livrosRoutes = require('./routes/livros');
app.use('/livros', livrosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

