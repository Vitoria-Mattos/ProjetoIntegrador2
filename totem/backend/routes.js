import express from "express";
import db from "./db.js";

const router = express.Router();

// RETIRAR LIVRO
router.post("/retirar", (req, res) => {
  const { raAluno, codigoLivro } = req.body;

  const sqlLivro = "SELECT * FROM livros WHERE id = ?";
  db.query(sqlLivro, [codigoLivro], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao consultar livro" });
    if (results.length === 0) return res.status(404).json({ erro: "Livro não encontrado" });

    const livro = results[0];
    if (livro.exemplares_disponiveis <= 0)
      return res.status(400).json({ erro: "Não há exemplares disponíveis" });

    const sqlInsert = `INSERT INTO retiradas (ra_aluno, codigo_livro, devolvido) VALUES (?, ?, 0)`;
    db.query(sqlInsert, [raAluno, codigoLivro], (err) => {
      if (err) return res.status(500).json({ erro: "Erro ao registrar retirada" });

      const sqlUpdate = "UPDATE livros SET exemplares_disponiveis = exemplares_disponiveis - 1 WHERE id = ?";
      db.query(sqlUpdate, [codigoLivro]);

      res.json({ mensagem: "Livro retirado com sucesso!" });
    });
  });
});


// DEVOLVER LIVRO
router.post("/devolver", (req, res) => {
  const { raAluno, codigoLivro } = req.body;

  const sqlRetirada = `
      SELECT * FROM retiradas
      WHERE ra_aluno = ? AND codigo_livro = ? AND devolvido = 0
      ORDER BY data_retirada DESC
      LIMIT 1
  `;

  db.query(sqlRetirada, [raAluno, codigoLivro], (err, results) => {
    if (err) return res.status(500).json({ mensagem: "Erro ao consultar retirada" });
    if (results.length === 0)
      return res.status(404).json({ mensagem: "Nenhuma retirada pendente encontrada" });

    const retirada = results[0];

    const sqlUpdateRetirada = `
      UPDATE retiradas
      SET devolvido = 1, data_devolucao = NOW()
      WHERE id = ?
    `;

    db.query(sqlUpdateRetirada, [retirada.id], (err) => {
      if (err) return res.status(500).json({ mensagem: "Erro ao registrar devolução" });

      const sqlUpdateLivro = `
        UPDATE livros
        SET exemplares_disponiveis = exemplares_disponiveis + 1
        WHERE id = ?
      `;

      db.query(sqlUpdateLivro, [codigoLivro], (err) => {
        if (err) return res.status(500).json({ mensagem: "Erro ao atualizar livro" });

        res.json({ mensagem: "Livro devolvido com sucesso!" });
      });
    });
  });
});

export default router;
