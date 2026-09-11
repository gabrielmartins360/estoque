import React from 'react';
import {
  ShieldAlert,
  BarChart3,
  RefreshCw,
  CheckSquare,
  Warehouse,
  Flame,
  Calculator,
  Compass,
  Lightbulb,
  FileCheck2,
  Clock,
  Boxes
} from 'lucide-react';

export const BestPracticesView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0a3d62] via-[#0e4875] to-[#1e5a96] text-white p-6 sm:p-8 shadow-md border border-blue-800/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Lightbulb className="w-3.5 h-3.5" />
            Manual de Engenharia Operacional & Almoxarifado
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Space_Grotesk']">
            Guia de Boas Práticas para Gestão Eficiente de Estoque
          </h2>
          <p className="mt-2 text-sm text-blue-100 leading-relaxed">
            Diretrizes técnicas recomendadas para otimizar o capital de giro, prevenir perdas, evitar rupturas de suprimentos
            e garantir 100% de acuracidade entre o saldo físico e o sistema.
          </p>
        </div>
      </div>

      {/* Grid of Key Best Practices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Ponto de Pedido & Estoque Mínimo */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200 hover:border-amber-400/60 transition-all hover:shadow-md flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-4">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0a3d62] mb-2">
            1. Ponto de Pedido (ROP) e Estoque Mínimo
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 grow">
            O ponto de pedido é o nível de estoque que dispara uma nova compra antes que o estoque de segurança seja violado.
            Nunca espere o item zerar para solicitar compra.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 mb-3">
            <span className="text-amber-700 font-bold block mb-0.5">Fórmula Operacional:</span>
            <span>ROP = (Consumo Diário × Prazo Entrega) + Est. Segurança</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            <li>Revisar o consumo a cada trimestre</li>
            <li>Monitorar lead time real dos fornecedores</li>
          </ul>
        </div>

        {/* Card 2: Curva ABC de Estoque */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200 hover:border-blue-400/60 transition-all hover:shadow-md flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0a3d62] flex items-center justify-center font-bold mb-4">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0a3d62] mb-2">
            2. Classificação Curva ABC (Pareto 80/20)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 grow">
            Nem todos os itens merecem a mesma energia de controle. Categorize seu estoque pelo impacto financeiro acumulado:
          </p>
          <div className="space-y-2 mb-3 text-xs">
            <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-900">
              <strong>Classe A (80% do valor / 20% dos itens):</strong> Itens de alto custo, requerem contagem rigorosa frequente.
            </div>
            <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900">
              <strong>Classe B (15% do valor / 30% dos itens):</strong> Itens intermediários, controle moderado.
            </div>
            <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900">
              <strong>Classe C (5% do valor / 50% dos itens):</strong> Suprimentos baratos com compra em lotes econômicos.
            </div>
          </div>
        </div>

        {/* Card 3: Metodologia PEPS / FIFO */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200 hover:border-emerald-400/60 transition-all hover:shadow-md flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-4">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0a3d62] mb-2">
            3. Método PEPS (Primeiro que Entra, Primeiro que Sai)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 grow">
            Os lotes mais antigos de materiais devem ser os primeiros a serem despachados e consumidos. Essencial para químicos,
            tintas, graxas, adesivos, fitas isolantes e borrachas.
          </p>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 mb-3 space-y-1">
            <p>• Evita vencimento e perda de propriedades químicas</p>
            <p>• Reduz perdas por deterioração física</p>
            <p>• Posicione itens novos atrás dos itens já estocados</p>
          </div>
        </div>

        {/* Card 4: Inventário Físico Rotativo */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200 hover:border-cyan-400/60 transition-all hover:shadow-md flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold mb-4">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0a3d62] mb-2">
            4. Inventário Rotativo e Acuracidade
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 grow">
            Em vez de parar a fábrica uma vez ao ano para inventário geral, conte pequenos grupos de produtos diariamente.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 mb-3 space-y-1">
            <p>
              <strong>Meta de Acuracidade:</strong> Superior a <strong>98%</strong>
            </p>
            <p className="font-mono text-[11px] text-slate-600">
              Acuracidade = (Qtd. Itens Corretos / Total Itens Auditados) × 100
            </p>
          </div>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            <li>Itens Classe A: contagem quinzenal</li>
            <li>Itens Classe B: contagem mensal</li>
            <li>Itens Classe C: contagem semestral</li>
          </ul>
        </div>

        {/* Card 5: Metodologia 5S & Endereçamento */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200 hover:border-amber-400/60 transition-all hover:shadow-md flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold mb-4">
            <Warehouse className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0a3d62] mb-2">
            5. Metodologia 5S e Endereçamento Lógico
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 grow">
            Um almoxarifado desorganizado gera compras duplicadas e perdas de tempo na busca de peças:
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1.5 mb-3">
            <p>
              <strong>Seiri (Descarte):</strong> Eliminar sucatas e itens obsoletos do armazém.
            </p>
            <p>
              <strong>Seiton (Organização):</strong> Todo material com código SKU visível e localização fixa (ex: Prateleira B-02).
            </p>
            <p>
              <strong>Seiso (Limpeza):</strong> Manter pisos limpos e sem poeira para preservar peças mecânicas.
            </p>
          </div>
        </div>

        {/* Card 6: Gestão de Rupturas & Itens Críticos */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200 hover:border-rose-400/60 transition-all hover:shadow-md flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold mb-4">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0a3d62] mb-2">
            6. Prevenção de Ruptura de Linha
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 grow">
            A falta de um item barato (ex: eletrodo ou rolamento de R$ 30) pode parar uma esteira fabril que fatura milhares de reais por hora.
          </p>
          <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-xs text-rose-900 space-y-1 mb-3">
            <p>• Identifique materiais sem substitutos rápidos</p>
            <p>• Tenha fornecedores homologados secundários (backup)</p>
            <p>• Alerte imediatamente as compras quando o saldo atingir o mínimo</p>
          </div>
        </div>
      </div>

      {/* Bottom Checklist Box */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
        <h4 className="text-base font-bold text-[#0a3d62] flex items-center gap-2 mb-4">
          <FileCheck2 className="w-5 h-5 text-[#f4d03f]" />
          Rotina Diária de Conferência do Almoxarife (Checklist)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-[#0a3d62] block mb-1">08:00 - Abertura de Turno</span>
            <p className="text-slate-600">
              Verificar no sistema as requisições com status "Pendente" ou "Urgente" para separação prévia.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-[#0a3d62] block mb-1">11:00 - Recebimento de Cargas</span>
            <p className="text-slate-600">
              Conferência cega da Nota Fiscal, inspeção de avarias e lançamento imediato de "Entrada" no sistema.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-[#0a3d62] block mb-1">14:00 - Inventário Rotativo</span>
            <p className="text-slate-600">
              Auditar fisicamente 5 a 10 itens aleatórios para validar se a contagem física bate com o sistema.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-[#0a3d62] block mb-1">17:00 - Fechamento e Baixas</span>
            <p className="text-slate-600">
              Garantir que todas as saídas do dia foram registradas com número de setor e assinatura da guia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
