import React from 'react';
import { AlertTriangle, RotateCcw, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an unhandled runtime error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('primeroute_active_role');
      sessionStorage.clear();
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F3F7FF] flex items-center justify-center p-4 antialiased font-sans">
          <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_24px_rgba(7,29,73,0.08)] text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                Application Runtime Error
              </span>
              <h2 className="text-xl font-black text-[#0A1E42] mt-3">
                Something Went Wrong
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                An unexpected error occurred in the application view. The system prevented a blank white screen crash.
              </p>
            </div>

            {/* Error Message Box */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-left text-xs text-rose-900 font-mono overflow-x-auto space-y-1 max-h-48 overflow-y-auto">
              <div className="font-bold text-rose-950 flex items-center gap-1.5">
                <span>Error:</span>
                <span>{this.state.error?.name || 'Error'}</span>
              </div>
              <p className="text-rose-800 break-words whitespace-pre-wrap">
                {this.state.error?.message || 'Unknown runtime error'}
              </p>
              {this.state.error?.stack && (
                <pre className="text-[10px] text-rose-700/80 mt-2 font-mono whitespace-pre-wrap overflow-x-auto">
                  {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                </pre>
              )}
            </div>

            {/* Recovery Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#075EE8] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Session &amp; Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

