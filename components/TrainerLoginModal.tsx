import React, { useState } from 'react';
import { useLanguage, useAuth } from '../contexts/LanguageContext';
import { CloseIcon } from './icons';

interface TrainerLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const TrainerLoginModal: React.FC<TrainerLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useLanguage();
    const { trainerLogin } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Wyczyść błąd przy zmianie
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = trainerLogin(formData.email, formData.password);
            if (success) {
                onSuccess();
                onClose();
                setFormData({ email: '', password: '' });
            } else {
                setError('Nieprawidłowy email lub hasło trenera');
            }
        } catch (error) {
            setError('Wystąpił błąd podczas logowania');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ email: '', password: '' });
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg w-full max-w-md">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-2xl font-bold uppercase text-white font-['Teko']">
                        Panel Trenera
                    </h2>
                    <button 
                        onClick={handleClose} 
                        className="text-gray-400 hover:text-white"
                        aria-label="Zamknij modal logowania trenera"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="p-6">
                    <p className="text-gray-400 mb-6 text-center">
                        Zaloguj się aby zarządzać panelem trenera i klientami
                    </p>
                    
                    {error && (
                        <div className="bg-red-900/50 border border-red-500 text-red-300 text-center p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email trenera"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                            />
                        </div>
                        
                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Hasło"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            {isLoading ? 'Logowanie...' : 'Zaloguj jako Trener'}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                        <p className="text-xs text-gray-400 mb-2">Dane testowe:</p>
                        <p className="text-xs text-gray-300">Email: admin@kajfasz.nl</p>
                        <p className="text-xs text-gray-300">Hasło: kajfasz2024!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerLoginModal;