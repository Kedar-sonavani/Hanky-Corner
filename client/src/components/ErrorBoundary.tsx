'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="flex justify-center">
              <div className="p-6 rounded-[2.5rem] bg-zinc-900 text-white shadow-2xl shadow-zinc-200">
                <AlertTriangle className="h-12 w-12" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-heading font-black uppercase tracking-tighter text-zinc-900">
                Something went wrong
              </h1>
              <p className="text-zinc-500 font-medium leading-relaxed">
                The atelier encountered an unexpected error. We've been notified and are looking into it.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4">
              <Button
                onClick={() => window.location.reload()}
                className="w-full py-8 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-zinc-900/10 group"
              >
                <RefreshCcw className="h-4 w-4 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                Reload Page
              </Button>

              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full py-8 rounded-3xl font-black uppercase tracking-[0.2em] text-xs border-2 border-zinc-200 hover:border-zinc-900 hover:bg-transparent transition-all"
              >
                <Home className="h-4 w-4 mr-3" />
                Back to Archive
              </Button>
            </div>

            <div className="pt-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                Error Reference: {this.state.error?.name || 'Unknown Runtime Exception'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
