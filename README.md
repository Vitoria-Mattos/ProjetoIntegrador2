-- ===============================================
-- 1. CRIAÇÃO DO BANCO DE DADOS
-- ===============================================

CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;

-- ===============================================
-- 2. CRIAÇÃO DA TABELA ALUNO
-- Tabela "mãe" (parent) para a chave ra_aluno
-- ===============================================

CREATE TABLE IF NOT EXISTS aluno (
    -- Código do aluno (RA), chave primária e referência para outras tabelas
    codigo INT NOT NULL, 
    nome VARCHAR(255) NOT NULL,
    
    PRIMARY KEY (codigo)
    -- Adicione outras colunas como 'curso', 'email' se necessário
) ENGINE=InnoDB;


-- ===============================================
-- 3. CRIAÇÃO DA TABELA LIVRO
-- Tabela "mãe" (parent) para a chave codigo_livro
-- ===============================================

CREATE TABLE IF NOT EXISTS livro (
    -- Código do livro, chave primária e referência para outras tabelas
    codigo INT NOT NULL, 
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255),
    editora VARCHAR(255),
    ano_publicacao YEAR,
    exemplares_totais INT,
    
    PRIMARY KEY (codigo)
) ENGINE=InnoDB;


-- ===============================================
-- 4. CRIAÇÃO DA TABELA DEVOLUCOES
-- Tabela "filha" (child) com as chaves estrangeiras
-- ===============================================

CREATE TABLE IF NOT EXISTS devolucoes (
    id INT NOT NULL AUTO_INCREMENT,
    
    -- Chave estrangeira para o aluno
    -- Note: ra_aluno é VARCHAR(20) na devolucoes, mas referencia codigo INT no aluno.
    ra_aluno VARCHAR(20) NOT NULL,
    
    -- Chave estrangeira para o livro
    codigo_livro INT NOT NULL,
    
    -- Data e hora da devolução
    data_devolucao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    
    -- 🚨 RESTRIÇÃO DE CHAVE ESTRANGEIRA (FK) PARA ALUNO
    -- Garante que o ra_aluno existe na tabela aluno
    FOREIGN KEY (ra_aluno) REFERENCES aluno(codigo),
    
    -- 🚨 RESTRIÇÃO DE CHAVE ESTRANGEIRA (FK) PARA LIVRO
    -- Garante que o codigo_livro existe na tabela livro
    FOREIGN KEY (codigo_livro) REFERENCES livro(codigo)
    
) ENGINE=InnoDB;
