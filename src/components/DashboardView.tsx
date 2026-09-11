import React from 'react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  TrendingDown,
  Clock,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  Building2,
  PlusCircle,
  MinusCircle,
  ClipboardList,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { DashboardData, Material } from '../types';

interface DashboardViewProps {
  data: DashboardData;
  onNavigateTab: (tab: any) => void;
  onQuickEntrada: (mat?: Material) => void;
  onQuickSaida: (mat?: Material) => void;
  onQuickRequisicao: () => void;
}

const CATEGORY_COLORS = ['#0a3d62', '#f4d03f', '#00b894', '#0984e3', '#6c5ce7', '#e17055', '#fdcb6e', '#00cec9'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  onNavigateTab,
  onQuickEntrada,
  onQuickSaida,
  onQuickRequisicao,
}) => {
  const kpis = data?.kpis || {
    valor_total_estoque: 0,
    total_materiais: 0,
    itens_em_falta: 0,
    itens_abaixo_minimo: 0,
    itens_acima_maximo: 0,
    itens_movimento_lento: 0,
  };
  const charts = data?.charts || {
    tendencia_movimentacao: [],
    distribuicao_categoria: [],
    top_consumidos: [],
    consumo_por_setor: [],
  };
  const critical_items = data?.critical_items || [];
  const slow_moving_items = data?.slow_moving_items || [];

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0a3d62] via-[#0d4670] to-[#1e5a96] text-white p-6 rounded-2xl shadow-sm border border-blue-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#f4d03f]" />
            Visão Geral Operacional de Almoxarifado
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Space_Grotesk'] text-white">
            Painel de Indicadores & Gestão de Estoque
          </h2>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Acompanhe a posição física em tempo real, valor imobilizado, alertas de reposição e tendências de consumo por setor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onQuickEntrada()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Entrada</span>
          </button>

          <button
            onClick={() => onQuickSaida()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f4d03f] hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <MinusCircle className="w-4 h-4 text-slate-950" />
            <span>Saída</span>
          </button>

          <button
            onClick={onQuickRequisicao}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-blue-50 text-[#0a3d62] text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <ClipboardList className="w-4 h-4 text-[#0a3d62]" />
            <span>Nova Requisição</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Valor */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-2 bg-white rounded-xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Valor Total em Estoque</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#0a3d62]">
              R$ {(kpis.valor_total_estoque || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Distribuído em <strong>{kpis.total_materiais}</strong> códigos de materiais
            </p>
          </div>
        </div>

        {/* Itens em Falta (Crítico) */}
        <div
          onClick={() => onNavigateTab('materials')}
          className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 hover:border-rose-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase">Itens em Falta</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-rose-600 font-mono">{kpis.itens_em_falta}</div>
            <span className="text-[10px] text-slate-400 group-hover:text-rose-600 flex items-center gap-0.5 mt-0.5">
              Saldo Zerado <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Abaixo do Mínimo */}
        <div
          onClick={() => onNavigateTab('materials')}
          className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase">Abaixo do Mín.</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-700 font-mono">{kpis.itens_abaixo_minimo}</div>
            <span className="text-[10px] text-slate-400 group-hover:text-amber-800 flex items-center gap-0.5 mt-0.5">
              Risco Ruptura <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Acima do Máximo */}
        <div
          onClick={() => onNavigateTab('materials')}
          className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 hover:border-purple-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-800 uppercase">Acima do Máx.</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-purple-700 font-mono">{kpis.itens_acima_maximo}</div>
            <span className="text-[10px] text-slate-400 group-hover:text-purple-800 flex items-center gap-0.5 mt-0.5">
              Sobrecarga <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Giro Lento */}
        <div
          onClick={() => onNavigateTab('materials')}
          className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase">Giro Lento</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-800 font-mono">{kpis.itens_movimento_lento}</div>
            <span className="text-[10px] text-slate-400 group-hover:text-blue-700 flex items-center gap-0.5 mt-0.5">
              Sem saída &gt;20d <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Tendência de Movimentação (Entradas vs Saídas) & Distribuição por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Movements Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0a3d62] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1e5a96]" />
                Tendência de Movimentação e Consumo de Estoque
              </h3>
              <p className="text-xs text-slate-400">Volume mensal de itens recebidos (Entrada) vs itens consumidos (Saída)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block"></span> Entradas
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block"></span> Saídas
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.tendencia_movimentacao} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: number) => [`${val} unidades`, '']}
                  contentStyle={{ backgroundColor: '#0a3d62', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="entradas" fill="#10b981" radius={[4, 4, 0, 0]} name="Entradas" />
                <Bar dataKey="saidas" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Saídas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Value Distribution Donut Chart */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-[#0a3d62] flex items-center gap-2">
              <Boxes className="w-4 h-4 text-[#1e5a96]" />
              Valor Imobilizado por Categoria
            </h3>
            <p className="text-xs text-slate-400">Composição percentual do investimento financeiro</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.distribuicao_categoria}
                  dataKey="valor_total"
                  nameKey="categoria"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {charts.distribuicao_categoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
                  contentStyle={{ backgroundColor: '#0a3d62', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100 text-xs max-h-24 overflow-y-auto">
            {charts.distribuicao_categoria.slice(0, 4).map((c, i) => (
              <div key={c.categoria} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 truncate max-w-[130px]">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                  />
                  {c.categoria}
                </span>
                <span className="font-mono font-semibold text-slate-900">
                  R$ {c.valor_total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Top Consumidos & Consumo por Setor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Materials Consumed */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#0a3d62] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#1e5a96]" />
              Materiais com Maior Consumo (Top Saídas)
            </h3>
            <p className="text-xs text-slate-400">Itens com maior rotatividade no período recente</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={charts.top_consumidos}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="nome"
                  tick={{ fontSize: 10, fill: '#1e293b' }}
                  width={110}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: number) => [`${val} unidades`, 'Total Saídas']}
                  contentStyle={{ backgroundColor: '#0a3d62', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                />
                <Bar dataKey="total_saidas" fill="#0a3d62" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consumption by Department */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#0a3d62] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1e5a96]" />
              Consumo por Setor / Centro de Custo
            </h3>
            <p className="text-xs text-slate-400">Alocação dos materiais requisitados pelos departamentos</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.consumo_por_setor} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="setor" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: number) => [`${val} unidades retiradas`, 'Consumo']}
                  contentStyle={{ backgroundColor: '#0a3d62', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                />
                <Bar dataKey="total_saidas" fill="#f4d03f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Stock Alert Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-sm font-bold text-rose-950">Atenção Imediata: Materiais em Ponto de Reposição</h3>
              <p className="text-[11px] text-rose-700">
                Itens com saldo zerado ou abaixo do estoque mínimo exigido para segurança operacional
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('materials')}
            className="text-xs text-[#0a3d62] font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            Ver todos no catálogo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Código SKU</th>
                <th className="px-4 py-2.5">Material</th>
                <th className="px-4 py-2.5">Localização</th>
                <th className="px-4 py-2.5 text-center">Saldo Atual</th>
                <th className="px-4 py-2.5 text-center">Estoque Mínimo</th>
                <th className="px-4 py-2.5 text-center">Status</th>
                <th className="px-4 py-2.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {critical_items.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#0a3d62]">{m.codigo}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{m.nome}</div>
                    <div className="text-[10px] text-slate-500">{m.categoria}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{m.localizacao || 'Almoxarifado'}</td>
                  <td className="px-4 py-3 text-center font-bold text-rose-600 text-sm">
                    {m.quantidade_atual} {m.unidade_medida}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600 font-medium">
                    {m.estoque_minimo} {m.unidade_medida}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {m.status === 'CRITICO' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        🚨 Falta / Zerado
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        ⚠️ Abaixo do Mínimo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onQuickEntrada(m)}
                      className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer active:scale-95 inline-flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Registrar Compra</span>
                    </button>
                  </td>
                </tr>
              ))}
              {critical_items.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-emerald-700 font-semibold text-xs">
                    Parabéns! Todos os materiais estão com estoque acima do nível mínimo de segurança.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
