const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise'); 

const app = express();
const PORT = 3000;

// --- Configuração do Middleware ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// --- Conexão com o Banco de Dados MySQL (OK) ---
const pool = mysql.createPool({
    host: 'localhost',         
    user: 'root', 
    password: 'Nathy@27', 
    database: 'biblioteca',    
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado ao banco de dados MySQL com sucesso!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ ERRO CRÍTICO ao conectar ao MySQL:', err.message);
    });


// --- Rota Principal (Frontend) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// --- Rota da API para buscar dados (QUERY CORRIGIDA COM NOMES DE CHAVE EXATOS) ---
app.get('/api/livros_devolvidos', async (req, res) => {
    try {
        // 🚨 QUERY FINAL: Usando JOINs com os nomes de coluna EXATOS do seu esquema:
        const sql = `
            SELECT 
                L.codigo AS codigo_livro,       -- Código do Livro (da tabela 'livro')
                L.titulo AS nome_livro,          -- Título do Livro (da tabela 'livro')
                A.nome AS nome_aluno,           -- Nome do Aluno (da tabela 'aluno')
                D.data_devolucao                -- Data de Devolução (da tabela 'devolucoes')
            FROM devolucoes D                   
            JOIN livro L ON D.codigo_livro = L.codigo  -- Junta 'devolucoes' (codigo_livro) com 'livro' (codigo)
            JOIN aluno A ON D.ra_aluno = A.codigo      -- Junta 'devolucoes' (ra_aluno) com 'aluno' (codigo)
            ORDER BY D.data_devolucao DESC;
        `;

        const [rows, fields] = await pool.query(sql);

        res.json({
            "mensagem": "sucesso",
            "data": rows
        });
    } catch (err) {
        // Se este erro ocorrer novamente, ele será causado por dados ausentes ou tipo de coluna incorreto no JOIN
        console.error("❌ ERRO AO EXECUTAR QUERY NO MYSQL:", err.message);
        res.status(500).json({"error": "Erro no banco de dados ao buscar livros."});
    }
});


// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});