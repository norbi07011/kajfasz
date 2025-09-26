import React from 'react';
import { useAuth } from '../contexts/LanguageContext';

interface ProtectedTrainerRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const ProtectedTrainerRoute: React.FC<ProtectedTrainerRouteProps> = ({ 
    children, 
    fallback 
}) => {
    const { isTrainerAuthenticated } = useAuth();

    if (!isTrainerAuthenticated()) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8 text-center max-w-md">
                    <h3 className="text-xl font-bold text-white mb-4">
                        Wymagana Autoryzacja Trenera
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Musisz być zalogowany jako trener aby uzyskać dostęp do tego panelu.
                    </p>
                    {fallback || (
                        <div className="text-gray-500">
                            Zamknij to okno i użyj przycisku "Panel Trenera" aby się zalogować.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedTrainerRoute;