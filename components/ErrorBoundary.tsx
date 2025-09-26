import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: any;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('🚨 ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                    <div className="bg-red-900 border border-red-500 rounded-lg p-6 max-w-md w-full text-center">
                        <div className="text-6xl mb-4">💥</div>
                        <h2 className="text-white text-xl font-bold mb-4">Ups! Coś poszło nie tak</h2>
                        <p className="text-red-200 mb-4">
                            Aplikacja napotkała nieoczekiwany błąd. Spróbuj odświeżyć stronę.
                        </p>
                        
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-4 text-left">
                                <summary className="text-red-300 cursor-pointer hover:text-white">
                                    Szczegóły błędu (dev)
                                </summary>
                                <pre className="text-xs text-red-200 mt-2 p-2 bg-black rounded overflow-auto max-h-32">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                        
                        <div className="space-y-2">
                            <button 
                                onClick={() => window.location.reload()} 
                                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                            >
                                🔄 Odśwież stronę
                            </button>
                            <button 
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors text-sm"
                            >
                                🗑️ Wyczyść dane i odśwież
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;