import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home, Compass } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Hindustan Culture Atlas ErrorBoundary]:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 bg-[#FAF7F0] dark:bg-[#12100E] border border-stone-200 dark:border-stone-800 rounded-2xl m-4 text-center">
          <div className="max-w-md space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#C85A17]/10 flex items-center justify-center text-[#C85A17]">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-stone-900 dark:text-stone-100">
              {this.props.fallbackTitle || 'Cultural Dossier Temporarily Unavailable'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-body">
              An unexpected system anomaly interrupted this archival view. No data was lost. You can reload this view or return to the Atlas exploration floor.
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-stone-100 dark:bg-stone-900 rounded-lg text-left text-[11px] font-mono text-stone-600 dark:text-stone-400 overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleRetry}
                className="px-5 py-2.5 rounded-xl font-heading font-semibold text-xs tracking-wider uppercase text-white bg-[#C85A17] hover:bg-[#A8450A] transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry View</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl font-heading font-semibold text-xs tracking-wider uppercase text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
