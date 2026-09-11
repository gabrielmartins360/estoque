import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

interface Material {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  unidade_medida: string;
  quantidade_atual: number;
  estoque_minimo: number;
  estoque_maximo: number;
  custo_unitario: number;
  localizacao: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

interface Setor {
  id: string;
  codigo: string;
  nome: string;
  responsavel: string;
  email: string;
  ramal: string;
  centro_custo: string;
  descricao?: string;
  created_at: string;
}

interface Movimentacao {
  id: string;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  material_id: string;
  material_nome: string;
  material_codigo: string;
  unidade_medida: string;
  quantidade: number;
  quantidade_anterior: number;
  quantidade_posterior: number;
  data_movimento: string;
  fornecedor?: string;
  custo_unitario?: number;
  custo_total?: number;
  numero_documento?: string;
  setor_id?: string;
  setor_nome?: string;
  motivo?: string;
  responsavel: string;
  observacoes?: string;
}

interface RequisicaoItem {
  id: string;
  material_id: string;
  material_nome: string;
  material_codigo: string;
  unidade_medida: string;
  quantidade_solicitada: number;
  quantidade_atendida: number;
  observacao?: string;
}

interface Requisicao {
  id: string;
  numero: string;
  setor_id: string;
  setor_nome: string;
  solicitante: string;
  data_requisicao: string;
  data_necessidade?: string;
  prioridade: 'Baixa' | 'Normal' | 'Alta' | 'Urgente';
  status: 'Pendente' | 'Aprovada' | 'Entregue' | 'Cancelada';
  justificativa: string;
  aprovado_por?: string;
  entregue_por?: string;
  data_atendimento?: string;
  observacoes?: string;
  itens: RequisicaoItem[];
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  perfil: 'admin' | 'operador';
  token?: string;
}

interface DatabaseState {
  materials: Material[];
  departments: Setor[];
  movements: Movimentacao[];
  requisitions: Requisicao[];
  users: Usuario[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'inventory.json');

function getInitialDatabase(): DatabaseState {
  const now = new Date();
  const d = (daysAgo: number) => {
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return date.toISOString();
  };

  const materials: Material[] = [
    {
      id: 'mat-1',
      codigo: 'EPI-001',
      nome: 'Luva de Vaqueta Mista Reforçada',
      categoria: 'EPI e Segurança',
      unidade_medida: 'PAR',
      quantidade_atual: 45,
      estoque_minimo: 20,
      estoque_maximo: 100,
      custo_unitario: 18.50,
      localizacao: 'Prateleira A-01',
      descricao: 'Luva de proteção mecânica e abrasiva com punho longo reforçado.',
      created_at: d(60),
      updated_at: d(2),
    },
    {
      id: 'mat-2',
      codigo: 'EPI-002',
      nome: 'Óculos de Segurança Fumê UV Antirrisco',
      categoria: 'EPI e Segurança',
      unidade_medida: 'UN',
      quantidade_atual: 12,
      estoque_minimo: 20,
      estoque_maximo: 80,
      custo_unitario: 14.00,
      localizacao: 'Prateleira A-02',
      descricao: 'Lentes em policarbonato com proteção solar e tratamento antirrisco.',
      created_at: d(60),
      updated_at: d(3),
    },
    {
      id: 'mat-3',
      codigo: 'FER-101',
      nome: 'Disco de Corte Inox 4.1/2" x 1mm',
      categoria: 'Ferramentas e Abrasivos',
      unidade_medida: 'UN',
      quantidade_atual: 6,
      estoque_minimo: 30,
      estoque_maximo: 150,
      custo_unitario: 7.20,
      localizacao: 'Prateleira B-04',
      descricao: 'Disco de corte rápido com duas telas para cortes finos em tubos e perfis inox.',
      created_at: d(45),
      updated_at: d(1),
    },
    {
      id: 'mat-4',
      codigo: 'ELE-201',
      nome: 'Fita Isolante 3M Alta Fusão 19mm x 20m',
      categoria: 'Elétrica e Automação',
      unidade_medida: 'ROLO',
      quantidade_atual: 55,
      estoque_minimo: 25,
      estoque_maximo: 120,
      custo_unitario: 15.80,
      localizacao: 'Gaveteiro E-02',
      descricao: 'Fita isolante classe A para isolação primária e emendas até 750V.',
      created_at: d(50),
      updated_at: d(5),
    },
    {
      id: 'mat-5',
      codigo: 'MEC-301',
      nome: 'Rolamento Rígido de Esferas 6204-2RS',
      categoria: 'Peças e Mecânica',
      unidade_medida: 'UN',
      quantidade_atual: 0,
      estoque_minimo: 10,
      estoque_maximo: 50,
      custo_unitario: 34.90,
      localizacao: 'Gaveteiro M-01',
      descricao: 'Rolamento com blindagem de borracha nitrílica em ambos os lados.',
      created_at: d(90),
      updated_at: d(10),
    },
    {
      id: 'mat-6',
      codigo: 'LUB-401',
      nome: 'Graxa Azul Sintética Especial EP-2 1Kg',
      categoria: 'Lubrificantes e Químicos',
      unidade_medida: 'KG',
      quantidade_atual: 18,
      estoque_minimo: 5,
      estoque_maximo: 25,
      custo_unitario: 48.00,
      localizacao: 'Armário Químico Q-03',
      descricao: 'Graxa de alta performance à base de complexo de lítio resistente à água.',
      created_at: d(40),
      updated_at: d(8),
    },
    {
      id: 'mat-7',
      codigo: 'SUP-501',
      nome: 'Papel Sulfite A4 75g (Caixa c/ 10 resmas)',
      categoria: 'Suprimentos Corporativos',
      unidade_medida: 'CX',
      quantidade_atual: 135,
      estoque_minimo: 30,
      estoque_maximo: 100,
      custo_unitario: 215.00,
      localizacao: 'Depósito Central D-01',
      descricao: 'Papel alcalino multiuso alta brancura para impressão e cópias.',
      created_at: d(70),
      updated_at: d(4),
    },
    {
      id: 'mat-8',
      codigo: 'LIM-601',
      nome: 'Detergente Industrial Desengraxante 5L',
      categoria: 'Limpeza e Higiene',
      unidade_medida: 'GL',
      quantidade_atual: 32,
      estoque_minimo: 10,
      estoque_maximo: 50,
      custo_unitario: 39.50,
      localizacao: 'Prateleira L-02',
      descricao: 'Detergente concentrado com alto poder desengordurante para pisos e peças.',
      created_at: d(30),
      updated_at: d(6),
    },
    {
      id: 'mat-9',
      codigo: 'SOL-701',
      nome: 'Eletrodo Revestido E6013 2.5mm (Lata 5Kg)',
      categoria: 'Soldagem e Caldeiraria',
      unidade_medida: 'KG',
      quantidade_atual: 40,
      estoque_minimo: 20,
      estoque_maximo: 80,
      custo_unitario: 28.00,
      localizacao: 'Prateleira B-02',
      descricao: 'Eletrodo rutílico para solda em aço carbono de fino acabamento.',
      created_at: d(45),
      updated_at: d(12),
    },
    {
      id: 'mat-10',
      codigo: 'FER-103',
      nome: 'Trena Métrica Emborrachada 8 Metros',
      categoria: 'Ferramentas e Abrasivos',
      unidade_medida: 'UN',
      quantidade_atual: 8,
      estoque_minimo: 8,
      estoque_maximo: 30,
      custo_unitario: 38.00,
      localizacao: 'Armário A-05',
      descricao: 'Trena com trava dupla, fita fosca anti-reflexo e estojo resistente.',
      created_at: d(80),
      updated_at: d(35), // slow-moving demo
    }
  ];

  const departments: Setor[] = [
    {
      id: 'set-1',
      codigo: 'MANUT',
      nome: 'Manutenção Industrial & Predial',
      responsavel: 'Carlos Alberto Viana',
      email: 'manutencao@empresa.com.br',
      ramal: '3042',
      centro_custo: 'CC-1010',
      descricao: 'Responsável pela manutenção preventiva e corretiva de máquinas e instalações.',
      created_at: d(90),
    },
    {
      id: 'set-2',
      codigo: 'PROD',
      nome: 'Produção & Linha de Montagem',
      responsavel: 'Juliana Castro Lima',
      email: 'producao@empresa.com.br',
      ramal: '3055',
      centro_custo: 'CC-2020',
      descricao: 'Setor produtivo principal e montagem mecânica de componentes.',
      created_at: d(90),
    },
    {
      id: 'set-3',
      codigo: 'SESMT',
      nome: 'Segurança do Trabalho (SESMT)',
      responsavel: 'Rodrigo Nogueira',
      email: 'seguranca@empresa.com.br',
      ramal: '3011',
      centro_custo: 'CC-3030',
      descricao: 'Fiscalização de normas de segurança, entrega e controle de EPIs.',
      created_at: d(90),
    },
    {
      id: 'set-4',
      codigo: 'TI',
      nome: 'Tecnologia da Informação & Redes',
      responsavel: 'Fernanda Rocha',
      email: 'ti@empresa.com.br',
      ramal: '3088',
      centro_custo: 'CC-4040',
      descricao: 'Suporte de TI, telecomunicação e infraestrutura de servidores.',
      created_at: d(90),
    },
    {
      id: 'set-5',
      codigo: 'ADM',
      nome: 'Administração & Recursos Humanos',
      responsavel: 'Patrícia Mendes',
      email: 'adm@empresa.com.br',
      ramal: '3001',
      centro_custo: 'CC-5050',
      descricao: 'Gestão administrativa, compras e controladoria financeira.',
      created_at: d(90),
    }
  ];

  const movements: Movimentacao[] = [
    {
      id: 'mov-1',
      tipo: 'ENTRADA',
      material_id: 'mat-1',
      material_nome: 'Luva de Vaqueta Mista Reforçada',
      material_codigo: 'EPI-001',
      unidade_medida: 'PAR',
      quantidade: 50,
      quantidade_anterior: 15,
      quantidade_posterior: 65,
      data_movimento: d(18),
      fornecedor: 'Protec Equipamentos de Segurança Ltda',
      custo_unitario: 18.50,
      custo_total: 925.00,
      numero_documento: 'NF-45210',
      responsavel: 'Gabriel Henrique',
      observacoes: 'Recebimento de lote contratual de EPIs do trimestre.',
    },
    {
      id: 'mov-2',
      tipo: 'SAIDA',
      material_id: 'mat-1',
      material_nome: 'Luva de Vaqueta Mista Reforçada',
      material_codigo: 'EPI-001',
      unidade_medida: 'PAR',
      quantidade: 20,
      quantidade_anterior: 65,
      quantidade_posterior: 45,
      data_movimento: d(12),
      setor_id: 'set-2',
      setor_nome: 'Produção & Linha de Montagem',
      motivo: 'Substituição periódica para equipe de soldagem e caldeiraria',
      responsavel: 'Gabriel Henrique',
      observacoes: 'Entregue mediante assinatura do encarregado de turno.',
    },
    {
      id: 'mov-3',
      tipo: 'ENTRADA',
      material_id: 'mat-4',
      material_nome: 'Fita Isolante 3M Alta Fusão 19mm x 20m',
      material_codigo: 'ELE-201',
      unidade_medida: 'ROLO',
      quantidade: 40,
      quantidade_anterior: 25,
      quantidade_posterior: 65,
      data_movimento: d(15),
      fornecedor: 'Distribuidora Eletroeste Comércio',
      custo_unitario: 15.80,
      custo_total: 632.00,
      numero_documento: 'NF-88412',
      responsavel: 'Mariana Souza',
      observacoes: 'Reposição de estoque de suprimentos elétricos.',
    },
    {
      id: 'mov-4',
      tipo: 'SAIDA',
      material_id: 'mat-4',
      material_nome: 'Fita Isolante 3M Alta Fusão 19mm x 20m',
      material_codigo: 'ELE-201',
      unidade_medida: 'ROLO',
      quantidade: 10,
      quantidade_anterior: 65,
      quantidade_posterior: 55,
      data_movimento: d(7),
      setor_id: 'set-1',
      setor_nome: 'Manutenção Industrial & Predial',
      motivo: 'Revisão dos quadros de distribuição do Pavilhão 2',
      responsavel: 'Gabriel Henrique',
      observacoes: 'Ordem de Serviço OS-2026-881.',
    },
    {
      id: 'mov-5',
      tipo: 'SAIDA',
      material_id: 'mat-3',
      material_nome: 'Disco de Corte Inox 4.1/2" x 1mm',
      material_codigo: 'FER-101',
      unidade_medida: 'UN',
      quantidade: 24,
      quantidade_anterior: 30,
      quantidade_posterior: 6,
      data_movimento: d(3),
      setor_id: 'set-1',
      setor_nome: 'Manutenção Industrial & Predial',
      motivo: 'Corte de esteira transportadora para reparo emergencial',
      responsavel: 'Gabriel Henrique',
      observacoes: 'Alerta emitido: Estoque atingiu nível crítico de 6 unidades.',
    },
    {
      id: 'mov-6',
      tipo: 'SAIDA',
      material_id: 'mat-5',
      material_nome: 'Rolamento Rígido de Esferas 6204-2RS',
      material_codigo: 'MEC-301',
      unidade_medida: 'UN',
      quantidade: 12,
      quantidade_anterior: 12,
      quantidade_posterior: 0,
      data_movimento: d(5),
      setor_id: 'set-2',
      setor_nome: 'Produção & Linha de Montagem',
      motivo: 'Troca preventiva de rolamentos nos motores da esteira B',
      responsavel: 'Mariana Souza',
      observacoes: 'Estoque zerado. Solicitação urgente de compra encaminhada ao setor de Suprimentos.',
    },
    {
      id: 'mov-7',
      tipo: 'ENTRADA',
      material_id: 'mat-7',
      material_nome: 'Papel Sulfite A4 75g (Caixa c/ 10 resmas)',
      material_codigo: 'SUP-501',
      unidade_medida: 'CX',
      quantidade: 50,
      quantidade_anterior: 95,
      quantidade_posterior: 145,
      data_movimento: d(20),
      fornecedor: 'Kalunga Papelaria Corporativa',
      custo_unitario: 215.00,
      custo_total: 10750.00,
      numero_documento: 'NF-102931',
      responsavel: 'Gabriel Henrique',
      observacoes: 'Entrega antecipada do contrato anual. Estoque temporariamente acima do limite máximo.',
    },
    {
      id: 'mov-8',
      tipo: 'SAIDA',
      material_id: 'mat-7',
      material_nome: 'Papel Sulfite A4 75g (Caixa c/ 10 resmas)',
      material_codigo: 'SUP-501',
      unidade_medida: 'CX',
      quantidade: 10,
      quantidade_anterior: 145,
      quantidade_posterior: 135,
      data_movimento: d(8),
      setor_id: 'set-5',
      setor_nome: 'Administração & Recursos Humanos',
      motivo: 'Abastecimento mensal de impressoras administrativas',
      responsavel: 'Mariana Souza',
      observacoes: 'Distribuído entre RH, Compras e Diretoria.',
    },
    {
      id: 'mov-9',
      tipo: 'ENTRADA',
      material_id: 'mat-8',
      material_nome: 'Detergente Industrial Desengraxante 5L',
      material_codigo: 'LIM-601',
      unidade_medida: 'GL',
      quantidade: 20,
      quantidade_anterior: 18,
      quantidade_posterior: 38,
      data_movimento: d(14),
      fornecedor: 'Química Industrial Bandeirantes',
      custo_unitario: 39.50,
      custo_total: 790.00,
      numero_documento: 'NF-33129',
      responsavel: 'Gabriel Henrique',
      observacoes: 'Reposição quinzenal.',
    },
    {
      id: 'mov-10',
      tipo: 'SAIDA',
      material_id: 'mat-8',
      material_nome: 'Detergente Industrial Desengraxante 5L',
      material_codigo: 'LIM-601',
      unidade_medida: 'GL',
      quantidade: 6,
      quantidade_anterior: 38,
      quantidade_posterior: 32,
      data_movimento: d(6),
      setor_id: 'set-1',
      setor_nome: 'Manutenção Industrial & Predial',
      motivo: 'Limpeza pesada de bancadas e engrenagens desmontadas',
      responsavel: 'Gabriel Henrique',
      observacoes: 'Atendimento à OS de limpeza geral.',
    }
  ];

  const requisitions: Requisicao[] = [
    {
      id: 'req-1',
      numero: 'REQ-2026-0012',
      setor_id: 'set-1',
      setor_nome: 'Manutenção Industrial & Predial',
      solicitante: 'Carlos Alberto Viana',
      data_requisicao: d(2),
      data_necessidade: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      prioridade: 'Urgente',
      status: 'Aprovada',
      justificativa: 'Reparo emergencial de esteira transportadora do Pavilhão 1 parada.',
      aprovado_por: 'Gabriel Henrique (Almoxarife Chefe)',
      observacoes: 'Liberada para separação no almoxarifado central.',
      itens: [
        {
          id: 'item-1',
          material_id: 'mat-3',
          material_nome: 'Disco de Corte Inox 4.1/2" x 1mm',
          material_codigo: 'FER-101',
          unidade_medida: 'UN',
          quantidade_solicitada: 10,
          quantidade_atendida: 0,
          observacao: 'Para corte imediato dos suportes'
        },
        {
          id: 'item-2',
          material_id: 'mat-6',
          material_nome: 'Graxa Azul Sintética Especial EP-2 1Kg',
          material_codigo: 'LUB-401',
          unidade_medida: 'KG',
          quantidade_solicitada: 2,
          quantidade_atendida: 0,
          observacao: 'Lubrificação do mancal novo'
        }
      ]
    },
    {
      id: 'req-2',
      numero: 'REQ-2026-0011',
      setor_id: 'set-3',
      setor_nome: 'Segurança do Trabalho (SESMT)',
      solicitante: 'Rodrigo Nogueira',
      data_requisicao: d(5),
      data_necessidade: d(4).split('T')[0],
      prioridade: 'Alta',
      status: 'Entregue',
      justificativa: 'Integração de novos colaboradores na linha de montagem e solda.',
      aprovado_por: 'Gabriel Henrique',
      entregue_por: 'Mariana Souza',
      data_atendimento: d(4),
      observacoes: 'Material retirado e assinado no livro de cautela.',
      itens: [
        {
          id: 'item-3',
          material_id: 'mat-1',
          material_nome: 'Luva de Vaqueta Mista Reforçada',
          material_codigo: 'EPI-001',
          unidade_medida: 'PAR',
          quantidade_solicitada: 15,
          quantidade_atendida: 15,
          observacao: 'Tamanho 9 e 10'
        },
        {
          id: 'item-4',
          material_id: 'mat-2',
          material_nome: 'Óculos de Segurança Fumê UV Antirrisco',
          material_codigo: 'EPI-002',
          unidade_medida: 'UN',
          quantidade_solicitada: 8,
          quantidade_atendida: 8,
          observacao: 'Uso externo e solda'
        }
      ]
    },
    {
      id: 'req-3',
      numero: 'REQ-2026-0010',
      setor_id: 'set-5',
      setor_nome: 'Administração & Recursos Humanos',
      solicitante: 'Patrícia Mendes',
      data_requisicao: d(1),
      data_necessidade: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      prioridade: 'Normal',
      status: 'Pendente',
      justificativa: 'Suprimento regular para auditoria fiscal interna e arquivo morto.',
      observacoes: 'Aguardando validação de saldo no estoque.',
      itens: [
        {
          id: 'item-5',
          material_id: 'mat-7',
          material_nome: 'Papel Sulfite A4 75g (Caixa c/ 10 resmas)',
          material_codigo: 'SUP-501',
          unidade_medida: 'CX',
          quantidade_solicitada: 5,
          quantidade_atendida: 0,
          observacao: 'Entrega na sala 204'
        }
      ]
    }
  ];

  const users: Usuario[] = [
    {
      id: 'usr-1',
      nome: 'Gabriel Henrique',
      email: 'gabrielhenrique.ia10@gmail.com',
      cargo: 'Responsável Técnico & Almoxarife Chefe',
      perfil: 'admin',
      token: 'token-admin-123'
    },
    {
      id: 'usr-2',
      nome: 'Mariana Souza',
      email: 'mariana.almoxarifado@empresa.com.br',
      cargo: 'Operadora de Estoque',
      perfil: 'operador',
      token: 'token-operador-456'
    }
  ];

  return { materials, departments, movements, requisitions, users };
}

function loadDatabase(): DatabaseState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial = getInitialDatabase();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as DatabaseState;
  } catch (error) {
    console.error('Erro ao carregar banco de dados local:', error);
    return getInitialDatabase();
  }
}

function saveDatabase(data: DatabaseState): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Erro ao salvar banco de dados local:', error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Database SQL scripts for export/view
  app.get('/api/database/sql', (req, res) => {
    try {
      const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
      const seedPath = path.join(process.cwd(), 'database', 'seed.sql');
      const schemaSql = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf-8') : '';
      const seedSql = fs.existsSync(seedPath) ? fs.readFileSync(seedPath, 'utf-8') : '';
      res.json({ schemaSql, seedSql });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Reset demo
  app.post('/api/reset-demo', (req, res) => {
    const fresh = getInitialDatabase();
    saveDatabase(fresh);
    res.json({ success: true, message: 'Dados de demonstração restaurados com sucesso!' });
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const db = loadDatabase();
    const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase().trim());

    if (!user) {
      // Allow demo login with fallback for quick assessment
      if (email === 'admin' || email === 'gabrielhenrique.ia10@gmail.com') {
        const adminUser = db.users[0];
        return res.json({ user: adminUser, token: adminUser.token || 'token-admin-123' });
      }
      return res.status(401).json({ error: 'Credenciais inválidas. Verifique o e-mail ou use o acesso de demonstração.' });
    }

    // Default password validation
    if (password && password !== 'admin123' && password !== 'operador123' && password !== '123456') {
      return res.status(401).json({ error: 'Senha incorreta. Senha padrão de demonstração: admin123' });
    }

    res.json({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        cargo: user.cargo,
        perfil: user.perfil,
      },
      token: user.token || 'session-' + Date.now(),
    });
  });

  app.get('/api/auth/me', (req, res) => {
    const db = loadDatabase();
    res.json({ user: db.users[0] });
  });

  // Materials CRUD
  app.get('/api/materials', (req, res) => {
    const db = loadDatabase();
    const { search, category, status } = req.query;

    let list = db.materials.map((m) => {
      let stockStatus: 'CRITICO' | 'ALERTA' | 'NORMAL' | 'EXCESSO' = 'NORMAL';
      if (m.quantidade_atual === 0) stockStatus = 'CRITICO';
      else if (m.quantidade_atual <= m.estoque_minimo) stockStatus = 'ALERTA';
      else if (m.quantidade_atual > m.estoque_maximo) stockStatus = 'EXCESSO';

      const valorTotal = Number((m.quantidade_atual * m.custo_unitario).toFixed(2));

      // Calculate days since last movement
      const lastMov = db.movements
        .filter((mov) => mov.material_id === m.id)
        .sort((a, b) => new Date(b.data_movimento).getTime() - new Date(a.data_movimento).getTime())[0];

      let daysSinceMovement = 999;
      if (lastMov) {
        const diffMs = Math.abs(new Date().getTime() - new Date(lastMov.data_movimento).getTime());
        daysSinceMovement = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      } else {
        const diffMs = Math.abs(new Date().getTime() - new Date(m.created_at).getTime());
        daysSinceMovement = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      }

      const isSlowMoving = daysSinceMovement >= 20;

      return {
        ...m,
        status: stockStatus,
        valor_total: valorTotal,
        days_since_movement: daysSinceMovement,
        is_slow_moving: isSlowMoving,
        last_movement_date: lastMov ? lastMov.data_movimento : null,
      };
    });

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((m) => m.nome.toLowerCase().includes(q) || m.codigo.toLowerCase().includes(q) || m.categoria.toLowerCase().includes(q));
    }

    if (category && typeof category === 'string' && category !== 'Todas') {
      list = list.filter((m) => m.categoria === category);
    }

    if (status && typeof status === 'string' && status !== 'Todos') {
      if (status === 'LENTO') {
        list = list.filter((m) => m.is_slow_moving);
      } else {
        list = list.filter((m) => m.status === status);
      }
    }

    res.json(list);
  });

  app.post('/api/materials', (req, res) => {
    const db = loadDatabase();
    const { codigo, nome, categoria, unidade_medida, quantidade_atual, estoque_minimo, estoque_maximo, custo_unitario, localizacao, descricao } = req.body;

    if (!codigo || !nome || !unidade_medida) {
      return res.status(400).json({ error: 'Código, nome e unidade de medida são campos obrigatórios.' });
    }

    const exists = db.materials.some((m) => m.codigo.trim().toLowerCase() === codigo.trim().toLowerCase());
    if (exists) {
      return res.status(400).json({ error: `Já existe um material cadastrado com o código ${codigo}.` });
    }

    const newMaterial: Material = {
      id: 'mat-' + Date.now(),
      codigo: codigo.trim().toUpperCase(),
      nome: nome.trim(),
      categoria: categoria?.trim() || 'Geral',
      unidade_medida: unidade_medida.trim().toUpperCase(),
      quantidade_atual: Number(quantidade_atual) || 0,
      estoque_minimo: Number(estoque_minimo) || 0,
      estoque_maximo: Math.max(Number(estoque_maximo) || 0, Number(estoque_minimo) || 0),
      custo_unitario: Number(custo_unitario) || 0,
      localizacao: localizacao?.trim() || 'Almoxarifado Geral',
      descricao: descricao?.trim() || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.materials.push(newMaterial);

    // If initial quantity > 0, register initial movement
    if (newMaterial.quantidade_atual > 0) {
      db.movements.unshift({
        id: 'mov-' + Date.now(),
        tipo: 'ENTRADA',
        material_id: newMaterial.id,
        material_nome: newMaterial.nome,
        material_codigo: newMaterial.codigo,
        unidade_medida: newMaterial.unidade_medida,
        quantidade: newMaterial.quantidade_atual,
        quantidade_anterior: 0,
        quantidade_posterior: newMaterial.quantidade_atual,
        data_movimento: new Date().toISOString(),
        fornecedor: 'Inventário Inicial',
        custo_unitario: newMaterial.custo_unitario,
        custo_total: Number((newMaterial.quantidade_atual * newMaterial.custo_unitario).toFixed(2)),
        numero_documento: 'CADASTRO-INICIAL',
        responsavel: 'Gabriel Henrique',
        observacoes: 'Carga de saldo inicial no cadastro do material.',
      });
    }

    saveDatabase(db);
    res.status(201).json(newMaterial);
  });

  app.put('/api/materials/:id', (req, res) => {
    const db = loadDatabase();
    const { id } = req.params;
    const idx = db.materials.findIndex((m) => m.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Material não encontrado.' });
    }

    const current = db.materials[idx];
    const { codigo, nome, categoria, unidade_medida, estoque_minimo, estoque_maximo, custo_unitario, localizacao, descricao } = req.body;

    if (codigo && codigo !== current.codigo) {
      const codeExists = db.materials.some((m) => m.id !== id && m.codigo.trim().toLowerCase() === codigo.trim().toLowerCase());
      if (codeExists) {
        return res.status(400).json({ error: `Já existe outro material com o código ${codigo}.` });
      }
    }

    db.materials[idx] = {
      ...current,
      codigo: codigo ? codigo.trim().toUpperCase() : current.codigo,
      nome: nome ? nome.trim() : current.nome,
      categoria: categoria ? categoria.trim() : current.categoria,
      unidade_medida: unidade_medida ? unidade_medida.trim().toUpperCase() : current.unidade_medida,
      estoque_minimo: estoque_minimo !== undefined ? Number(estoque_minimo) : current.estoque_minimo,
      estoque_maximo: estoque_maximo !== undefined ? Number(estoque_maximo) : current.estoque_maximo,
      custo_unitario: custo_unitario !== undefined ? Number(custo_unitario) : current.custo_unitario,
      localizacao: localizacao !== undefined ? localizacao.trim() : current.localizacao,
      descricao: descricao !== undefined ? descricao.trim() : current.descricao,
      updated_at: new Date().toISOString(),
    };

    saveDatabase(db);
    res.json(db.materials[idx]);
  });

  app.delete('/api/materials/:id', (req, res) => {
    const db = loadDatabase();
    const { id } = req.params;
    const idx = db.materials.findIndex((m) => m.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Material não encontrado.' });
    }

    const hasMovements = db.movements.some((m) => m.material_id === id);
    if (hasMovements) {
      return res.status(400).json({
        error: 'Não é possível excluir material com histórico de movimentações vinculadas. Mantenha o histórico para auditoria.',
      });
    }

    const removed = db.materials.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ success: true, removed });
  });

  // Departments CRUD
  app.get('/api/departments', (req, res) => {
    const db = loadDatabase();
    res.json(db.departments);
  });

  app.post('/api/departments', (req, res) => {
    const db = loadDatabase();
    const { codigo, nome, responsavel, email, ramal, centro_custo, descricao } = req.body;

    if (!codigo || !nome || !responsavel) {
      return res.status(400).json({ error: 'Código, nome do setor e responsável são obrigatórios.' });
    }

    const exists = db.departments.some((d) => d.codigo.trim().toLowerCase() === codigo.trim().toLowerCase());
    if (exists) {
      return res.status(400).json({ error: `Já existe um setor com o código ${codigo}.` });
    }

    const newDep: Setor = {
      id: 'set-' + Date.now(),
      codigo: codigo.trim().toUpperCase(),
      nome: nome.trim(),
      responsavel: responsavel.trim(),
      email: email?.trim() || '',
      ramal: ramal?.trim() || '',
      centro_custo: centro_custo?.trim() || 'CC-GERAL',
      descricao: descricao?.trim() || '',
      created_at: new Date().toISOString(),
    };

    db.departments.push(newDep);
    saveDatabase(db);
    res.status(201).json(newDep);
  });

  app.put('/api/departments/:id', (req, res) => {
    const db = loadDatabase();
    const { id } = req.params;
    const idx = db.departments.findIndex((d) => d.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Setor não encontrado.' });
    }

    const current = db.departments[idx];
    const { codigo, nome, responsavel, email, ramal, centro_custo, descricao } = req.body;

    db.departments[idx] = {
      ...current,
      codigo: codigo ? codigo.trim().toUpperCase() : current.codigo,
      nome: nome ? nome.trim() : current.nome,
      responsavel: responsavel ? responsavel.trim() : current.responsavel,
      email: email !== undefined ? email.trim() : current.email,
      ramal: ramal !== undefined ? ramal.trim() : current.ramal,
      centro_custo: centro_custo !== undefined ? centro_custo.trim() : current.centro_custo,
      descricao: descricao !== undefined ? descricao.trim() : current.descricao,
    };

    saveDatabase(db);
    res.json(db.departments[idx]);
  });

  app.delete('/api/departments/:id', (req, res) => {
    const db = loadDatabase();
    const { id } = req.params;
    const idx = db.departments.findIndex((d) => d.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Setor não encontrado.' });
    }

    const hasMov = db.movements.some((m) => m.setor_id === id);
    const hasReq = db.requisitions.some((r) => r.setor_id === id);
    if (hasMov || hasReq) {
      return res.status(400).json({
        error: 'Não é possível excluir setor com movimentações ou requisições registradas.',
      });
    }

    const removed = db.departments.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ success: true, removed });
  });

  // Movements (Entradas e Saídas)
  app.get('/api/movements', (req, res) => {
    const db = loadDatabase();
    const { tipo, materialId, departmentId, startDate, endDate, search } = req.query;

    let list = [...db.movements];

    if (tipo && typeof tipo === 'string' && tipo !== 'TODOS') {
      list = list.filter((m) => m.tipo === tipo);
    }
    if (materialId && typeof materialId === 'string' && materialId !== 'TODOS') {
      list = list.filter((m) => m.material_id === materialId);
    }
    if (departmentId && typeof departmentId === 'string' && departmentId !== 'TODOS') {
      list = list.filter((m) => m.setor_id === departmentId);
    }
    if (startDate && typeof startDate === 'string') {
      const start = new Date(startDate).getTime();
      list = list.filter((m) => new Date(m.data_movimento).getTime() >= start);
    }
    if (endDate && typeof endDate === 'string') {
      // Include full day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      list = list.filter((m) => new Date(m.data_movimento).getTime() <= end.getTime());
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.material_nome.toLowerCase().includes(q) ||
          m.material_codigo.toLowerCase().includes(q) ||
          (m.fornecedor && m.fornecedor.toLowerCase().includes(q)) ||
          (m.setor_nome && m.setor_nome.toLowerCase().includes(q)) ||
          (m.numero_documento && m.numero_documento.toLowerCase().includes(q)) ||
          (m.motivo && m.motivo.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.data_movimento).getTime() - new Date(a.data_movimento).getTime());

    res.json(list);
  });

  app.post('/api/movements', (req, res) => {
    const db = loadDatabase();
    const { tipo, material_id, quantidade, data_movimento, fornecedor, custo_unitario, numero_documento, setor_id, motivo, responsavel, observacoes } = req.body;

    if (!tipo || !material_id || !quantidade || Number(quantidade) <= 0) {
      return res.status(400).json({ error: 'Tipo, material e quantidade positiva são obrigatórios.' });
    }

    const materialIdx = db.materials.findIndex((m) => m.id === material_id);
    if (materialIdx === -1) {
      return res.status(404).json({ error: 'Material selecionado não foi encontrado.' });
    }

    const material = db.materials[materialIdx];
    const qty = Number(quantidade);
    const antQty = material.quantidade_atual;
    let postQty = antQty;

    let setorNome = '';
    if (setor_id) {
      const dep = db.departments.find((d) => d.id === setor_id);
      if (dep) setorNome = dep.nome;
    }

    if (tipo === 'ENTRADA') {
      postQty = Number((antQty + qty).toFixed(2));
      const unitCost = custo_unitario !== undefined && Number(custo_unitario) >= 0 ? Number(custo_unitario) : material.custo_unitario;

      // Calculate weighted average cost (custo médio ponderado)
      let newAverageCost = unitCost;
      if (antQty > 0 && postQty > 0) {
        newAverageCost = Number((((antQty * material.custo_unitario) + (qty * unitCost)) / postQty).toFixed(2));
      }

      material.quantidade_atual = postQty;
      material.custo_unitario = newAverageCost;
      material.updated_at = new Date().toISOString();

      const newMov: Movimentacao = {
        id: 'mov-' + Date.now(),
        tipo: 'ENTRADA',
        material_id: material.id,
        material_nome: material.nome,
        material_codigo: material.codigo,
        unidade_medida: material.unidade_medida,
        quantidade: qty,
        quantidade_anterior: antQty,
        quantidade_posterior: postQty,
        data_movimento: data_movimento || new Date().toISOString(),
        fornecedor: fornecedor?.trim() || 'Fornecedor Padrão',
        custo_unitario: unitCost,
        custo_total: Number((qty * unitCost).toFixed(2)),
        numero_documento: numero_documento?.trim() || 'S/N',
        responsavel: responsavel?.trim() || 'Gabriel Henrique',
        observacoes: observacoes?.trim() || '',
      };

      db.movements.unshift(newMov);
      saveDatabase(db);
      return res.status(201).json({ movimentacao: newMov, material });
    } else if (tipo === 'SAIDA') {
      if (qty > antQty) {
        return res.status(400).json({
          error: `Saldo insuficiente para saída! Estoque disponível de ${material.nome}: ${antQty} ${material.unidade_medida}.`,
        });
      }

      postQty = Number((antQty - qty).toFixed(2));
      material.quantidade_atual = postQty;
      material.updated_at = new Date().toISOString();

      const newMov: Movimentacao = {
        id: 'mov-' + Date.now(),
        tipo: 'SAIDA',
        material_id: material.id,
        material_nome: material.nome,
        material_codigo: material.codigo,
        unidade_medida: material.unidade_medida,
        quantidade: qty,
        quantidade_anterior: antQty,
        quantidade_posterior: postQty,
        data_movimento: data_movimento || new Date().toISOString(),
        setor_id: setor_id || undefined,
        setor_nome: setorNome || 'Setor Operacional',
        motivo: motivo?.trim() || 'Consumo interno operacional',
        custo_unitario: material.custo_unitario,
        custo_total: Number((qty * material.custo_unitario).toFixed(2)),
        responsavel: responsavel?.trim() || 'Gabriel Henrique',
        observacoes: observacoes?.trim() || '',
      };

      db.movements.unshift(newMov);
      saveDatabase(db);
      return res.status(201).json({ movimentacao: newMov, material });
    } else {
      return res.status(400).json({ error: 'Tipo de movimentação inválido. Use ENTRADA ou SAIDA.' });
    }
  });

  // Requisitions CRUD & Printing
  app.get('/api/requisitions', (req, res) => {
    const db = loadDatabase();
    // Sort newest first
    const list = [...db.requisitions].sort((a, b) => new Date(b.data_requisicao).getTime() - new Date(a.data_requisicao).getTime());
    res.json(list);
  });

  app.post('/api/requisitions', (req, res) => {
    const db = loadDatabase();
    const { setor_id, solicitante, data_necessidade, prioridade, justificativa, observacoes, itens } = req.body;

    if (!setor_id || !solicitante || !itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'Setor, solicitante e ao menos um item de material são obrigatórios.' });
    }

    const dep = db.departments.find((d) => d.id === setor_id);
    if (!dep) {
      return res.status(404).json({ error: 'Setor informado não existe.' });
    }

    // Generate unique sequential number
    const year = new Date().getFullYear();
    const count = db.requisitions.length + 1;
    const seqStr = String(count).padStart(4, '0');
    const numero = `REQ-${year}-${seqStr}`;

    const formattedItens: RequisicaoItem[] = [];
    for (const item of itens) {
      const mat = db.materials.find((m) => m.id === item.material_id);
      if (!mat) continue;
      formattedItens.push({
        id: 'item-' + Math.random().toString(36).substr(2, 9),
        material_id: mat.id,
        material_nome: mat.nome,
        material_codigo: mat.codigo,
        unidade_medida: mat.unidade_medida,
        quantidade_solicitada: Number(item.quantidade_solicitada) || 1,
        quantidade_atendida: 0,
        observacao: item.observacao?.trim() || '',
      });
    }

    if (formattedItens.length === 0) {
      return res.status(400).json({ error: 'Nenhum material válido foi selecionado para a requisição.' });
    }

    const newReq: Requisicao = {
      id: 'req-' + Date.now(),
      numero,
      setor_id: dep.id,
      setor_nome: dep.nome,
      solicitante: solicitante.trim(),
      data_requisicao: new Date().toISOString(),
      data_necessidade: data_necessidade || undefined,
      prioridade: prioridade || 'Normal',
      status: 'Pendente',
      justificativa: justificativa?.trim() || 'Necessidade operacional de rotina.',
      observacoes: observacoes?.trim() || '',
      itens: formattedItens,
    };

    db.requisitions.unshift(newReq);
    saveDatabase(db);
    res.status(201).json(newReq);
  });

  app.patch('/api/requisitions/:id/status', (req, res) => {
    const db = loadDatabase();
    const { id } = req.params;
    const { status, baixarnoEstoque } = req.body;

    const idx = db.requisitions.findIndex((r) => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Requisição não encontrada.' });
    }

    const reqItem = db.requisitions[idx];
    const prevStatus = reqItem.status;

    if (!['Pendente', 'Aprovada', 'Entregue', 'Cancelada'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    reqItem.status = status;

    if (status === 'Aprovada') {
      reqItem.aprovado_por = 'Gabriel Henrique (Almoxarife Chefe)';
    }

    if (status === 'Entregue') {
      reqItem.entregue_por = 'Gabriel Henrique (Almoxarife)';
      reqItem.data_atendimento = new Date().toISOString();

      // If user selected to automatically deduct stock on delivery
      if (baixarnoEstoque && prevStatus !== 'Entregue') {
        const errors: string[] = [];
        // First check stock availability
        for (const item of reqItem.itens) {
          const mat = db.materials.find((m) => m.id === item.material_id);
          if (!mat) continue;
          if (mat.quantidade_atual < item.quantidade_solicitada) {
            errors.push(`Saldo insuficiente para ${mat.nome} (Estoque: ${mat.quantidade_atual}, Solicitado: ${item.quantidade_solicitada})`);
          }
        }

        if (errors.length > 0) {
          return res.status(400).json({
            error: `Não foi possível dar baixa automática: ${errors.join('; ')}. Ajuste o estoque ou aprove parcialmente.`,
          });
        }

        // Apply deductions & register movements
        for (const item of reqItem.itens) {
          const mat = db.materials.find((m) => m.id === item.material_id);
          if (!mat) continue;

          const antQty = mat.quantidade_atual;
          const postQty = Number((antQty - item.quantidade_solicitada).toFixed(2));
          mat.quantidade_atual = postQty;
          mat.updated_at = new Date().toISOString();
          item.quantidade_atendida = item.quantidade_solicitada;

          db.movements.unshift({
            id: 'mov-' + Date.now() + Math.floor(Math.random() * 100),
            tipo: 'SAIDA',
            material_id: mat.id,
            material_nome: mat.nome,
            material_codigo: mat.codigo,
            unidade_medida: mat.unidade_medida,
            quantidade: item.quantidade_solicitada,
            quantidade_anterior: antQty,
            quantidade_posterior: postQty,
            data_movimento: new Date().toISOString(),
            setor_id: reqItem.setor_id,
            setor_nome: reqItem.setor_nome,
            motivo: `Atendimento da Requisição ${reqItem.numero} (${reqItem.solicitante})`,
            custo_unitario: mat.custo_unitario,
            custo_total: Number((item.quantidade_solicitada * mat.custo_unitario).toFixed(2)),
            numero_documento: reqItem.numero,
            responsavel: 'Gabriel Henrique',
            observacoes: reqItem.justificativa,
          });
        }
      }
    }

    saveDatabase(db);
    res.json(reqItem);
  });

  app.delete('/api/requisitions/:id', (req, res) => {
    const db = loadDatabase();
    const { id } = req.params;
    const idx = db.requisitions.findIndex((r) => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Requisição não encontrada.' });
    }

    const removed = db.requisitions.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ success: true, removed });
  });

  // Analytics & KPIs
  app.get('/api/analytics', (req, res) => {
    const db = loadDatabase();
    const now = new Date();

    let totalValue = 0;
    let criticalCount = 0; // qty == 0
    let belowMinCount = 0; // 0 < qty <= min
    let aboveMaxCount = 0; // qty > max
    let slowMovingCount = 0;

    const criticalList: Material[] = [];
    const belowMinList: Material[] = [];
    const aboveMaxList: Material[] = [];
    const slowMovingList: any[] = [];

    const categoryMap: { [cat: string]: { value: number; count: number } } = {};

    db.materials.forEach((m) => {
      const itemVal = m.quantidade_atual * m.custo_unitario;
      totalValue += itemVal;

      if (!categoryMap[m.categoria]) {
        categoryMap[m.categoria] = { value: 0, count: 0 };
      }
      categoryMap[m.categoria].value += itemVal;
      categoryMap[m.categoria].count += 1;

      if (m.quantidade_atual === 0) {
        criticalCount++;
        criticalList.push(m);
      } else if (m.quantidade_atual <= m.estoque_minimo) {
        belowMinCount++;
        belowMinList.push(m);
      } else if (m.quantidade_atual > m.estoque_maximo) {
        aboveMaxCount++;
        aboveMaxList.push(m);
      }

      // Check movements for slow moving
      const lastMov = db.movements
        .filter((mov) => mov.material_id === m.id)
        .sort((a, b) => new Date(b.data_movimento).getTime() - new Date(a.data_movimento).getTime())[0];

      let days = 999;
      if (lastMov) {
        days = Math.floor(Math.abs(now.getTime() - new Date(lastMov.data_movimento).getTime()) / (1000 * 60 * 60 * 24));
      } else {
        days = Math.floor(Math.abs(now.getTime() - new Date(m.created_at).getTime()) / (1000 * 60 * 60 * 24));
      }

      if (days >= 20) {
        slowMovingCount++;
        slowMovingList.push({
          ...m,
          days_inactive: days,
          last_mov: lastMov ? lastMov.data_movimento : null,
        });
      }
    });

    // Sort slow moving by days inactive descending
    slowMovingList.sort((a, b) => b.days_inactive - a.days_inactive);

    // Movement trends: Last 7 days or periods
    const daysTrendMap: { [day: string]: { date: string; entradas: number; saidas: number; valorEntradas: number; valorSaidas: number } } = {};
    // Seed last 14 days
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      const label = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      daysTrendMap[key] = {
        date: label,
        entradas: 0,
        saidas: 0,
        valorEntradas: 0,
        valorSaidas: 0,
      };
    }

    db.movements.forEach((mov) => {
      const dayKey = mov.data_movimento.split('T')[0];
      if (daysTrendMap[dayKey]) {
        if (mov.tipo === 'ENTRADA') {
          daysTrendMap[dayKey].entradas += mov.quantidade;
          daysTrendMap[dayKey].valorEntradas += mov.custo_total || 0;
        } else if (mov.tipo === 'SAIDA') {
          daysTrendMap[dayKey].saidas += mov.quantidade;
          daysTrendMap[dayKey].valorSaidas += mov.custo_total || 0;
        }
      }
    });

    const movementTrends = Object.values(daysTrendMap);

    // Top requisitioned materials
    const materialOutCount: { [id: string]: { id: string; nome: string; codigo: string; unidade: string; totalSaida: number } } = {};
    db.movements.filter((m) => m.tipo === 'SAIDA').forEach((mov) => {
      if (!materialOutCount[mov.material_id]) {
        materialOutCount[mov.material_id] = {
          id: mov.material_id,
          nome: mov.material_nome,
          codigo: mov.material_codigo,
          unidade: mov.unidade_medida,
          totalSaida: 0,
        };
      }
      materialOutCount[mov.material_id].totalSaida += mov.quantidade;
    });

    const topMaterials = Object.values(materialOutCount)
      .sort((a, b) => b.totalSaida - a.totalSaida)
      .slice(0, 5);

    // Categories array
    const categories = Object.entries(categoryMap).map(([name, data]) => ({
      name,
      value: Number(data.value.toFixed(2)),
      count: data.count,
    }));

    res.json({
      totalValue: Number(totalValue.toFixed(2)),
      totalMaterials: db.materials.length,
      totalDepartments: db.departments.length,
      totalRequisitions: db.requisitions.length,
      pendingRequisitions: db.requisitions.filter((r) => r.status === 'Pendente').length,
      criticalCount,
      belowMinCount,
      aboveMaxCount,
      slowMovingCount,
      criticalList,
      belowMinList,
      aboveMaxList,
      slowMovingList,
      movementTrends,
      topMaterials,
      categories,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Controle de Estoque server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
