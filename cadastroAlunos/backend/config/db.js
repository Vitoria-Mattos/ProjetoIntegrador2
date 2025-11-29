// backend/config/db.js
const mysql = require('mysql2');
require('dotenv').config();

// Cria a conexão com base nas variáveis do .env
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Testa a conexão imediatamente
connection.connect(err => {
  if (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err.message);
  } else {
    console.log('✅ Conexão com MySQL estabelecida com sucesso!');
  }
});

module.exports = connection;
