import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro interceptado pelo ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              Recuperação do Sistema de Estoque
            </h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Ocorreu uma instabilidade pontual na interface. Clique abaixo para restabelecer a conexão e recarregar os dados do almoxarifado.
            </p>
            {this.state.error && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left mb-5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Detalhes Técnicos
                </span>
                <p className="text-xs font-mono text-rose-700 break-all line-clamp-3">
                  {this.state.error.message || 'Erro desconhecido'}
                </p>
              </div>
            )}
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 rounded-xl bg-[#0a3d62] hover:bg-[#0d4670] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Recarregar Sistema
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
