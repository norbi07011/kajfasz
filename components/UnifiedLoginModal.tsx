import React, { useState } from 'react';
import { useLanguage, useAuth, UserGoals } from '../contexts/LanguageContext';
import { CloseIcon, UserIcon, ShieldIcon } from './icons';

interface UnifiedLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type UserRole = 'client' | 'trainer';
type ViewType = 'role-select' | 'client-login' | 'client-register' | 'client-goals' | 'trainer-login';

const UnifiedLoginModal: React.FC<UnifiedLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useLanguage();
    const { login, register, trainerLogin } = useAuth();
    
    const [view, setView] = useState<ViewType>('role-select');
    const [selectedRole, setSelectedRole] = useState<UserRole>('client');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [goals, setGoals] = useState<UserGoals>({
        weight: { current: 70, goal: 60, history: [] },
        pushups: { current: 20, goal: 50, history: [] },
        pullups: { current: 5, goal: 20, history: [] },
        runDistance: { current: 3, goal: 10, history: [] },
        runTime: { current: 30, goal: 25, history: [] },
        boxingDuration: { current: 3, goal: 10, history: [] },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleGoalChange = (category: keyof UserGoals, type: 'current' | 'goal', value: string) => {
        const numValue = Number(value);
        setGoals(prev => ({
            ...prev,
            [category]: { ...prev[category], [type]: numValue }
        }));
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setError('');
        setIsLoading(false);
    };

    const handleClose = () => {
        resetForm();
        setView('role-select');
        onClose();
    };

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        if (role === 'trainer') {
            setView('trainer-login');
        } else {
            setView('client-login');
        }
    };

    const handleClientLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = login(formData.email, formData.password);
            if (success) {
                onSuccess();
                handleClose();
            } else {
                setError('Nieprawidłowy email lub hasło');
            }
        } catch (error) {
            setError('Wystąpił błąd podczas logowania');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTrainerLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = trainerLogin(formData.email, formData.password);
            if (success) {
                onSuccess();
                handleClose();
            } else {
                setError('Nieprawidłowy email lub hasło trenera');
            }
        } catch (error) {
            setError('Wystąpił błąd podczas logowania');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClientRegisterStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Hasła nie są identyczne');
            return;
        }
        if (formData.password.length < 6) {
            setError('Hasło musi mieć co najmniej 6 znaków');
            return;
        }
        setError('');
        setView('client-goals');
    };

    const handleClientRegisterComplete = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const initialGoals = JSON.parse(JSON.stringify(goals));
            Object.keys(initialGoals).forEach(key => {
                const typedKey = key as keyof UserGoals;
                initialGoals[typedKey].history = [{ 
                    date: new Date().toISOString(), 
                    value: initialGoals[typedKey].current 
                }];
            });

            const success = register(formData.name, formData.email, formData.password, initialGoals);
            if (success) {
                onSuccess();
                handleClose();
            } else {
                setError('Użytkownik o tym emailu już istnieje');
                setView('client-register');
            }
        } catch (error) {
            setError('Wystąpił błąd podczas rejestracji');
            setView('client-register');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-xl p-8 w-full max-w-md border border-gray-700 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Zamknij modal"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>

                {/* Role Selection */}
                {view === 'role-select' && (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-6">Wybierz sposób logowania</h2>
                        
                        <div className="space-y-4">
                            <button
                                onClick={() => handleRoleSelect('client')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
                            >
                                <UserIcon className="w-6 h-6" />
                                <div className="text-left">
                                    <div className="font-semibold">Jestem klientem</div>
                                    <div className="text-sm opacity-90">Śledzę swoje postępy treningowe</div>
                                </div>
                            </button>
                            
                            <button
                                onClick={() => handleRoleSelect('trainer')}
                                className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
                            >
                                <ShieldIcon className="w-6 h-6" />
                                <div className="text-left">
                                    <div className="font-semibold">Jestem trenerem</div>
                                    <div className="text-sm opacity-90">Zarządzam klientami i planami</div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Client Login */}
                {view === 'client-login' && (
                    <div>
                        <button
                            onClick={() => setView('role-select')}
                            className="text-blue-400 hover:text-blue-300 mb-4 text-sm"
                        >
                            ← Wróć do wyboru roli
                        </button>
                        
                        <h2 className="text-2xl font-bold text-white mb-6">Logowanie klienta</h2>
                        
                        <form onSubmit={handleClientLogin} className="space-y-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                            
                            <input
                                type="password"
                                name="password"
                                placeholder="Hasło"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                            
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg transition-colors"
                            >
                                {isLoading ? 'Logowanie...' : 'Zaloguj się'}
                            </button>
                        </form>
                        
                        <p className="text-center text-gray-400 mt-4">
                            Nie masz konta?{' '}
                            <button
                                onClick={() => setView('client-register')}
                                className="text-blue-400 hover:text-blue-300"
                            >
                                Zarejestruj się
                            </button>
                        </p>
                    </div>
                )}

                {/* Client Register */}
                {view === 'client-register' && (
                    <div>
                        <button
                            onClick={() => setView('client-login')}
                            className="text-blue-400 hover:text-blue-300 mb-4 text-sm"
                        >
                            ← Wróć do logowania
                        </button>
                        
                        <h2 className="text-2xl font-bold text-white mb-6">Rejestracja klienta</h2>
                        
                        <form onSubmit={handleClientRegisterStep1} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Imię i nazwisko"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                            
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                            
                            <input
                                type="password"
                                name="password"
                                placeholder="Hasło (min. 6 znaków)"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                minLength={6}
                                className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                            
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Potwierdź hasło"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                            
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
                            >
                                Dalej - Ustaw cele
                            </button>
                        </form>
                    </div>
                )}

                {/* Client Goals Setup */}
                {view === 'client-goals' && (
                    <div>
                        <button
                            onClick={() => setView('client-register')}
                            className="text-blue-400 hover:text-blue-300 mb-4 text-sm"
                        >
                            ← Wróć do rejestracji
                        </button>
                        
                        <h2 className="text-2xl font-bold text-white mb-6">Ustaw swoje cele</h2>
                        <p className="text-gray-400 mb-6 text-sm">Możesz to zmienić później w swoim profilu</p>
                        
                        <form onSubmit={handleClientRegisterComplete} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 text-sm mb-1">Waga (kg)</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="number"
                                            placeholder="Obecna"
                                            value={goals.weight.current}
                                            onChange={(e) => handleGoalChange('weight', 'current', e.target.value)}
                                            className="w-full bg-[#333] border border-gray-600 rounded p-2 text-white text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Cel"
                                            value={goals.weight.goal}
                                            onChange={(e) => handleGoalChange('weight', 'goal', e.target.value)}
                                            className="w-full bg-[#333] border border-gray-600 rounded p-2 text-white text-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-300 text-sm mb-1">Pompki</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="number"
                                            placeholder="Obecne"
                                            value={goals.pushups.current}
                                            onChange={(e) => handleGoalChange('pushups', 'current', e.target.value)}
                                            className="w-full bg-[#333] border border-gray-600 rounded p-2 text-white text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Cel"
                                            value={goals.pushups.goal}
                                            onChange={(e) => handleGoalChange('pushups', 'goal', e.target.value)}
                                            className="w-full bg-[#333] border border-gray-600 rounded p-2 text-white text-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-300 text-sm mb-1">Podciągnięcia</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="number"
                                            placeholder="Obecne"
                                            value={goals.pullups.current}
                                            onChange={(e) => handleGoalChange('pullups', 'current', e.target.value)}
                                            className="w-full bg-[#333] border border-gray-600 rounded p-2 text-white text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Cel"
                                            value={goals.pullups.goal}
                                            onChange={(e) => handleGoalChange('pullups', 'goal', e.target.value)}
                                            className="w-full bg-[#333] border border-gray-600 rounded p-2 text-white text-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-300 text-sm mb-1">Bieg (km)</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="number"
                                            placeholder="Obecny"
                                            value={goals.runDistance.current}
                                            onChange={(e) => handleGoalChange('runDistance', 'current', e.target.value)}
                                            className="w-full bg-[#333] border border-gray-600 rounded p-2 text-white text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Cel"
                                            value={goals.runDistance.goal}
                                            onChange={(e) => handleGoalChange('runDistance', 'goal', e.target.value)}
                                            className="w-full bg-[#333] border border-gray-600 rounded p-2 text-white text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg transition-colors"
                            >
                                {isLoading ? 'Tworzenie konta...' : 'Utwórz konto'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Trainer Login */}
                {view === 'trainer-login' && (
                    <div>
                        <button
                            onClick={() => setView('role-select')}
                            className="text-blue-400 hover:text-blue-300 mb-4 text-sm"
                        >
                            ← Wróć do wyboru roli
                        </button>
                        
                        <h2 className="text-2xl font-bold text-white mb-6">Logowanie trenera</h2>
                        
                        <div className="bg-gray-800 p-4 rounded-lg mb-4">
                            <p className="text-gray-300 text-sm mb-2">
                                <strong>Domyślne dane trenera:</strong>
                            </p>
                            <p className="text-gray-400 text-xs">Email: admin@kajfasz.nl</p>
                            <p className="text-gray-400 text-xs">Hasło: kajfasz2024!</p>
                        </div>
                        
                        <form onSubmit={handleTrainerLogin} className="space-y-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email trenera"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white focus:ring-red-500 focus:border-red-500"
                            />
                            
                            <input
                                type="password"
                                name="password"
                                placeholder="Hasło"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white focus:ring-red-500 focus:border-red-500"
                            />
                            
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-lg transition-colors"
                            >
                                {isLoading ? 'Logowanie...' : 'Zaloguj jako trener'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnifiedLoginModal;