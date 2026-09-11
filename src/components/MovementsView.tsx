import React, { useState } from 'react';
import {
  ArrowLeftRight,
  PlusCircle,
  MinusCircle,
  Download,
  Calendar,
  Filter,
  Search,
  Package,
  Building2,
  FileText,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  DollarSign
} from 'lucide-react';
import { Movimentacao, Material, Setor } from '../types';

interface MovementsViewProps {
  movements: Movimentacao[];
  materials: Material[];
  departments: Setor[];
  onAddMovement: (data: any) => Promise<any>;
  isEntradaOpen: boolean;
  isSaidaOpen: boolean;
  onOpenEntrada: () => void;
  onCloseEntrada: () => void;
  onOpenSaida: () => void;
  onCloseSaida: () => void;
  presetMaterial?: Material | null;
}

export const MovementsView: React.FC<MovementsViewProps> = ({
  movements,
  materials,
  departments,
  onAddMovement,
  isEntradaOpen,
  isSaidaOpen,
  onOpenEntrada,
  onCloseEntrada,
  onOpenSaida,
  onCloseSaida,
  presetMaterial,
}) => {
  // Filter states
  const [filterTipo, setFilterTipo] = useState<string>('TODOS');
  const [filterMaterial, setFilterMaterial] = useState<string>('TODOS');
  const [filterSetor, setFilterSetor] = useState<string>('TODOS');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form states - Entrada
  const [inMaterialId, setInMaterialId] = useState<string>(presetMaterial?.id || materials[0]?.id || '');
  const [inQuantidade, setInQuantidade] = useState<number>(1);
  const [inData, setInData] = useState<string>(new Date().toISOString().slice(0, 16));
  const [inFornecedor, setInFornecedor] = useState<string>('');
  const [inCusto, setInCusto] = useState<number>(0);
  const [inDocumento, setInDocumento] = useState<string>('');
  const [inResponsavel, setInResponsavel] = useState<string>('Gabriel Henrique');
  const [inObservacoes, setInObservacoes] = useState<string>('');

  // Form states - Saída
  const [outMaterialId, setOutMaterialId] = useState<string>(presetMaterial?.id || materials[0]?.id || '');
  const [outQuantidade, setOutQuantidade] = useState<number>(1);
  const [outData, setOutData] = useState<string>(new Date().toISOString().slice(0, 16));
  const [outSetorId, setOutSetorId] = useState<string>(departments[0]?.id || '');
  const [outMotivo, setOutMotivo] = useState<string>('Consumo Regular no Turno');
  const [outResponsavel, setOutResponsavel] = useState<string>('Gabriel Henrique');
  const [outObservacoes, setOutObservacoes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync preset material if passed
  React.useEffect(() => {
    if (presetMaterial) {
      setInMaterialId(presetMaterial.id);
      setOutMaterialId(presetMaterial.id);
      setInCusto(presetMaterial.custo_unitario);
    }
  }, [presetMaterial]);

  // Sync initial selection when materials or departments load
  React.useEffect(() => {
    if (!inMaterialId && materials.length > 0) {
      setInMaterialId(materials[0].id);
      setInCusto(materials[0].custo_unitario);
    }
    if (!outMaterialId && materials.length > 0) {
      setOutMaterialId(materials[0].id);
    }
    if (!outSetorId && departments.length > 0) {
      setOutSetorId(departments[0].id);
    }
  }, [materials, departments]);

  // When selected material changes in Entrada, update cost
  const handleInMaterialChange = (matId: string) => {
    setInMaterialId(matId);
    const m = materials.find((item) => item.id === matId);
    if (m) {
      setInCusto(m.custo_unitario);
    }
  };

  const selectedOutMaterial = materials.find((m) => m.id === outMaterialId);

  const handleEntradaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inMaterialId || inQuantidade <= 0) {
      setFormError('Selecione o material e informe uma quantidade maior que zero.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await onAddMovement({
        tipo: 'ENTRADA',
        material_id: inMaterialId,
        quantidade: Number(inQuantidade),
        data_movimento: inData ? new Date(inData).toISOString() : new Date().toISOString(),
        fornecedor: inFornecedor,
        custo_unitario: Number(inCusto),
        numero_documento: inDocumento,
        responsavel: inResponsavel,
        observacoes: inObservacoes,
      });
      onCloseEntrada();
      // Reset
      setInQuantidade(1);
      setInDocumento('');
      setInObservacoes('');
    } catch (err: any) {
      setFormError(err.message || 'Erro ao registrar entrada.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaidaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outMaterialId || outQuantidade <= 0) {
      setFormError('Selecione o material e informe uma quantidade maior que zero.');
      return;
    }

    if (selectedOutMaterial && outQuantidade > selectedOutMaterial.quantidade_atual) {
      setFormError(
        `Saldo insuficiente! Estoque atual de ${selectedOutMaterial.nome}: ${selectedOutMaterial.quantidade_atual} ${selectedOutMaterial.unidade_medida}.`
      );
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await onAddMovement({
        tipo: 'SAIDA',
        material_id: outMaterialId,
        quantidade: Number(outQuantidade),
        data_movimento: outData ? new Date(outData).toISOString() : new Date().toISOString(),
        setor_id: outSetorId,
        motivo: outMotivo,
        responsavel: outResponsavel,
        observacoes: outObservacoes,
      });
      onCloseSaida();
      // Reset
      setOutQuantidade(1);
      setOutObservacoes('');
    } catch (err: any) {
      setFormError(err.message || 'Erro ao registrar saída.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter movements
  const filteredMovements = movements.filter((m) => {
    if (filterTipo !== 'TODOS' && m.tipo !== filterTipo) return false;
    if (filterMaterial !== 'TODOS' && m.material_id !== filterMaterial) return false;
    if (filterSetor !== 'TODOS' && m.setor_id !== filterSetor) return false;

    if (startDate) {
      const movDate = new Date(m.data_movimento).getTime();
      const sDate = new Date(startDate).getTime();
      if (movDate < sDate) return false;
    }

    if (endDate) {
      const movDate = new Date(m.data_movimento).getTime();
      const eDate = new Date(endDate);
      eDate.setHours(23, 59, 59, 999);
      if (movDate > eDate.getTime()) return false;
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchText =
        m.material_nome.toLowerCase().includes(q) ||
        m.material_codigo.toLowerCase().includes(q) ||
        (m.fornecedor && m.fornecedor.toLowerCase().includes(q)) ||
        (m.setor_nome && m.setor_nome.toLowerCase().includes(q)) ||
        (m.numero_documento && m.numero_documento.toLowerCase().includes(q)) ||
        (m.motivo && m.motivo.toLowerCase().includes(q));
      if (!matchText) return false;
    }

    return true;
  });

  // Calculate totals of filtered movements
  let totalEntradasQtd = 0;
  let totalEntradasValor = 0;
  let totalSaidasQtd = 0;
  let totalSaidasValor = 0;

  filteredMovements.forEach((m) => {
    if (m.tipo === 'ENTRADA') {
      totalEntradasQtd += m.quantidade;
      totalEntradasValor += m.custo_total || 0;
    } else if (m.tipo === 'SAIDA') {
      totalSaidasQtd += m.quantidade;
      totalSaidasValor += m.custo_total || 0;
    }
  });

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      'Data/Hora',
      'Tipo',
      'Código SKU',
      'Material',
      'Unidade',
      'Quantidade',
      'Saldo Anterior',
      'Saldo Posterior',
      'Custo Unitário',
      'Valor Total',
      'Fornecedor / Origem',
      'Setor / Destino',
      'Documento / NF',
      'Motivo',
      'Responsável Operacional',
    ];

    const rows = filteredMovements.map((m) => [
      `"${new Date(m.data_movimento).toLocaleString('pt-BR')}"`,
      `"${m.tipo}"`,
      `"${m.material_codigo}"`,
      `"${m.material_nome}"`,
      `"${m.unidade_medida}"`,
      m.quantidade,
      m.quantidade_anterior,
      m.quantidade_posterior,
      (m.custo_unitario || 0).toFixed(2),
      (m.custo_total || 0).toFixed(2),
      `"${m.fornecedor || ''}"`,
      `"${m.setor_nome || ''}"`,
      `"${m.numero_documento || ''}"`,
      `"${m.motivo || ''}"`,
      `"${m.responsavel}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `historico_movimentacoes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0a3d62] flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-[#1e5a96]" />
            Movimentação de Estoque e Almoxarifado
          </h2>
          <p className="text-xs text-slate-500">
            Registro de entradas de fornecedores, saídas para departamentos e histórico auditável
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenEntrada}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>Registrar Entrada</span>
          </button>

          <button
            onClick={onOpenSaida}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <MinusCircle className="w-4 h-4 text-slate-950" />
            <span>Registrar Saída</span>
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Exportar dados filtrados para planilha CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Exportar</span> CSV
          </button>
        </div>
      </div>

      {/* Summary KPI Cards of current filtered view */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 block uppercase">Entradas (Volume)</span>
          <div className="text-xl font-bold text-slate-900 mt-1 flex items-baseline gap-1">
            {totalEntradasQtd.toLocaleString('pt-BR')}
            <span className="text-xs text-slate-500 font-normal">itens</span>
          </div>
          <span className="text-[10px] text-slate-400">Total de unidades recebidas</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 block uppercase">Valor Entradas</span>
          <div className="text-xl font-bold text-emerald-600 mt-1 font-mono">
            R$ {totalEntradasValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400">Custo financeiro adquirido</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700 block uppercase">Saídas (Volume)</span>
          <div className="text-xl font-bold text-slate-900 mt-1 flex items-baseline gap-1">
            {totalSaidasQtd.toLocaleString('pt-BR')}
            <span className="text-xs text-slate-500 font-normal">itens</span>
          </div>
          <span className="text-[10px] text-slate-400">Consumo pelos setores</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700 block uppercase">Valor Saídas</span>
          <div className="text-xl font-bold text-amber-600 mt-1 font-mono">
            R$ {totalSaidasValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400">Custo financeiro consumido</span>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por material, fornecedor, setor ou NF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden bg-slate-50/50"
            />
          </div>

          {/* Tipo */}
          <div>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden cursor-pointer"
            >
              <option value="TODOS">Todos os Tipos (Entrada e Saída)</option>
              <option value="ENTRADA">🟢 Apenas Entradas</option>
              <option value="SAIDA">🟠 Apenas Saídas</option>
            </select>
          </div>

          {/* Material */}
          <div>
            <select
              value={filterMaterial}
              onChange={(e) => setFilterMaterial(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden cursor-pointer"
            >
              <option value="TODOS">Todos os Materiais</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.codigo} - {m.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Setor */}
          <div>
            <select
              value={filterSetor}
              onChange={(e) => setFilterSetor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden cursor-pointer"
            >
              <option value="TODOS">Todos os Setores Solicitantes</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.codigo} - {d.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date range filter */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Período:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-[#1e5a96]"
            />
            <span className="text-slate-400">até</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-[#1e5a96]"
            />
          </div>

          {(startDate || endDate || filterTipo !== 'TODOS' || filterMaterial !== 'TODOS' || filterSetor !== 'TODOS' || searchTerm) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setFilterTipo('TODOS');
                setFilterMaterial('TODOS');
                setFilterSetor('TODOS');
                setSearchTerm('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline ml-auto"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a3d62]/5 border-b border-slate-200 text-[#0a3d62] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Data / Hora</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Código SKU & Material</th>
                <th className="px-4 py-3 text-center">Qtd. & Unid.</th>
                <th className="px-4 py-3">Saldo (Antes → Depois)</th>
                <th className="px-4 py-3">Origem / Destino</th>
                <th className="px-4 py-3">Doc / Motivo</th>
                <th className="px-4 py-3 text-right">Valor Total</th>
                <th className="px-4 py-3">Operador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMovements.map((mov) => {
                const isEntrada = mov.tipo === 'ENTRADA';
                const dateObj = new Date(mov.data_movimento);
                const dateFmt = dateObj.toLocaleDateString('pt-BR');
                const timeFmt = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                return (
                  <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{dateFmt}</div>
                      <div className="text-[10px] text-slate-400">{timeFmt}</div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {isEntrada ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                          ENTRADA
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <ArrowUpRight className="w-3 h-3 text-amber-600" />
                          SAÍDA
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{mov.material_nome}</div>
                      <div className="text-[10px] font-mono text-slate-500">{mov.material_codigo}</div>
                    </td>

                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span
                        className={`font-bold text-sm ${isEntrada ? 'text-emerald-700' : 'text-amber-700'}`}
                      >
                        {isEntrada ? '+' : '-'}
                        {mov.quantidade}
                      </span>{' '}
                      <span className="text-[10px] text-slate-500 font-mono">{mov.unidade_medida}</span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-mono">
                      <span className="text-slate-400">{mov.quantidade_anterior}</span>
                      <span className="text-slate-300 mx-1">→</span>
                      <span className="font-bold text-slate-800">{mov.quantidade_posterior}</span>
                    </td>

                    <td className="px-4 py-3 text-xs">
                      {isEntrada ? (
                        <div className="truncate max-w-[160px] font-medium text-slate-800">
                          {mov.fornecedor || 'Fornecedor Externo'}
                        </div>
                      ) : (
                        <div className="truncate max-w-[160px] font-semibold text-[#0a3d62]">
                          {mov.setor_nome || 'Setor Operacional'}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-xs">
                      <div className="font-medium text-slate-800 truncate max-w-[150px]">
                        {mov.numero_documento || mov.motivo || '—'}
                      </div>
                      {mov.observacoes && (
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]" title={mov.observacoes}>
                          {mov.observacoes}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                      R$ {(mov.custo_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3 text-[11px] text-slate-500 whitespace-nowrap">
                      {mov.responsavel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMovements.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <ArrowLeftRight className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Nenhuma movimentação encontrada para estes filtros.</p>
            <p className="text-xs text-slate-400 mt-1">Experimente alargar o período de datas ou limpar a pesquisa.</p>
          </div>
        )}
      </div>

      {/* Modal - Registrar Nova Entrada */}
      {isEntradaOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-200" />
                Registrar Entrada de Materiais (Recebimento)
              </h3>
              <button
                onClick={onCloseEntrada}
                className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleEntradaSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Material do Almoxarifado *</label>
                <select
                  required
                  value={inMaterialId}
                  onChange={(e) => handleInMaterialChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.codigo}] {m.nome} — Saldo Atual: {m.quantidade_atual} {m.unidade_medida}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quantidade Recebida *</label>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    required
                    value={inQuantidade}
                    onChange={(e) => setInQuantidade(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Data / Hora de Entrada</label>
                  <input
                    type="datetime-local"
                    value={inData}
                    onChange={(e) => setInData(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fornecedor / Origem *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Comercial Metalúrgica Ltda"
                    value={inFornecedor}
                    onChange={(e) => setInFornecedor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nº Nota Fiscal / Documento</label>
                  <input
                    type="text"
                    placeholder="Ex: NF-e 45218"
                    value={inDocumento}
                    onChange={(e) => setInDocumento(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Custo Unitário de Aquisição (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={inCusto}
                    onChange={(e) => setInCusto(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Recalcula custo médio ponderado automaticamente</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Responsável pelo Recebimento</label>
                  <input
                    type="text"
                    value={inResponsavel}
                    onChange={(e) => setInResponsavel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Observações de Recebimento</label>
                <textarea
                  rows={2}
                  placeholder="Lote do fabricante, validade, condições da embalagem..."
                  value={inObservacoes}
                  onChange={(e) => setInObservacoes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCloseEntrada}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? 'Gravando Entrada...' : 'Confirmar Entrada no Estoque'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Registrar Nova Saída */}
      {isSaidaOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-amber-500 text-slate-950 px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <MinusCircle className="w-4 h-4 text-slate-950" />
                Registrar Saída de Materiais (Baixa Operacional)
              </h3>
              <button
                onClick={onCloseSaida}
                className="p-1 rounded-lg text-slate-900 hover:bg-amber-600/30 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaidaSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Material a Retirar *</label>
                <select
                  required
                  value={outMaterialId}
                  onChange={(e) => setOutMaterialId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.codigo}] {m.nome} — Saldo Disponível: {m.quantidade_atual} {m.unidade_medida}
                    </option>
                  ))}
                </select>
                {selectedOutMaterial && (
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 bg-amber-50 p-2 rounded-md border border-amber-200">
                    <span>
                      Saldo em Estoque:{' '}
                      <strong className="text-slate-900">
                        {selectedOutMaterial.quantidade_atual} {selectedOutMaterial.unidade_medida}
                      </strong>
                    </span>
                    <span>Localização: {selectedOutMaterial.localizacao}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quantidade Retirada *</label>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    max={selectedOutMaterial ? selectedOutMaterial.quantidade_atual : undefined}
                    required
                    value={outQuantidade}
                    onChange={(e) => setOutQuantidade(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Data / Hora de Saída</label>
                  <input
                    type="datetime-local"
                    value={outData}
                    onChange={(e) => setOutData(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Setor Solicitante *</label>
                  <select
                    required
                    value={outSetorId}
                    onChange={(e) => setOutSetorId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nome} ({d.codigo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Motivo da Saída *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Manutenção preventiva OS-120"
                    value={outMotivo}
                    onChange={(e) => setOutMotivo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Responsável pela Liberação / Entrega</label>
                <input
                  type="text"
                  value={outResponsavel}
                  onChange={(e) => setOutResponsavel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Observações da Saída</label>
                <textarea
                  rows={2}
                  placeholder="Nome de quem retirou fisicamente, número de chamado ou máquina de aplicação..."
                  value={outObservacoes}
                  onChange={(e) => setOutObservacoes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCloseSaida}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? 'Efetuando Baixa...' : 'Confirmar Saída do Estoque'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
