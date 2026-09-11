export type StockStatus = 'CRITICO' | 'ALERTA' | 'NORMAL' | 'EXCESSO';

export interface Material {
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
  status: StockStatus;
  valor_total: number;
  days_since_movement: number;
  is_slow_moving: boolean;
  last_movement_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Setor {
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

export interface Movimentacao {
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

export interface RequisicaoItem {
  id: string;
  material_id: string;
  material_nome: string;
  material_codigo: string;
  unidade_medida: string;
  quantidade_solicitada: number;
  quantidade_atendida: number;
  observacao?: string;
}

export interface Requisicao {
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

export interface AnalyticsData {
  totalValue: number;
  totalMaterials: number;
  totalDepartments: number;
  totalRequisitions: number;
  pendingRequisitions: number;
  criticalCount: number;
  belowMinCount: number;
  aboveMaxCount: number;
  slowMovingCount: number;
  criticalList: Material[];
  belowMinList: Material[];
  aboveMaxList: Material[];
  slowMovingList: Array<Material & { days_inactive: number; last_mov?: string | null }>;
  movementTrends: Array<{
    date: string;
    entradas: number;
    saidas: number;
    valorEntradas: number;
    valorSaidas: number;
  }>;
  topMaterials: Array<{
    id: string;
    nome: string;
    codigo: string;
    unidade: string;
    totalSaida: number;
  }>;
  categories: Array<{
    name: string;
    value: number;
    count: number;
  }>;
}

export type NavigationTab =
  | 'dashboard'
  | 'materials'
  | 'movements'
  | 'requisitions'
  | 'departments'
  | 'best-practices';

export interface DashboardData {
  kpis: {
    valor_total_estoque: number;
    total_materiais: number;
    itens_em_falta: number;
    itens_abaixo_minimo: number;
    itens_acima_maximo: number;
    itens_movimento_lento: number;
  };
  charts: {
    tendencia_movimentacao: Array<{ mes: string; entradas: number; saidas: number }>;
    distribuicao_categoria: Array<{ categoria: string; valor_total: number; count: number }>;
    top_consumidos: Array<{ nome: string; total_saidas: number }>;
    consumo_por_setor: Array<{ setor: string; total_saidas: number }>;
  };
  critical_items: Material[];
  slow_moving_items: Array<Material & { days_inactive: number; last_mov?: string | null }>;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  perfil: 'admin' | 'operador';
  token?: string;
}
