import React from 'react';
import { Printer, X, CheckCircle2, AlertTriangle, Building2, User, Calendar, FileText } from 'lucide-react';
import { Requisicao } from '../types';

interface PrintRequisitionModalProps {
  requisition: Requisicao | null;
  onClose: () => void;
}

export const PrintRequisitionModal: React.FC<PrintRequisitionModalProps> = ({ requisition, onClose }) => {
  if (!requisition) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      {/* Floating control bar (hidden during print) */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="no-print bg-[#0a3d62] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-400 text-slate-950 font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Visualização de Impressão de Requisição</h3>
              <p className="text-xs text-blue-200">Layout oficial formatado para impressão em folha A4 e exportação em PDF</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="p-8 sm:p-12 print-card bg-white text-slate-900 max-h-[80vh] overflow-y-auto print:overflow-visible print:max-h-none">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Almoxarifado & Controle de Suprimentos</span>
                <h1 className="text-2xl font-black tracking-tight text-[#0a3d62] uppercase">
                  Guia de Requisição e Baixa de Material
                </h1>
                <p className="text-xs text-slate-600">Sistema Operacional de Gestão de Estoque • EstoquePRO</p>
              </div>
              <div className="text-right">
                <div className="inline-block px-3 py-1 border-2 border-[#0a3d62] rounded-md bg-blue-50/50">
                  <span className="text-xs font-semibold text-slate-600 block">Número do Registro</span>
                  <span className="text-lg font-black text-[#0a3d62] font-mono">{requisition.numero}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Data: {formatDateTime(requisition.data_requisicao)}</p>
              </div>
            </div>
          </div>

          {/* Requisition Meta Information Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 mb-6 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Setor Solicitante:</span>
              <span className="font-bold text-slate-900 text-sm">{requisition.setor_nome}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Requisitante:</span>
              <span className="font-bold text-slate-900 text-sm">{requisition.solicitante}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Data de Necessidade:</span>
              <span className="font-bold text-slate-900 text-sm">{formatDate(requisition.data_necessidade)}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Status Operacional:</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${
                  requisition.status === 'Entregue'
                    ? 'bg-emerald-100 text-emerald-800'
                    : requisition.status === 'Aprovada'
                    ? 'bg-blue-100 text-blue-800'
                    : requisition.status === 'Pendente'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {requisition.status}
              </span>
            </div>
          </div>

          {/* Justification */}
          <div className="mb-6 p-3 bg-white border border-slate-200 rounded-md text-xs">
            <span className="font-bold text-slate-700 block uppercase text-[10px] mb-1">Finalidade / Justificativa da Aplicação:</span>
            <p className="text-slate-800 italic">{requisition.justificativa || 'Uso regular do setor'}</p>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Relação de Itens Solicitados
            </h4>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="p-2 border-r border-slate-300 w-10 text-center">Item</th>
                  <th className="p-2 border-r border-slate-300 w-24">Código SKU</th>
                  <th className="p-2 border-r border-slate-300">Descrição do Material</th>
                  <th className="p-2 border-r border-slate-300 w-14 text-center">U.M.</th>
                  <th className="p-2 border-r border-slate-300 w-20 text-center">Qtd. Solicitada</th>
                  <th className="p-2 border-r border-slate-300 w-20 text-center">Qtd. Entregue</th>
                  <th className="p-2 border-r border-slate-300 w-16 text-center">Conf.</th>
                  <th className="p-2">Observações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {requisition.itens.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 1 ? 'bg-slate-50/70' : ''}>
                    <td className="p-2.5 border-r border-slate-300 text-center font-mono font-semibold">{idx + 1}</td>
                    <td className="p-2.5 border-r border-slate-300 font-mono font-bold text-[#0a3d62]">{item.material_codigo}</td>
                    <td className="p-2.5 border-r border-slate-300 font-medium">{item.material_nome}</td>
                    <td className="p-2.5 border-r border-slate-300 text-center font-bold text-slate-600">{item.unidade_medida}</td>
                    <td className="p-2.5 border-r border-slate-300 text-center font-bold text-sm">{item.quantidade_solicitada}</td>
                    <td className="p-2.5 border-r border-slate-300 text-center font-bold text-sm">
                      {requisition.status === 'Entregue' ? item.quantidade_atendida || item.quantidade_solicitada : '____'}
                    </td>
                    <td className="p-2.5 border-r border-slate-300 text-center">
                      <div className="w-4 h-4 border border-slate-400 mx-auto rounded-xs"></div>
                    </td>
                    <td className="p-2.5 text-slate-600">{item.observacao || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delivery & Conference Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-900 mb-10">
            <strong>Termo de Responsabilidade:</strong> O solicitante declara ter conferido as quantidades, especificações e
            condições físicas dos materiais entregues pelo Almoxarifado Central, responsabilizando-se pelo uso correto segundo as
            normas operacionais da organização.
          </div>

          {/* Signatures Section */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-300 text-xs text-center">
            <div className="space-y-1">
              <div className="border-b border-slate-800 h-10 w-full mb-2"></div>
              <p className="font-bold text-slate-900">{requisition.solicitante}</p>
              <p className="text-[10px] text-slate-500">Requisitante / Solicitante</p>
              <p className="text-[10px] text-slate-400">Data: ____/____/________</p>
            </div>

            <div className="space-y-1">
              <div className="border-b border-slate-800 h-10 w-full mb-2"></div>
              <p className="font-bold text-slate-900">{requisition.entregue_por || 'Gabriel Henrique'}</p>
              <p className="text-[10px] text-slate-500">Almoxarife / Responsável Técnico</p>
              <p className="text-[10px] text-slate-400">Data: ____/____/________</p>
            </div>

            <div className="space-y-1">
              <div className="border-b border-slate-800 h-10 w-full mb-2"></div>
              <p className="font-bold text-slate-900">{requisition.aprovado_por || 'Gestão de Operações'}</p>
              <p className="text-[10px] text-slate-500">Aprovação de Chefia / Gerência</p>
              <p className="text-[10px] text-slate-400">Data: ____/____/________</p>
            </div>
          </div>

          {/* Document Footer Verification */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between text-[10px] text-slate-400">
            <span>EstoquePRO Gestão Integrada • Doc ID: {requisition.id}</span>
            <span>Autenticação Operacional Almoxarifado Central • Visto no Livro de Cautela</span>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="no-print bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
          <span>Dica: Pressione Ctrl + P ou clique no botão para gerar o arquivo PDF.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
