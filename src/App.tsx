import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api/client';
import {
  Material,
  Setor,
  Movimentacao,
  Requisicao,
  DashboardData,
  NavigationTab,
} from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { MaterialsView } from './components/MaterialsView';
import { MovementsView } from './components/MovementsView';
import { RequisitionsView } from './components/RequisitionsView';
import { DepartmentsView } from './components/DepartmentsView';
import { BestPracticesView } from './components/BestPracticesView';
import { PrintRequisitionModal } from './components/PrintRequisitionModal';
import { DatabaseSqlModal } from './components/DatabaseSqlModal';
import { AlertCircle, CheckCircle2, Info, Loader2, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Core Data state
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [departments, setDepartments] = useState<Setor[]>([]);
  const [movements, setMovements] = useState<Movimentacao[]>([]);
  const [requisitions, setRequisitions] = useState<Requisicao[]>([]);

  // Modals & Action States
  const [isEntradaOpen, setIsEntradaOpen] = useState<boolean>(false);
  const [isSaidaOpen, setIsSaidaOpen] = useState<boolean>(false);
  const [isNewReqOpen, setIsNewReqOpen] = useState<boolean>(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState<boolean>(false);
  const [printRequisition, setPrintRequisition] = useState<Requisicao | null>(null);
  const [presetMovementMaterial, setPresetMovementMaterial] = useState<Material | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch all state
  const loadData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const [dash, mats, depts, movs, reqs] = await Promise.all([
        api.getDashboard(),
        api.getMaterials(),
        api.getDepartments(),
        api.getMovements(),
        api.getRequisitions(),
      ]);

      setDashboardData(dash);
      setMaterials(mats);
      setDepartments(depts);
      setMovements(movs);
      setRequisitions(reqs);
    } catch (err: any) {
      console.error('Erro ao carregar dados do almoxarifado:', err);
      setError(err.message || 'Falha ao conectar com o servidor do estoque.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers for Materials
  const handleAddMaterial = async (data: Partial<Material>) => {
    try {
      const created = await api.createMaterial(data);
      showToast(`Material "${created.nome}" cadastrado com sucesso!`, 'success');
      await loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Erro ao cadastrar material', 'error');
      throw err;
    }
  };

  const handleUpdateMaterial = async (id: string, data: Partial<Material>) => {
    try {
      const updated = await api.updateMaterial(id, data);
      showToast(`Material "${updated.nome}" atualizado!`, 'success');
      await loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Erro ao atualizar material', 'error');
      throw err;
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      await api.deleteMaterial(id);
      showToast('Material removido do catálogo com sucesso.', 'info');
      await loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Não foi possível excluir o material', 'error');
      throw err;
    }
  };

  // Handlers for Departments
  const handleAddDepartment = async (data: Partial<Setor>) => {
    try {
      const created = await api.createDepartment(data);
      showToast(`Setor "${created.nome}" cadastrado com sucesso!`, 'success');
      await loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Erro ao cadastrar setor', 'error');
      throw err;
    }
  };

  const handleUpdateDepartment = async (id: string, data: Partial<Setor>) => {
    try {
      const updated = await api.updateDepartment(id, data);
      showToast(`Setor "${updated.nome}" atualizado com sucesso!`, 'success');
      await loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Erro ao atualizar setor', 'error');
      throw err;
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      await api.deleteDepartment(id);
      showToast('Setor removido com sucesso.', 'info');
      await loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Não foi possível excluir o setor', 'error');
      throw err;
    }
  };

  // Handlers for Movements
  const handleAddMovement = async (data: any) => {
    try {
      const res = await api.createMovement(data);
      const isEntrada = data.tipo === 'ENTRADA';
      showToast(
        `${isEntrada ? 'Entrada' : 'Saída'} de ${data.quantidade} un de ${res.material.nome} confirmada! Novo saldo: ${res.material.quantidade_atual} ${res.material.unidade_medida}.`,
        'success'
      );
      await loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Erro ao registrar movimentação', 'error');
      throw err;
    }
  };

  // Handlers for Requisitions
  const handleCreateRequisition = async (data: any) => {
    try {
      const created = await api.createRequisition(data);
      showToast(`Requisição ${created.numero} emitida com sucesso!`, 'success');
      await loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Erro ao criar requisição', 'error');
      throw err;
    }
  };

  const handleUpdateRequisitionStatus = async (id: string, status: string, baixarNoEstoque?: boolean) => {
    try {
      const updated = await api.updateRequisitionStatus(id, status, baixarNoEstoque);
      showToast(
        `Status da requisição ${updated.numero} alterado para "${status}"! ${
          baixarNoEstoque ? 'Baixas de estoque efetuadas.' : ''
        }`,
        'success'
      );
      await loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Erro ao atualizar status', 'error');
      throw err;
    }
  };

  const handleDeleteRequisition = async (id: string) => {
    try {
      await api.deleteRequisition(id);
      showToast('Requisição excluída com sucesso.', 'info');
      await loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir requisição', 'error');
      throw err;
    }
  };

  // Reset / Seeder
  const handleResetDatabase = async () => {
    if (!confirm('Deseja recarregar o banco de dados com os dados padrão de fábrica? Todas as alterações serão restauradas.')) {
      return;
    }
    setIsLoading(true);
    try {
      await api.resetDatabase();
      showToast('Banco de dados restaurado com dados iniciais com sucesso!', 'info');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao resetar banco de dados', 'error');
      setIsLoading(false);
    }
  };

  // Trigger quick modal actions
  const triggerEntrada = (mat?: Material) => {
    setPresetMovementMaterial(mat || null);
    setIsEntradaOpen(true);
  };

  const triggerSaida = (mat?: Material) => {
    setPresetMovementMaterial(mat || null);
    setIsSaidaOpen(true);
  };

  const triggerRequisicao = () => {
    setIsNewReqOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenEntrada={() => triggerEntrada()}
        onOpenSaida={() => triggerSaida()}
        onOpenNovaRequisicao={triggerRequisicao}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
      />

      {/* Main App Body */}
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
            <Loader2 className="w-10 h-10 text-[#0a3d62] animate-spin" />
            <p className="text-sm font-semibold text-slate-700">Carregando sistema de controle de estoque...</p>
            <p className="text-xs text-slate-400">Sincronizando materiais, saldos e movimentações</p>
          </div>
        )}

        {/* Global Error Banner */}
        {error && !isLoading && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider">Falha de Comunicação</strong>
                <span className="text-xs">{error}</span>
              </div>
            </div>
            <button
              onClick={() => loadData()}
              className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Content Views based on activeTab */}
        {!isLoading && (
          <>
            {activeTab === 'dashboard' && dashboardData && (
              <DashboardView
                data={dashboardData}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onQuickEntrada={triggerEntrada}
                onQuickSaida={triggerSaida}
                onQuickRequisicao={triggerRequisicao}
              />
            )}

            {activeTab === 'materials' && (
              <MaterialsView
                materials={materials}
                onAddMaterial={handleAddMaterial}
                onUpdateMaterial={handleUpdateMaterial}
                onDeleteMaterial={handleDeleteMaterial}
                onQuickEntrada={triggerEntrada}
                onQuickSaida={triggerSaida}
              />
            )}

            {activeTab === 'movements' && (
              <MovementsView
                movements={movements}
                materials={materials}
                departments={departments}
                onAddMovement={handleAddMovement}
                isEntradaOpen={isEntradaOpen}
                isSaidaOpen={isSaidaOpen}
                onOpenEntrada={() => setIsEntradaOpen(true)}
                onCloseEntrada={() => {
                  setIsEntradaOpen(false);
                  setPresetMovementMaterial(null);
                }}
                onOpenSaida={() => setIsSaidaOpen(true)}
                onCloseSaida={() => {
                  setIsSaidaOpen(false);
                  setPresetMovementMaterial(null);
                }}
                presetMaterial={presetMovementMaterial}
              />
            )}

            {activeTab === 'requisitions' && (
              <RequisitionsView
                requisitions={requisitions}
                materials={materials}
                departments={departments}
                onCreateRequisition={handleCreateRequisition}
                onUpdateStatus={handleUpdateRequisitionStatus}
                onDeleteRequisition={handleDeleteRequisition}
                onPrintRequisition={(req) => setPrintRequisition(req)}
                isCreateOpen={isNewReqOpen}
                onOpenCreate={() => setIsNewReqOpen(true)}
                onCloseCreate={() => setIsNewReqOpen(false)}
              />
            )}

            {activeTab === 'departments' && (
              <DepartmentsView
                departments={departments}
                onAddDepartment={handleAddDepartment}
                onUpdateDepartment={handleUpdateDepartment}
                onDeleteDepartment={handleDeleteDepartment}
              />
            )}

            {activeTab === 'best-practices' && <BestPracticesView />}
          </>
        )}
      </main>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-300">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-xs font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-emerald-50 border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-rose-50 border-rose-700'
                : 'bg-[#0a3d62] text-white border-blue-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-amber-300 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Printable Requisition Modal */}
      {printRequisition && (
        <PrintRequisitionModal
          requisition={printRequisition}
          onClose={() => setPrintRequisition(null)}
        />
      )}

      {/* Database SQL & Architecture Modal */}
      <DatabaseSqlModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      {/* System Footer */}
      <Footer
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onResetDatabase={handleResetDatabase}
      />
    </div>
  );
}
