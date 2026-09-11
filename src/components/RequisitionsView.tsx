import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  Check,
  AlertTriangle,
  Search,
  Building2,
  User,
  Trash2,
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Requisicao, Material, Setor } from '../types';

interface RequisitionsViewProps {
  requisitions: Requisicao[];
  materials: Material[];
  departments: Setor[];
  onCreateRequisition: (data: any) => Promise<void>;
  onUpdateStatus: (id: string, status: string, baixarnoEstoque?: boolean) => Promise<void>;
  onDeleteRequisition: (id: string) => Promise<void>;
  onPrintRequisition: (req: Requisicao) => void;
  isCreateOpen: boolean;
  onOpenCreate: () => void;
  onCloseCreate: () => void;
}

export const RequisitionsView: React.FC<RequisitionsViewProps> = ({
  requisitions,
  materials,
  departments,
  onCreateRequisition,
  onUpdateStatus,
  onDeleteRequisition,
  onPrintRequisition,
  isCreateOpen,
  onOpenCreate,
  onCloseCreate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Status transition modal
  const [selectedReqForStatus, setSelectedReqForStatus] = useState<Requisicao | null>(null);
  const [newStatus, setNewStatus] = useState<string>('Aprovada');
  const [baixarEstoque, setBaixarEstoque] = useState<boolean>(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Form states for New Requisition
  const [setorId, setSetorId] = useState<string>(departments[0]?.id || '');
  const [solicitante, setSolicitante] = useState<string>('');
  const [dataNecessidade, setDataNecessidade] = useState<string>('');
  const [prioridade, setPrioridade] = useState<'Baixa' | 'Normal' | 'Alta' | 'Urgente'>('Normal');
  const [justificativa, setJustificativa] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');

  const [formItens, setFormItens] = useState<
    Array<{ material_id: string; quantidade_solicitada: number; observacao?: string }>
  >([{ material_id: materials[0]?.id || '', quantidade_solicitada: 1, observacao: '' }]);

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAddItem = () => {
    setFormItens([...formItens, { material_id: materials[0]?.id || '', quantidade_solicitada: 1, observacao: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    if (formItens.length > 1) {
      setFormItens(formItens.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...formItens];
    updated[index] = { ...updated[index], [field]: value };
    setFormItens(updated);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setorId || !solicitante.trim()) {
      setFormError('Selecione o setor solicitante e o nome do requisitante.');
      return;
    }

    if (formItens.some((it) => !it.material_id || Number(it.quantidade_solicitada) <= 0)) {
      setFormError('Todos os itens devem ter um material e quantidade solicitada maior que zero.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await onCreateRequisition({
        setor_id: setorId,
        solicitante,
        data_necessidade: dataNecessidade || undefined,
        prioridade,
        justificativa,
        observacoes,
        itens: formItens,
      });
      onCloseCreate();
      // Reset
      setSolicitante('');
      setDataNecessidade('');
      setJustificativa('');
      setObservacoes('');
      setFormItens([{ material_id: materials[0]?.id || '', quantidade_solicitada: 1, observacao: '' }]);
    } catch (err: any) {
      setFormError(err.message || 'Erro ao criar requisição.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openStatusChange = (req: Requisicao) => {
    setSelectedReqForStatus(req);
    setNewStatus(req.status === 'Pendente' ? 'Aprovada' : req.status === 'Aprovada' ? 'Entregue' : 'Pendente');
    setBaixarEstoque(true);
    setStatusError(null);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedReqForStatus) return;
    setIsUpdatingStatus(true);
    setStatusError(null);
    try {
      await onUpdateStatus(selectedReqForStatus.id, newStatus, newStatus === 'Entregue' ? baixarEstoque : false);
      setSelectedReqForStatus(null);
    } catch (err: any) {
      setStatusError(err.message || 'Falha ao atualizar status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredRequisitions = requisitions.filter((r) => {
    const matchSearch =
      r.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.setor_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.justificativa.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'Todos' || r.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const getPriorityBadge = (prio: string) => {
    if (prio === 'Urgente') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">Urgente</span>;
    if (prio === 'Alta') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">Alta</span>;
    if (prio === 'Baixa') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Baixa</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Normal</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Entregue') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Entregue
        </span>
      );
    }
    if (status === 'Aprovada') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0a3d62] border border-blue-300">
          <Check className="w-3.5 h-3.5 text-blue-600" />
          Aprovada
        </span>
      );
    }
    if (status === 'Cancelada') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
          Cancelada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        Pendente
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0a3d62] flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#1e5a96]" />
            Requisições de Materiais & Guias de Saída
          </h2>
          <p className="text-xs text-slate-500">
            Criação de pedidos por setor, controle de aprovação, entrega e geração de guias oficiais para impressão
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a3d62] hover:bg-[#1e5a96] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#f4d03f]" />
          <span>Criar Nova Requisição</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por número (ex: REQ-2026), solicitante, setor ou finalidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50 focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden cursor-pointer"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Pendente">⏳ Pendente</option>
            <option value="Aprovada">🔵 Aprovada</option>
            <option value="Entregue">🟢 Entregue / Baixada</option>
            <option value="Cancelada">⚪ Cancelada</option>
          </select>
        </div>
      </div>

      {/* Requisitions List */}
      <div className="space-y-4">
        {filteredRequisitions.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 hover:border-[#1e5a96]/40 transition-all"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-base text-[#0a3d62]">{req.numero}</span>
                  {getStatusBadge(req.status)}
                  {getPriorityBadge(req.prioridade)}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {req.setor_nome}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Solicitante: <strong>{req.solicitante}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Data: {new Date(req.data_requisicao).toLocaleDateString('pt-BR')}
                  </span>
                  {req.data_necessidade && (
                    <span className="text-amber-800 font-medium">
                      Necessidade: {new Date(req.data_necessidade).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end lg:self-center">
                <button
                  onClick={() => onPrintRequisition(req)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                  title="Abrir layout otimizado para impressão A4 / PDF"
                >
                  <Printer className="w-4 h-4 text-slate-950" />
                  <span>Imprimir Guia A4</span>
                </button>

                <button
                  onClick={() => openStatusChange(req)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0a3d62] text-xs font-bold transition-colors cursor-pointer"
                  title="Alterar status de atendimento da requisição"
                >
                  <span>Mudar Status</span>
                </button>

                {deleteConfirmId === req.id ? (
                  <div className="flex items-center gap-1 bg-rose-50 p-1 rounded border border-rose-300">
                    <button
                      onClick={() => {
                        onDeleteRequisition(req.id);
                        setDeleteConfirmId(null);
                      }}
                      className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
                    >
                      Excluir
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] hover:bg-slate-300 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(req.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Excluir requisição"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Justification & Items Preview */}
            <div className="pt-3 text-xs">
              <p className="text-slate-600 italic mb-3">
                <strong className="not-italic text-slate-700">Justificativa:</strong> {req.justificativa}
              </p>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <span className="font-bold text-[#0a3d62] text-[11px] block uppercase tracking-wider mb-2">
                  Itens Requisitados ({req.itens.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {req.itens.map((it) => (
                    <div
                      key={it.id}
                      className="bg-white p-2 rounded-md border border-slate-200 flex items-center justify-between gap-2"
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-800 block truncate">{it.material_nome}</span>
                        <span className="text-[10px] font-mono text-slate-500">{it.material_codigo}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0a3d62] font-mono font-bold whitespace-nowrap">
                        {it.quantidade_solicitada} {it.unidade_medida}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequisitions.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-600 font-semibold">Nenhuma requisição encontrada com estes critérios.</p>
          <p className="text-xs text-slate-400 mt-1">Crie uma nova requisição pelo botão superior.</p>
        </div>
      )}

      {/* Modal - Nova Requisição de Materiais */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#0a3d62] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#f4d03f]" />
                Nova Requisição de Materiais
              </h3>
              <button
                onClick={onCloseCreate}
                className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs overflow-y-auto grow">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Setor Solicitante *</label>
                  <select
                    required
                    value={setorId}
                    onChange={(e) => setSetorId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nome} ({d.codigo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nome do Solicitante / Colaborador *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Alberto ou seu nome"
                    value={solicitante}
                    onChange={(e) => setSolicitante(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Data Limite de Necessidade</label>
                  <input
                    type="date"
                    value={dataNecessidade}
                    onChange={(e) => setDataNecessidade(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Prioridade Operacional</label>
                  <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden font-semibold"
                  >
                    <option value="Baixa">Baixa (Rotina normal)</option>
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">🚨 Urgente (Parada de Máquina / Risco)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Finalidade / Justificativa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Manutenção emergencial de caldeira ou reposição de EPIs de soldador"
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden"
                />
              </div>

              {/* Dynamic Items Builder */}
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                    Materiais Solicitados
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Outro Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formItens.map((item, index) => {
                    const selectedMat = materials.find((m) => m.id === item.material_id);

                    return (
                      <div
                        key={index}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                      >
                        <div className="sm:col-span-6">
                          <label className="text-[10px] text-slate-500 block mb-0.5">Material</label>
                          <select
                            value={item.material_id}
                            onChange={(e) => handleItemChange(index, 'material_id', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden"
                          >
                            {materials.map((m) => (
                              <option key={m.id} value={m.id}>
                                [{m.codigo}] {m.nome} (Saldo: {m.quantidade_atual} {m.unidade_medida})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-slate-500 block mb-0.5">Qtd.</label>
                          <input
                            type="number"
                            step="any"
                            min="0.01"
                            required
                            value={item.quantidade_solicitada}
                            onChange={(e) => handleItemChange(index, 'quantidade_solicitada', Number(e.target.value))}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-mono font-bold bg-white focus:outline-hidden"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="text-[10px] text-slate-500 block mb-0.5">Observação</label>
                          <input
                            type="text"
                            placeholder="Tamanho, aplicação..."
                            value={item.observacao || ''}
                            onChange={(e) => handleItemChange(index, 'observacao', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden"
                          />
                        </div>

                        <div className="sm:col-span-1 text-right pt-3 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            disabled={formItens.length === 1}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCloseCreate}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#0a3d62] hover:bg-[#1e5a96] text-white font-bold cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? 'Gerando Requisição...' : 'Emitir Requisição'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Mudar Status da Requisição */}
      {selectedReqForStatus && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#0a3d62] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold">Atualizar Status da Requisição {selectedReqForStatus.numero}</h3>
              <button
                onClick={() => setSelectedReqForStatus(null)}
                className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {statusError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{statusError}</span>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Selecione o Novo Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] font-bold text-sm"
                >
                  <option value="Pendente">⏳ Pendente (Aguardando análise)</option>
                  <option value="Aprovada">🔵 Aprovada (Liberada para separação)</option>
                  <option value="Entregue">🟢 Entregue (Materiais retirados fisicamente)</option>
                  <option value="Cancelada">⚪ Cancelada</option>
                </select>
              </div>

              {newStatus === 'Entregue' && selectedReqForStatus.status !== 'Entregue' && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={baixarEstoque}
                      onChange={(e) => setBaixarEstoque(e.target.checked)}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                    />
                    <span className="font-bold text-slate-900 text-xs">
                      Dar baixa automática nas quantidades do estoque físico
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-600 pl-6">
                    Se marcado, registrará movimentações de SAÍDA imediatas para os itens desta requisição,
                    reduzindo o saldo do almoxarifado e gravando no histórico.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReqForStatus(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmStatusChange}
                  disabled={isUpdatingStatus}
                  className="px-4 py-2 rounded-lg bg-[#0a3d62] hover:bg-[#1e5a96] text-white font-bold cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isUpdatingStatus ? 'Atualizando...' : 'Confirmar Mudança'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
