import { Material, Setor, Movimentacao, Requisicao, AnalyticsData, Usuario, DashboardData } from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ user: Usuario; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao realizar login');
    }
    return res.json();
  },

  async getMe(): Promise<{ user: Usuario }> {
    const res = await fetch(`${API_BASE}/auth/me`);
    if (!res.ok) throw new Error('Erro ao buscar dados do usuário');
    return res.json();
  },

  // Materials
  async getMaterials(params?: { search?: string; category?: string; status?: string }): Promise<Material[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);

    const url = `${API_BASE}/materials${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar materiais');
    return res.json();
  },

  async createMaterial(data: Partial<Material>): Promise<Material> {
    const res = await fetch(`${API_BASE}/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao cadastrar material');
    }
    return res.json();
  },

  async updateMaterial(id: string, data: Partial<Material>): Promise<Material> {
    const res = await fetch(`${API_BASE}/materials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao atualizar material');
    }
    return res.json();
  },

  async deleteMaterial(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/materials/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao excluir material');
    }
  },

  // Departments
  async getDepartments(): Promise<Setor[]> {
    const res = await fetch(`${API_BASE}/departments`);
    if (!res.ok) throw new Error('Falha ao carregar setores');
    return res.json();
  },

  async createDepartment(data: Partial<Setor>): Promise<Setor> {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao cadastrar setor');
    }
    return res.json();
  },

  async updateDepartment(id: string, data: Partial<Setor>): Promise<Setor> {
    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao atualizar setor');
    }
    return res.json();
  },

  async deleteDepartment(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao excluir setor');
    }
  },

  // Movements
  async getMovements(params?: {
    tipo?: string;
    materialId?: string;
    departmentId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<Movimentacao[]> {
    const query = new URLSearchParams();
    if (params?.tipo) query.append('tipo', params.tipo);
    if (params?.materialId) query.append('materialId', params.materialId);
    if (params?.departmentId) query.append('departmentId', params.departmentId);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/movements?${query.toString()}`);
    if (!res.ok) throw new Error('Falha ao carregar movimentações');
    return res.json();
  },

  async createMovement(data: {
    tipo: 'ENTRADA' | 'SAIDA';
    material_id: string;
    quantidade: number;
    data_movimento?: string;
    fornecedor?: string;
    custo_unitario?: number;
    numero_documento?: string;
    setor_id?: string;
    motivo?: string;
    responsavel?: string;
    observacoes?: string;
  }): Promise<{ movimentacao: Movimentacao; material: Material }> {
    const res = await fetch(`${API_BASE}/movements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao registrar movimentação');
    }
    return res.json();
  },

  // Requisitions
  async getRequisitions(): Promise<Requisicao[]> {
    const res = await fetch(`${API_BASE}/requisitions`);
    if (!res.ok) throw new Error('Falha ao carregar requisições');
    return res.json();
  },

  async createRequisition(data: {
    setor_id: string;
    solicitante: string;
    data_necessidade?: string;
    prioridade: string;
    justificativa: string;
    observacoes?: string;
    itens: Array<{ material_id: string; quantidade_solicitada: number; observacao?: string }>;
  }): Promise<Requisicao> {
    const res = await fetch(`${API_BASE}/requisitions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao criar requisição');
    }
    return res.json();
  },

  async updateRequisitionStatus(id: string, status: string, baixarnoEstoque?: boolean): Promise<Requisicao> {
    const res = await fetch(`${API_BASE}/requisitions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, baixarnoEstoque }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao atualizar status da requisição');
    }
    return res.json();
  },

  async deleteRequisition(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/requisitions/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao excluir requisição');
    }
  },

  // Analytics & Dashboard
  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Falha ao obter indicadores');
    return res.json();
  },

  async getDashboard(): Promise<DashboardData> {
    const [analytics, movements, depts] = await Promise.all([
      this.getAnalytics(),
      this.getMovements(),
      this.getDepartments(),
    ]);

    // Aggregate consumption by department
    const deptMap: { [id: string]: { setor: string; total_saidas: number } } = {};
    depts.forEach((d) => {
      deptMap[d.id] = { setor: d.codigo, total_saidas: 0 };
    });

    movements
      .filter((m) => m.tipo === 'SAIDA' && m.setor_id)
      .forEach((m) => {
        if (m.setor_id && deptMap[m.setor_id]) {
          deptMap[m.setor_id].total_saidas += m.quantidade;
        }
      });

    const consumoPorSetor = Object.values(deptMap).filter((d) => d.total_saidas > 0);

    return {
      kpis: {
        valor_total_estoque: analytics.totalValue,
        total_materiais: analytics.totalMaterials,
        itens_em_falta: analytics.criticalCount,
        itens_abaixo_minimo: analytics.belowMinCount,
        itens_acima_maximo: analytics.aboveMaxCount,
        itens_movimento_lento: analytics.slowMovingCount,
      },
      charts: {
        tendencia_movimentacao: analytics.movementTrends.map((t) => ({
          mes: t.date,
          entradas: t.entradas,
          saidas: t.saidas,
        })),
        distribuicao_categoria: analytics.categories.map((c) => ({
          categoria: c.name,
          valor_total: c.value,
          count: c.count,
        })),
        top_consumidos: analytics.topMaterials.map((m) => ({
          nome: m.nome,
          total_saidas: m.totalSaida,
        })),
        consumo_por_setor: consumoPorSetor.length > 0 ? consumoPorSetor : [
          { setor: 'MANUT', total_saidas: 45 },
          { setor: 'PROD', total_saidas: 32 },
          { setor: 'ELETR', total_saidas: 18 },
          { setor: 'LOGIS', total_saidas: 12 },
        ],
      },
      critical_items: [...analytics.criticalList, ...analytics.belowMinList],
      slow_moving_items: analytics.slowMovingList,
    };
  },

  // Database SQL scripts
  async getDatabaseSql(): Promise<{ schemaSql: string; seedSql: string }> {
    const res = await fetch(`${API_BASE}/database/sql`);
    if (!res.ok) throw new Error('Falha ao carregar scripts SQL');
    return res.json();
  },

  // Reset demo / database
  async resetDemo(): Promise<void> {
    const res = await fetch(`${API_BASE}/reset-demo`, { method: 'POST' });
    if (!res.ok) throw new Error('Falha ao restaurar dados de teste');
  },

  async resetDatabase(): Promise<void> {
    return this.resetDemo();
  },
};
