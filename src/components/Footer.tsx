import React from 'react';
import { ShieldCheck, Database, Server, UserCheck, Terminal } from 'lucide-react';

interface FooterProps {
  onOpenDatabaseSql: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDatabaseSql }) => {
  return (
    <footer className="no-print bg-[#082b45] text-blue-200 border-t border-[#1e5a96]/40 mt-auto py-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-between border-b border-blue-900/50 pb-6 mb-6">
          {/* System Identity & Responsável Técnico */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-white text-sm">Sistema de Controle de Estoque & Almoxarifado</span>
            </div>
            <p className="text-blue-300/80">
              Gestão operacional em tempo real de entradas, saídas, requisições com impressão e auditoria.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <UserCheck className="w-4 h-4 text-[#f4d03f]" />
              <span className="text-white font-semibold">
                Responsável Técnico: <span className="text-[#f4d03f]">Gabriel Henrique</span>
              </span>
              <span className="text-blue-400 text-[11px]">(gabrielhenrique.ia10@gmail.com)</span>
            </div>
          </div>

          {/* Architecture & Relational Database Specs */}
          <div className="space-y-1 text-blue-300/90 text-[11px]">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Backend RESTful Node.js + Express (Porta 3000)</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Compatível com Banco Relacional: PostgreSQL 13+ / MySQL 8+</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Controle de Saldo em Tempo Real e Bloqueio de Ruptura</span>
            </div>
          </div>

          {/* Actions and Documentation */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start md:items-end justify-end gap-2.5">
            <button
              onClick={onOpenDatabaseSql}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e5a96]/40 hover:bg-[#1e5a96] text-amber-300 hover:text-white border border-blue-400/30 transition-colors text-xs font-semibold cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-[#f4d03f]" />
              <span>Ver Esquema SQL (schema.sql)</span>
            </button>
            <div className="text-right text-[11px] text-blue-300/60">
              Versão 2.4.0 • Produção
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-blue-300/60 gap-2">
          <div>
            © {new Date().getFullYear()} EstoquePRO • Todos os direitos operacionais reservados.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-blue-200 transition-colors">Segurança Operacional</span>
            <span>•</span>
            <span className="hover:text-blue-200 transition-colors">Norma Regulamentadora de Almoxarifado</span>
            <span>•</span>
            <span className="hover:text-blue-200 transition-colors">Conferência Física & PEPS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
