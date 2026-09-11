import React from 'react';
import {
  Boxes,
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  ClipboardList,
  Building2,
  BookOpen,
  Database,
  PlusCircle,
  MinusCircle,
  FilePlus,
  User,
  LogOut,
  RotateCcw
} from 'lucide-react';
import { Usuario } from '../types';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  user: Usuario | null;
  onLogout: () => void;
  onOpenEntrada: () => void;
  onOpenSaida: () => void;
  onOpenRequisicao: () => void;
  onOpenDatabaseSql: () => void;
  onResetDemo: () => void;
  criticalCount: number;
  pendingReqCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  user,
  onLogout,
  onOpenEntrada,
  onOpenSaida,
  onOpenRequisicao,
  onOpenDatabaseSql,
  onResetDemo,
  criticalCount,
  pendingReqCount,
}) => {
  return (
    <header className="no-print bg-[#0a3d62] text-white border-b border-[#1e5a96]/40 sticky top-0 z-40 shadow-md">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f4d03f] to-[#e67e22] flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-bold">
              <Boxes className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-['Space_Grotesk']">
                  ESTOQUE<span className="text-[#f4d03f]">PRO</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#1e5a96] text-amber-300 border border-amber-400/30">
                  Gestão Operacional
                </span>
              </div>
              <p className="text-xs text-blue-200/80 hidden sm:block">
                Controle de Almoxarifado, Movimentações e Requisições
              </p>
            </div>
          </div>

          {/* Quick Action Shortcut Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenEntrada}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 border border-emerald-500/30 cursor-pointer"
              title="Registrar entrada de materiais no estoque"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Nova</span> Entrada
            </button>

            <button
              onClick={onOpenSaida}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/90 hover:bg-amber-500 text-slate-950 text-xs font-semibold shadow-sm transition-all active:scale-95 border border-amber-400/40 cursor-pointer"
              title="Registrar saída ou baixa de materiais"
            >
              <MinusCircle className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Nova</span> Saída
            </button>

            <button
              onClick={onOpenRequisicao}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e5a96] hover:bg-[#256fb8] text-white text-xs font-semibold shadow-sm transition-all active:scale-95 border border-blue-400/30 cursor-pointer"
              title="Criar nova requisição de materiais"
            >
              <FilePlus className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden md:inline">Nova</span> Requisição
            </button>

            <div className="h-6 w-px bg-blue-800 mx-1 hidden sm:block" />

            {/* User Profile / Technical responsible badge */}
            <div className="flex items-center gap-2 pl-1">
              <div className="flex items-center gap-2 bg-[#062942] px-2.5 py-1.5 rounded-lg border border-blue-800/60">
                <div className="w-6 h-6 rounded-full bg-[#f4d03f] text-slate-900 flex items-center justify-center font-bold text-xs">
                  {user?.nome ? user.nome.charAt(0) : 'G'}
                </div>
                <div className="text-left hidden lg:block leading-tight">
                  <p className="text-xs font-semibold text-white truncate max-w-[140px]">{user?.nome || 'Gabriel Henrique'}</p>
                  <p className="text-[10px] text-amber-300 font-medium">Responsável Técnico</p>
                </div>
              </div>

              <button
                onClick={onResetDemo}
                title="Restaurar dados de teste padrão"
                className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/60 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={onLogout}
                title="Sair do sistema"
                className="p-1.5 rounded-lg text-blue-200 hover:text-rose-300 hover:bg-rose-900/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#072d49] border-t border-[#1e5a96]/30 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 py-1.5">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-[#1e5a96] text-white shadow-sm border border-blue-400/40 text-amber-300'
                  : 'text-blue-200/90 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#f4d03f]" />
              <span>Painel de Indicadores</span>
            </button>

            <button
              onClick={() => onTabChange('materiais')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer relative ${
                currentTab === 'materiais'
                  ? 'bg-[#1e5a96] text-white shadow-sm border border-blue-400/40'
                  : 'text-blue-200/90 hover:text-white hover:bg-white/5'
              }`}
            >
              <Package className="w-4 h-4 text-blue-300" />
              <span>Gestão de Materiais</span>
              {criticalCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {criticalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('movimentacoes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentTab === 'movimentacoes'
                  ? 'bg-[#1e5a96] text-white shadow-sm border border-blue-400/40'
                  : 'text-blue-200/90 hover:text-white hover:bg-white/5'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 text-emerald-300" />
              <span>Movimentações (Entradas/Saídas)</span>
            </button>

            <button
              onClick={() => onTabChange('requisicoes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentTab === 'requisicoes'
                  ? 'bg-[#1e5a96] text-white shadow-sm border border-blue-400/40'
                  : 'text-blue-200/90 hover:text-white hover:bg-white/5'
              }`}
            >
              <ClipboardList className="w-4 h-4 text-amber-300" />
              <span>Requisições & Impressão</span>
              {pendingReqCount > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingReqCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('setores')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentTab === 'setores'
                  ? 'bg-[#1e5a96] text-white shadow-sm border border-blue-400/40'
                  : 'text-blue-200/90 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-300" />
              <span>Setores / Departamentos</span>
            </button>

            <button
              onClick={() => onTabChange('boas-praticas')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentTab === 'boas-praticas'
                  ? 'bg-[#1e5a96] text-white shadow-sm border border-blue-400/40'
                  : 'text-blue-200/90 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Boas Práticas de Estoque</span>
            </button>

            <button
              onClick={onOpenDatabaseSql}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-blue-200/90 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer ml-auto border border-blue-400/20"
            >
              <Database className="w-4 h-4 text-cyan-300" />
              <span>Instalação & Banco SQL</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
