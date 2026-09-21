import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un error no controlado:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetData = () => {
    if (window.confirm('¿Deseas restablecer los datos locales de la aplicación? Esta acción limpiará las tareas guardadas para resolver el problema de carga.')) {
      try {
        localStorage.removeItem('eisenhower-tasks');
      } catch (e) {
        console.error('Error al limpiar localStorage:', e);
      }
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 p-6">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/40 rounded-2xl p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            
            <h2 className="text-xl font-bold mb-2">Algo salió mal</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Ocurrió un error inesperado al renderizar la aplicación. Tus datos en el dispositivo no se han borrado automáticamente.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-medium text-sm transition-colors"
              >
                <RefreshCw size={16} />
                <span>Recargar aplicación</span>
              </button>

              <button
                onClick={this.handleResetData}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                <Trash2 size={14} />
                <span>Restablecer datos locales</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
