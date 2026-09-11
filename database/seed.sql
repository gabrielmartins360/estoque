-- ============================================================================
-- DADOS INICIAIS (SEED) PARA O CONTROLE DE ESTOQUE
-- ============================================================================

-- Usuários iniciais
INSERT INTO usuarios (id, nome, email, cargo, perfil, senha, ativo) VALUES
('usr-1', 'Gabriel Henrique', 'gabrielhenrique.ia10@gmail.com', 'Responsável Técnico & Almoxarife Chefe', 'admin', 'admin123', true),
('usr-2', 'Mariana Souza', 'mariana.almoxarifado@empresa.com.br', 'Operadora de Estoque', 'operador', 'operador123', true)
ON CONFLICT (id) DO NOTHING;

-- Setores / Departamentos
INSERT INTO setores (id, codigo, nome, responsavel, email, ramal, centro_custo, descricao) VALUES
('set-1', 'MANUT', 'Manutenção Industrial', 'Carlos Alberto', 'manutencao@empresa.com.br', '3042', 'CC-1010', 'Manutenção predial e maquinários fabris'),
('set-2', 'PROD', 'Produção e Montagem', 'Juliana Lima', 'producao@empresa.com.br', '3055', 'CC-2020', 'Linha de montagem e operação industrial'),
('set-3', 'SEGUR', 'Segurança do Trabalho (SESMT)', 'Rodrigo Nogueira', 'seguranca@empresa.com.br', '3011', 'CC-3030', 'Gestão de EPIs, EPCs e normas regulamentadoras'),
('set-4', 'TI', 'Tecnologia da Informação', 'Fernanda Rocha', 'ti@empresa.com.br', '3088', 'CC-4040', 'Infraestrutura, redes e suporte a usuários'),
('set-5', 'ADM', 'Administração Geral', 'Patrícia Mendes', 'adm@empresa.com.br', '3001', 'CC-5050', 'Escritório central e suprimentos corporativos')
ON CONFLICT (id) DO NOTHING;

-- Materiais Iniciais
INSERT INTO materiais (id, codigo, nome, categoria, unidade_medida, quantidade_atual, estoque_minimo, estoque_maximo, custo_unitario, localizacao, descricao) VALUES
('mat-1', 'EPI-001', 'Luva de Vaqueta Mista', 'EPI e Segurança', 'PAR', 45.00, 20.00, 100.00, 18.50, 'Prateleira A-01', 'Luva de proteção mecânica e abrasiva com punho reforçado'),
('mat-2', 'EPI-002', 'Óculos de Segurança Fumê UV', 'EPI e Segurança', 'UN', 12.00, 15.00, 80.00, 12.00, 'Prateleira A-02', 'Lentes em policarbonato com tratamento antirrisco'),
('mat-3', 'FER-101', 'Disco de Corte Inox 4.1/2"', 'Ferramentas e Abrasivos', 'UN', 5.00, 25.00, 150.00, 6.80, 'Prateleira B-04', 'Disco fino para corte rápido de tubos e chapas inox (Crítico)'),
('mat-4', 'FER-102', 'Fita Isolante 3M Alta Fusão 19mm', 'Elétrica e Eletrônica', 'ROLO', 60.00, 20.00, 120.00, 14.20, 'Gaveteiro E-02', 'Fita isolante antichama 20 metros classe A'),
('mat-5', 'MEC-201', 'Rolamento Rígido de Esferas 6204-2RS', 'Peças e Mecânica', 'UN', 0.00, 8.00, 40.00, 32.50, 'Gaveteiro M-01', 'Rolamento blindado com vedação de borracha (Item em Falta)'),
('mat-6', 'MEC-202', 'Graxa Azul Sintética Especial 1Kg', 'Lubrificantes e Químicos', 'KG', 18.00, 5.00, 25.00, 48.00, 'Armário Químico Q-03', 'Graxa de lítio com aditivação extrema pressão EP-2'),
('mat-7', 'SUP-301', 'Papel Sulfite A4 75g (Caixa c/ 10 resmas)', 'Suprimentos Corporativos', 'CX', 140.00, 30.00, 100.00, 210.00, 'Depósito Central D-01', 'Caixa com 5.000 folhas (Estoque acima do máximo)'),
('mat-8', 'LIM-401', 'Detergente Industrial Desengraxante 5L', 'Limpeza e Higiene', 'UN', 28.00, 10.00, 50.00, 38.90, 'Prateleira L-02', 'Concentrado para piso fabril e peças mecânicas')
ON CONFLICT (id) DO NOTHING;
