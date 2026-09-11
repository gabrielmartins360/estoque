import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  PlusCircle,
  MinusCircle,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  Clock,
  Layers,
  MapPin,
  DollarSign
} from 'lucide-react';
import { Material, StockStatus } from '../types';

interface MaterialsViewProps {
  materials: Material[];
  onAddMaterial: (data: Partial<Material>) => Promise<void>;
  onUpdateMaterial: (id: string, data: Partial<Material>) => Promise<void>;
  onDeleteMaterial: (id: string) => Promise<void>;
  onQuickEntrada: (material: Material) => void;
  onQuickSaida: (material: Material) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
  onQuickEntrada,
  onQuickSaida,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Geral');
  const [unidadeMedida, setUnidadeMedida] = useState('UN');
  const [quantidadeAtual, setQuantidadeAtual] = useState<number>(0);
  const [estoqueMinimo, setEstoqueMinimo] = useState<number>(10);
  const [estoqueMaximo, setEstoqueMaximo] = useState<number>(100);
  const [custoUnitario, setCustoUnitario] = useState<number>(0);
  const [localizacao, setLocalizacao] = useState('');
  const [descricao, setDescricao] = useState('');

  const categories = ['Todas', ...Array.from(new Set(materials.map((m) => m.categoria)))];

  const openAddModal = () => {
    setEditingMaterial(null);
    setCodigo('');
    setNome('');
    setCategoria('Geral');
    setUnidadeMedida('UN');
    setQuantidadeAtual(0);
    setEstoqueMinimo(10);
    setEstoqueMaximo(100);
    setCustoUnitario(0);
    setLocalizacao('Prateleira A-01');
    setDescricao('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (m: Material) => {
    setEditingMaterial(m);
    setCodigo(m.codigo);
    setNome(m.nome);
    setCategoria(m.categoria);
    setUnidadeMedida(m.unidade_medida);
    setQuantidadeAtual(m.quantidade_atual);
    setEstoqueMinimo(m.estoque_minimo);
    setEstoqueMaximo(m.estoque_maximo);
    setCustoUnitario(m.custo_unitario);
    setLocalizacao(m.localizacao || '');
    setDescricao(m.descricao || '');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim() || !nome.trim() || !unidadeMedida.trim()) {
      setErrorMsg('Preencha código, nome e unidade de medida.');
      return;
    }

    if (Number(estoqueMaximo) < Number(estoqueMinimo)) {
      setErrorMsg('O estoque máximo não pode ser menor do que o estoque mínimo.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    try {
      if (editingMaterial) {
        await onUpdateMaterial(editingMaterial.id, {
          codigo,
          nome,
          categoria,
          unidade_medida: unidadeMedida,
          estoque_minimo: Number(estoqueMinimo),
          estoque_maximo: Number(estoqueMaximo),
          custo_unitario: Number(custoUnitario),
          localizacao,
          descricao,
        });
      } else {
        await onAddMaterial({
          codigo,
          nome,
          categoria,
          unidade_medida: unidadeMedida,
          quantidade_atual: Number(quantidadeAtual),
          estoque_minimo: Number(estoqueMinimo),
          estoque_maximo: Number(estoqueMaximo),
          custo_unitario: Number(custoUnitario),
          localizacao,
          descricao,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar material.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteMaterial(id);
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert(err.message || 'Não foi possível excluir o material.');
    }
  };

  const filteredMaterials = materials.filter((m) => {
    const matchSearch =
      m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.localizacao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = categoryFilter === 'Todas' || m.categoria === categoryFilter;

    let matchStatus = true;
    if (statusFilter === 'CRITICO') matchStatus = m.status === 'CRITICO';
    else if (statusFilter === 'ALERTA') matchStatus = m.status === 'ALERTA';
    else if (statusFilter === 'NORMAL') matchStatus = m.status === 'NORMAL';
    else if (statusFilter === 'EXCESSO') matchStatus = m.status === 'EXCESSO';
    else if (statusFilter === 'LENTO') matchStatus = m.is_slow_moving;

    return matchSearch && matchCategory && matchStatus;
  });

  const getStatusBadge = (status: StockStatus, isSlow: boolean) => {
    if (status === 'CRITICO') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          Falta / Zerado
        </span>
      );
    }
    if (status === 'ALERTA') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Abaixo do Mínimo
        </span>
      );
    }
    if (status === 'EXCESSO') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
          <TrendingDown className="w-3 h-3 text-purple-600" />
          Acima do Máximo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Normal
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0a3d62] flex items-center gap-2">
            <Package className="w-6 h-6 text-[#1e5a96]" />
            Catálogo e Gestão de Materiais
          </h2>
          <p className="text-xs text-slate-500">
            Controle de SKUs, quantidades em estoque físico, estoque de segurança, custos e localização
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a3d62] hover:bg-[#1e5a96] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#f4d03f]" />
          <span>Cadastrar Novo Material</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome, código SKU, categoria ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden cursor-pointer"
          >
            <option value="Todos">Todos os Status</option>
            <option value="CRITICO">🚨 Falta / Zerados</option>
            <option value="ALERTA">⚠️ Abaixo do Mínimo</option>
            <option value="NORMAL">✅ Saldo Normal</option>
            <option value="EXCESSO">📦 Acima do Máximo</option>
            <option value="LENTO">⏳ Movimento Lento (&gt;20d)</option>
          </select>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a3d62]/5 border-b border-slate-200 text-[#0a3d62] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Código / SKU</th>
                <th className="px-4 py-3">Material & Categoria</th>
                <th className="px-4 py-3 text-center">Unid.</th>
                <th className="px-4 py-3">Saldo vs. Mín/Máx</th>
                <th className="px-4 py-3 text-right">Custo Un.</th>
                <th className="px-4 py-3 text-right">Valor em Estoque</th>
                <th className="px-4 py-3">Localização</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMaterials.map((m) => {
                const percentMin = Math.min(100, Math.round((m.quantidade_atual / (m.estoque_maximo || 1)) * 100));

                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#0a3d62] whitespace-nowrap">
                      {m.codigo}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{m.nome}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500">{m.categoria}</span>
                        {m.is_slow_moving && (
                          <span
                            className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold"
                            title={`Sem movimentação há ${m.days_since_movement} dias`}
                          >
                            <Clock className="w-2.5 h-2.5 text-amber-600" />
                            Giro Lento
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center font-bold text-slate-600">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                        {m.unidade_medida}
                      </span>
                    </td>

                    <td className="px-4 py-3 min-w-[170px]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-900 text-sm">
                          {m.quantidade_atual}{' '}
                          <span className="text-[10px] text-slate-500 font-normal">{m.unidade_medida}</span>
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Mín: {m.estoque_minimo} | Máx: {m.estoque_maximo}
                        </span>
                      </div>
                      {/* Gauge Bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full transition-all ${
                            m.status === 'CRITICO'
                              ? 'bg-rose-500'
                              : m.status === 'ALERTA'
                              ? 'bg-amber-400'
                              : m.status === 'EXCESSO'
                              ? 'bg-purple-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(5, percentMin)}%` }}
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right font-mono text-slate-700">
                      R$ {m.custo_unitario.toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      R$ {m.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      <div className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[120px]">{m.localizacao || 'Almoxarifado'}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(m.status, m.is_slow_moving)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onQuickEntrada(m)}
                          title="Registrar Entrada Rápida"
                          className="p-1 rounded-md text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onQuickSaida(m)}
                          title="Registrar Saída Rápida"
                          className="p-1 rounded-md text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openEditModal(m)}
                          title="Editar Material"
                          className="p-1 rounded-md text-slate-600 hover:text-[#0a3d62] hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {deleteConfirmId === m.id ? (
                          <div className="flex items-center gap-1 bg-rose-50 p-0.5 rounded border border-rose-300">
                            <button
                              onClick={() => handleDelete(m.id)}
                              className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
                            >
                              Sim
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] hover:bg-slate-300 cursor-pointer"
                            >
                              Não
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(m.id)}
                            title="Excluir Material"
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMaterials.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Nenhum material encontrado com os filtros selecionados.</p>
            <p className="text-xs text-slate-400 mt-1">Experimente limpar a busca ou adicionar um novo item.</p>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Material */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#0a3d62] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Package className="w-4 h-4 text-[#f4d03f]" />
                {editingMaterial ? 'Editar Dados do Material' : 'Cadastrar Novo Material no Estoque'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto grow">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="font-semibold text-slate-700 block mb-1">Código / SKU *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: EPI-005, MEC-102"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden font-mono uppercase"
                  />
                </div>

                <div className="col-span-1">
                  <label className="font-semibold text-slate-700 block mb-1">Unidade de Medida *</label>
                  <select
                    value={unidadeMedida}
                    onChange={(e) => setUnidadeMedida(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden font-mono"
                  >
                    <option value="UN">UN - Unidade</option>
                    <option value="PAR">PAR - Par</option>
                    <option value="KG">KG - Quilograma</option>
                    <option value="L">L - Litro</option>
                    <option value="M">M - Metro</option>
                    <option value="CX">CX - Caixa</option>
                    <option value="ROLO">ROLO - Rolo</option>
                    <option value="GL">GL - Galão</option>
                    <option value="PC">PC - Peça</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="font-semibold text-slate-700 block mb-1">Categoria</label>
                  <input
                    type="text"
                    list="category-suggestions"
                    placeholder="Ex: EPI e Segurança"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden"
                  />
                  <datalist id="category-suggestions">
                    <option value="EPI e Segurança" />
                    <option value="Ferramentas e Abrasivos" />
                    <option value="Elétrica e Automação" />
                    <option value="Peças e Mecânica" />
                    <option value="Lubrificantes e Químicos" />
                    <option value="Suprimentos Corporativos" />
                    <option value="Limpeza e Higiene" />
                    <option value="Soldagem e Caldeiraria" />
                  </datalist>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nome Completo do Material *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Luva de Vaqueta Mista Reforçada com Punho Longo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {!editingMaterial && (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Qtd. Inicial</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={quantidadeAtual}
                      onChange={(e) => setQuantidadeAtual(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="font-semibold text-amber-800 block mb-1">Estoque Mínimo *</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={estoqueMinimo}
                    onChange={(e) => setEstoqueMinimo(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono bg-amber-50/40"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Estoque Máximo *</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={estoqueMaximo}
                    onChange={(e) => setEstoqueMaximo(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={custoUnitario}
                    onChange={(e) => setCustoUnitario(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Localização no Almoxarifado</label>
                <input
                  type="text"
                  placeholder="Ex: Prateleira B-04, Gaveteiro 02, Almoxarifado Central"
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Descrição / Especificações Técnicas</label>
                <textarea
                  rows={2}
                  placeholder="Detalhes adicionais, norma técnica, compatibilidade ou marca..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-[#0a3d62] hover:bg-[#1e5a96] text-white font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <span>{isSaving ? 'Salvando...' : editingMaterial ? 'Atualizar Material' : 'Cadastrar Material'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
