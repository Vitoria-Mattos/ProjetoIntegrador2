import express from "express";
import mysql from "mysql2";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Servir arquivos frontend
app.use(express.static(path.join(__dirname, "public"))); // 👈 Pasta onde está seu index.html

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Conexão com MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Nathy@27",
  database: "biblioteca"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err);
    return;
  }
  console.log("✅ Banco conectado!");
});

// Rota para cadastrar livros (com verificação de código duplicado)
app.post("/cadastrar", (req, res) => {
  const { codigo, nome, autor, paginas, categoria } = req.body;

  // 🔍 Verifica se o código já existe
  const checkSql = "SELECT * FROM livros WHERE codigo = ?";
  db.query(checkSql, [codigo], (err, result) => {
    if (err) {
      console.error("❌ Erro ao verificar código:", err);
      return res.status(500).json({ msg: "Erro ao verificar código." });
    }

    if (result.length > 0) {
      // ⚠️ Código já existe
      return res.status(400).json({ msg: "❌ Já existe um livro com esse código!" });
    }

    // 🔹 Se não existir, insere normalmente
    const insertSql = "INSERT INTO livros (codigo, nome, autor, paginas, categoria) VALUES (?, ?, ?, ?, ?)";
    db.query(insertSql, [codigo, nome, autor, paginas, categoria], (err) => {
      if (err) {
        console.error("❌ Erro ao cadastrar:", err);
        return res.status(500).json({ msg: "Erro ao cadastrar livro." });
      }
      res.json({ msg: "✅ Livro cadastrado com sucesso!" });
    });
  });
});

// ✅ Rota para listar todos os livros
app.get("/livros", (req, res) => {
  const sql = "SELECT * FROM livros ORDER BY codigo ASC"; // Ordena pelo código
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Erro ao buscar livros:", err);
      return res.status(500).json({ msg: "Erro ao buscar livros." });
    }
    res.json(results); // Retorna os livros como JSON
  });
});

// Porta
const PORT = 4000;

app.listen(PORT, () => 
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
).on("error", err => {
  if (err.code === "EADDRINUSE") {
    console.log(`❌ Porta ${PORT} já está em uso.`);
    console.log(`➡ Para liberar a porta, execute no PowerShell:`);
    console.log(`   netstat -ano | findstr :${PORT}`);
    console.log(`   taskkill /PID <PID> /F`);
  }
});
