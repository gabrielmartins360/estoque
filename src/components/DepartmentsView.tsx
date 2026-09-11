import React, { useState } from 'react';
import { Building2, Plus, Edit2, Trash2, Search, Mail, Phone, Hash, User, ShieldAlert, Check } from 'lucide-react';
import { Setor } from '../types';

interface DepartmentsViewProps {
  departments: Setor[];
  onAddDepartment: (data: Partial<Setor>) => Promise<void>;
  onUpdateDepartment: (id: string, data: Partial<Setor>) => Promise<void>;
  onDeleteDepartment: (id: string) => Promise<void>;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  departments,
  onAddDepartment,
  onUpdateDepartment,
  onDeleteDepartment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Setor | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [email, setEmail] = useState('');
  const [ramal, setRamal] = useState('');
  const [centroCusto, setCentroCusto] = useState('');
  const [descricao, setDescricao] = useState('');

  const openAddModal = () => {
    setEditingDept(null);
    setCodigo('');
    setNome('');
    setResponsavel('');
    setEmail('');
    setRamal('');
    setCentroCusto('');
    setDescricao('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Setor) => {
    setEditingDept(dept);
    setCodigo(dept.codigo);
    setNome(dept.nome);
    setResponsavel(dept.responsavel);
    setEmail(dept.email || '');
    setRamal(dept.ramal || '');
    setCentroCusto(dept.centro_custo || '');
    setDescricao(dept.descricao || '');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim() || !nome.trim() || !responsavel.trim()) {
      setErrorMsg('Por favor, preencha código, nome do setor e responsável.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    try {
      if (editingDept) {
        await onUpdateDepartment(editingDept.id, {
          codigo,
          nome,
          responsavel,
          email,
          ramal,
          centro_custo: centroCusto,
          descricao,
        });
      } else {
        await onAddDepartment({
          codigo,
          nome,
          responsavel,
          email,
          ramal,
          centro_custo: centroCusto,
          descricao,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar departamento');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteDepartment(id);
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert(err.message || 'Não foi possível excluir setor.');
    }
  };

  const filteredDepts = departments.filter(
    (d) =>
      d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.centro_custo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0a3d62] flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#1e5a96]" />
            Setores e Departamentos da Organização
          </h2>
          <p className="text-xs text-slate-500">
            Gerenciamento de centros de custo, responsáveis e ramais para solicitação e baixa de materiais
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a3d62] hover:bg-[#1e5a96] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#f4d03f]" />
          <span>Cadastrar Novo Setor</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por setor, código, responsável ou centro de custo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1e5a96] bg-slate-50/50"
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDepts.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 hover:border-[#1e5a96]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-[#0a3d62]/10 text-[#0a3d62] text-xs font-bold font-mono border border-blue-900/10">
                  {dept.codigo}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-medium">
                  {dept.centro_custo || 'CC-PADRÃO'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{dept.nome}</h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">{dept.descricao || 'Sem descrição cadastrada.'}</p>

              <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{dept.responsavel}</span>
                </div>
                {dept.email && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{dept.email}</span>
                  </div>
                )}
                {dept.ramal && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ramal: {dept.ramal}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 mt-4">
              <button
                onClick={() => openEditModal(dept)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-[#0a3d62] hover:bg-slate-100 transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
                title="Editar dados do setor"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>

              {deleteConfirmId === dept.id ? (
                <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                  <span className="text-[10px] text-rose-700 font-semibold px-1">Excluir?</span>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(dept.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
                  title="Excluir setor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredDepts.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-600 font-semibold">Nenhum departamento encontrado.</p>
          <p className="text-xs text-slate-400">Verifique o termo pesquisado ou cadastre um novo setor.</p>
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#0a3d62] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#f4d03f]" />
                {editingDept ? 'Editar Dados do Setor' : 'Cadastrar Novo Setor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Código / Sigla *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: MANUT, PROD, TI"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Centro de Custo</label>
                  <input
                    type="text"
                    placeholder="Ex: CC-1010"
                    value={centroCusto}
                    onChange={(e) => setCentroCusto(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nome do Setor / Departamento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Manutenção Industrial & Predial"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Responsável / Encarregado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Alberto Viana"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">E-mail de Contato</label>
                  <input
                    type="email"
                    placeholder="manutencao@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ramal Telefônico</label>
                  <input
                    type="text"
                    placeholder="Ex: 3042"
                    value={ramal}
                    onChange={(e) => setRamal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e5a96] focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Descrição das Atividades</label>
                <textarea
                  rows={2}
                  placeholder="Finalidade operacional do setor na empresa..."
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
                  <span>{isSaving ? 'Salvando...' : editingDept ? 'Atualizar Setor' : 'Cadastrar Setor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
