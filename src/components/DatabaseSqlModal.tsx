import React, { useState, useEffect } from 'react';
import { X, Database, Copy, Check, Download, Terminal, Server, FileCode, ExternalLink } from 'lucide-react';
import { api } from '../api/client';

interface DatabaseSqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSqlModal: React.FC<DatabaseSqlModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'seed' | 'instructions'>('schema');
  const [schemaSql, setSchemaSql] = useState('');
  const [seedSql, setSeedSql] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api
        .getDatabaseSql()
        .then((data) => {
          setSchemaSql(data.schemaSql);
          setSeedSql(data.seedSql);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentContent = activeTab === 'schema' ? schemaSql : activeTab === 'seed' ? seedSql : '';

  const handleCopy = () => {
    if (currentContent) {
      navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0a3d62] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#f4d03f] text-slate-950 font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                Banco de Dados Relacional & Guia de Instalação
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                  PostgreSQL / MySQL
                </span>
              </h3>
              <p className="text-xs text-blue-200">
                Scripts DDL, carga de dados (Seed) e passos para execução em ambiente de produção
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'schema'
                  ? 'bg-[#0a3d62] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>schema.sql (DDL Tabelas)</span>
            </button>

            <button
              onClick={() => setActiveTab('seed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'seed'
                  ? 'bg-[#0a3d62] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>seed.sql (Carga Inicial)</span>
            </button>

            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'instructions'
                  ? 'bg-[#0a3d62] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Guia de Instalação & Setup</span>
            </button>
          </div>

          {activeTab !== 'instructions' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copied ? 'Copiado!' : 'Copiar SQL'}</span>
              </button>

              <button
                onClick={() =>
                  handleDownload(
                    activeTab === 'schema' ? 'schema.sql' : 'seed.sql',
                    currentContent
                  )
                }
                className="px-2.5 py-1 rounded bg-[#0a3d62] hover:bg-[#1e5a96] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Baixar .sql</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto grow bg-slate-900 text-slate-100 font-mono text-xs">
          {activeTab === 'instructions' ? (
            <div className="font-sans text-slate-200 space-y-6 text-sm">
              <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800/80">
                <h4 className="font-bold text-base text-amber-300 flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4" />
                  Arquitetura do Sistema de Controle de Estoque
                </h4>
                <p className="text-xs text-blue-200 leading-relaxed">
                  O sistema possui arquitetura full-stack desacoplada: Frontend desenvolvido em <strong>React 19 + Vite</strong> com
                  estilização <strong>Tailwind CSS</strong> e biblioteca de gráficos <strong>Recharts</strong>; Backend desenvolvido
                  em <strong>Node.js com Express</strong> em porta padrão <strong>3000</strong> com camada de persistência e endpoints RESTful.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-2 text-[#f4d03f]">
                  1. Pré-requisitos
                </h5>
                <ul className="list-disc list-inside text-xs space-y-1 text-slate-300">
                  <li>Node.js versão 18 ou superior instalado</li>
                  <li>Gerenciador de pacotes npm ou yarn</li>
                  <li>PostgreSQL 13+ ou MySQL 8+ (para ambiente de banco dedicado)</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-2 text-[#f4d03f]">
                  2. Instalação de Dependências
                </h5>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-emerald-400 font-mono text-xs">
                  {`# Instalar todas as dependências do package.json
npm install

# Iniciar o servidor completo de desenvolvimento (Backend Express + Frontend Vite)
npm run dev`}
                </pre>
              </div>

              <div>
                <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-2 text-[#f4d03f]">
                  3. Criação do Banco de Dados Relacional (PostgreSQL / MySQL)
                </h5>
                <p className="text-xs text-slate-300 mb-2">
                  Você pode executar os scripts <code>schema.sql</code> e <code>seed.sql</code> no seu SGBD preferido:
                </p>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-cyan-300 font-mono text-xs">
                  {`# Criar base de dados no PostgreSQL
psql -U postgres -c "CREATE DATABASE estoque_operacional;"

# Executar criação das tabelas e índices
psql -U postgres -d estoque_operacional -f database/schema.sql

# Opcional: Inserir dados iniciais de demonstração (EPIs, Peças, Setores)
psql -U postgres -d estoque_operacional -f database/seed.sql`}
                </pre>
              </div>

              <div>
                <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-2 text-[#f4d03f]">
                  4. Variáveis de Ambiente (.env)
                </h5>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-amber-200 font-mono text-xs">
                  {`# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Conexão opcional com PostgreSQL / Cloud SQL
DATABASE_URL=postgresql://postgres:senha@localhost:5432/estoque_operacional`}
                </pre>
              </div>

              <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300">
                <strong>Responsável Técnico do Sistema:</strong> Gabriel Henrique • Engenharia Operacional de Almoxarifado
              </div>
            </div>
          ) : (
            <pre className="overflow-x-auto whitespace-pre leading-relaxed text-blue-100">
              {loading ? 'Carregando script SQL...' : currentContent}
            </pre>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600 shrink-0">
          <span>Tabelas incluídas: materiais, setores, movimentacoes, requisicoes, requisicao_itens, usuarios.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0a3d62] hover:bg-[#1e5a96] text-white font-semibold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
