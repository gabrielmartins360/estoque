-- ============================================================================
-- SISTEMA DE CONTROLE DE ESTOQUE E ALMOXARIFADO OPERACIONAL
-- Script DDL de Criação de Esquema de Banco de Dados Relacional
-- Compatível com PostgreSQL 13+ e adaptável para MySQL 8+
-- Responsável Técnico: Gabriel Henrique
-- ============================================================================

-- 1. TABELA DE USUÁRIOS E AUTENTICAÇÃO
CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cargo VARCHAR(50) NOT NULL DEFAULT 'Almoxarife',
    perfil VARCHAR(20) NOT NULL DEFAULT 'operador', -- 'admin', 'operador', 'gestor'
    senha VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE SETORES / DEPARTAMENTOS
CREATE TABLE IF NOT EXISTS setores (
    id VARCHAR(36) PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    responsavel VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    ramal VARCHAR(20),
    centro_custo VARCHAR(50),
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE MATERIAIS / ITENS DE ESTOQUE
CREATE TABLE IF NOT EXISTS materiais (
    id VARCHAR(36) PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL, -- SKU / Código Interno
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(60) NOT NULL DEFAULT 'Geral',
    unidade_medida VARCHAR(10) NOT NULL, -- 'UN', 'KG', 'L', 'M', 'CX', 'PAR', 'ROLO'
    quantidade_atual NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (quantidade_atual >= 0),
    estoque_minimo NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (estoque_minimo >= 0),
    estoque_maximo NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (estoque_maximo >= estoque_minimo),
    custo_unitario NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (custo_unitario >= 0),
    localizacao VARCHAR(100), -- Ex: Corredor A, Prateleira 03, Gaveta 12
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de consulta rápida de materiais
CREATE INDEX IF NOT EXISTS idx_materiais_codigo ON materiais(codigo);
CREATE INDEX IF NOT EXISTS idx_materiais_categoria ON materiais(categoria);
CREATE INDEX IF NOT EXISTS idx_materiais_estoque ON materiais(quantidade_atual, estoque_minimo, estoque_maximo);

-- 4. TABELA DE MOVIMENTAÇÕES DE ESTOQUE (ENTRADA / SAÍDA / AJUSTE)
CREATE TABLE IF NOT EXISTS movimentacoes (
    id VARCHAR(36) PRIMARY KEY,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('ENTRADA', 'SAIDA', 'AJUSTE')),
    material_id VARCHAR(36) NOT NULL REFERENCES materiais(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    quantidade NUMERIC(12, 2) NOT NULL CHECK (quantidade > 0),
    quantidade_anterior NUMERIC(12, 2) NOT NULL,
    quantidade_posterior NUMERIC(12, 2) NOT NULL,
    data_movimento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Dados de Entrada
    fornecedor VARCHAR(150),
    custo_unitario NUMERIC(12, 2) DEFAULT 0.00,
    numero_documento VARCHAR(50), -- Nota Fiscal ou Ordem de Compra
    -- Dados de Saída
    setor_id VARCHAR(36) REFERENCES setores(id) ON UPDATE CASCADE ON DELETE SET NULL,
    motivo VARCHAR(150), -- 'Consumo Regular', 'Manutenção', 'Avaria/Perda', etc.
    -- Auditoria
    responsavel VARCHAR(100) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mov_material ON movimentacoes(material_id);
CREATE INDEX IF NOT EXISTS idx_mov_tipo ON movimentacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_mov_data ON movimentacoes(data_movimento);
CREATE INDEX IF NOT EXISTS idx_mov_setor ON movimentacoes(setor_id);

-- 5. TABELA DE REQUISIÇÕES DE MATERIAIS
CREATE TABLE IF NOT EXISTS requisicoes (
    id VARCHAR(36) PRIMARY KEY,
    numero VARCHAR(30) UNIQUE NOT NULL, -- Ex: REQ-2026-0001
    setor_id VARCHAR(36) NOT NULL REFERENCES setores(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    solicitante VARCHAR(100) NOT NULL,
    data_requisicao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_necessidade DATE,
    prioridade VARCHAR(20) NOT NULL DEFAULT 'Normal' CHECK (prioridade IN ('Baixa', 'Normal', 'Alta', 'Urgente')),
    status VARCHAR(20) NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Aprovada', 'Entregue', 'Cancelada')),
    justificativa TEXT,
    aprovado_por VARCHAR(100),
    entregue_por VARCHAR(100),
    data_atendimento TIMESTAMP WITH TIME ZONE,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_req_status ON requisicoes(status);
CREATE INDEX IF NOT EXISTS idx_req_setor ON requisicoes(setor_id);
CREATE INDEX IF NOT EXISTS idx_req_data ON requisicoes(data_requisicao);

-- 6. ITENS DA REQUISIÇÃO (DETALHE N:N)
CREATE TABLE IF NOT EXISTS requisicao_itens (
    id VARCHAR(36) PRIMARY KEY,
    requisicao_id VARCHAR(36) NOT NULL REFERENCES requisicoes(id) ON UPDATE CASCADE ON DELETE CASCADE,
    material_id VARCHAR(36) NOT NULL REFERENCES materiais(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    quantidade_solicitada NUMERIC(12, 2) NOT NULL CHECK (quantidade_solicitada > 0),
    quantidade_atendida NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (quantidade_atendida >= 0),
    observacao VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_req_itens_requisicao ON requisicao_itens(requisicao_id);
CREATE INDEX IF NOT EXISTS idx_req_itens_material ON requisicao_itens(material_id);
