-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS biblioteca_universitaria
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE biblioteca_universitaria;

-- Criar tabela de alunos
CREATE TABLE IF NOT EXISTS alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  ra VARCHAR(20) NOT NULL UNIQUE,
  curso VARCHAR(80) NULL,
  email VARCHAR(120) NULL,
  telefone VARCHAR(20) NULL,
  total_lidos INT NOT NULL DEFAULT 0,
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM biblioteca_universitaria.alunos;

USE biblioteca_universitaria;

-- Tabela de LIVROS
CREATE TABLE IF NOT EXISTS livros (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  titulo               VARCHAR(180)   NOT NULL,
  autor                VARCHAR(120)   NULL,
  editora              VARCHAR(120)   NULL,
  ano_publicacao       INT            NULL,
  categoria            VARCHAR(80)    NULL,
  exemplares_total     INT            NOT NULL DEFAULT 1,
  exemplares_disponiveis INT          NOT NULL DEFAULT 1,
  criado_em            TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em        TIMESTAMP      NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Alguns registros de exemplo
INSERT INTO livros (titulo, autor, editora, ano_publicacao, categoria, exemplares_total, exemplares_disponiveis) VALUES
('Algoritmos: Teoria e Prática', 'Cormen, Leiserson, Rivest, Stein', 'MIT Press', 2009, 'Computação', 5, 3),
('Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, 'Computação', 4, 0),   -- indisponível (0)
('Banco de Dados: Projeto e Implementação', 'Elmasri & Navathe', 'Pearson', 2016, 'Banco de Dados', 6, 2),
('Estruturas de Dados e Algoritmos com JavaScript', 'Loiane Groner', 'Novatec', 2019, 'Computação', 3, 1),
('Engenharia de Software', 'Ian Sommerville', 'Pearson', 2011, 'Engenharia', 2, 2);

-- Consulta de teste: livros disponíveis (disponíveis > 0)
SELECT id, titulo, autor, categoria, exemplares_disponiveis
FROM livros
WHERE exemplares_disponiveis > 0
ORDER BY titulo;

SELECT * FROM alunos ORDER BY id DESC;


