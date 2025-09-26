import React, { useState, useEffect } from 'react';
import { useLanguage, useAuth } from '../contexts/LanguageContext';
import { AnalyticsIcon, ListIcon, CloseIcon, ChevronRightIcon } from './icons';
import ClientManagement from './ClientManagement';
import { useClients } from '../src/hooks/useClients';
import { ClientData } from '../src/api/types';

interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: string;
    weight?: string;
    rest: string;
    notes?: string;
}

interface TrainingDay {
    id: string;
    name: string;
    exercises: Exercise[];
}

interface TrainingPlan {
    id: string;
    name: string;
    description: string;
    duration: string;
    days: TrainingDay[];
    createdAt: string;
}

interface Meal {
    id: string;
    name: string;
    ingredients: string[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface DietPlan {
    id: string;
    name: string;
    description: string;
    totalCalories: number;
    meals: Meal[];
    createdAt: string;
}

interface TrainerDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

const TrainerDashboard: React.FC<TrainerDashboardProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const { currentTrainer } = useAuth();
    
    // React Query hook for fetching clients
    const { data: clients = [], isLoading: clientsLoading, error: clientsError } = useClients(currentTrainer?.id);
    
    const [activeTab, setActiveTab] = useState('clients');
    const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
    const [showTrainingPlanForm, setShowTrainingPlanForm] = useState(false);
    const [showDietPlanForm, setShowDietPlanForm] = useState(false);
    const [isClientManagementOpen, setIsClientManagementOpen] = useState(false);

    // Load clients data from localStorage
    // Effect to handle component opening
    useEffect(() => {
        // React Query automatically handles data fetching when component mounts
        // No manual data loading needed
    }, [isOpen]);

    const getTrainingPlan = (email: string): TrainingPlan | undefined => {
        const planData = localStorage.getItem(`trainingPlan_${email}`);
        return planData ? JSON.parse(planData) : undefined;
    };

    const getDietPlan = (email: string): DietPlan | undefined => {
        const planData = localStorage.getItem(`dietPlan_${email}`);
        return planData ? JSON.parse(planData) : undefined;
    };

    const saveTrainingPlan = (clientEmail: string, plan: TrainingPlan) => {
        localStorage.setItem(`trainingPlan_${clientEmail}`, JSON.stringify(plan));
        // TODO: Implement API integration for training plans
    };

    const saveDietPlan = (clientEmail: string, plan: DietPlan) => {
        localStorage.setItem(`dietPlan_${clientEmail}`, JSON.stringify(plan));
        // TODO: Implement API integration for diet plans
    };

    const TrainingPlanForm: React.FC<{ client: ClientData; onSave: (plan: TrainingPlan) => void; onCancel: () => void }> = ({ client, onSave, onCancel }) => {
        const [planData, setPlanData] = useState<Partial<TrainingPlan>>({
            name: '',
            description: '',
            duration: '4 tygodnie',
            days: []
        });

        const addDay = () => {
            const newDay: TrainingDay = {
                id: Date.now().toString(),
                name: `Dzień ${(planData.days?.length || 0) + 1}`,
                exercises: []
            };
            setPlanData(prev => ({
                ...prev,
                days: [...(prev.days || []), newDay]
            }));
        };

        const addExercise = (dayId: string) => {
            const newExercise: Exercise = {
                id: Date.now().toString(),
                name: '',
                sets: 3,
                reps: '10-12',
                rest: '60s',
                notes: ''
            };
            setPlanData(prev => ({
                ...prev,
                days: prev.days?.map(day => 
                    day.id === dayId 
                        ? { ...day, exercises: [...day.exercises, newExercise] }
                        : day
                ) || []
            }));
        };

        const updateExercise = (dayId: string, exerciseId: string, field: keyof Exercise, value: any) => {
            setPlanData(prev => ({
                ...prev,
                days: prev.days?.map(day =>
                    day.id === dayId
                        ? {
                            ...day,
                            exercises: day.exercises.map(ex =>
                                ex.id === exerciseId ? { ...ex, [field]: value } : ex
                            )
                        }
                        : day
                ) || []
            }));
        };

        const handleSave = () => {
            const completePlan: TrainingPlan = {
                id: Date.now().toString(),
                name: planData.name || 'Plan Treningowy',
                description: planData.description || '',
                duration: planData.duration || '4 tygodnie',
                days: planData.days || [],
                createdAt: new Date().toISOString()
            };
            onSave(completePlan);
        };

        return (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-red-500">Nowy Plan Treningowy dla {client.personalInfo.firstName} {client.personalInfo.lastName}</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nazwa planu"
                        value={planData.name || ''}
                        onChange={(e) => setPlanData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white"
                    />
                    <select
                        value={planData.duration || ''}
                        onChange={(e) => setPlanData(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white"
                        aria-label="Czas trwania planu"
                        title="Wybierz czas trwania planu"
                    >
                        <option value="2 tygodnie">2 tygodnie</option>
                        <option value="4 tygodnie">4 tygodnie</option>
                        <option value="8 tygodni">8 tygodni</option>
                        <option value="12 tygodni">12 tygodni</option>
                    </select>
                </div>

                <textarea
                    placeholder="Opis planu"
                    value={planData.description || ''}
                    onChange={(e) => setPlanData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white"
                    rows={3}
                />

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-white">Dni Treningowe</h4>
                        <button
                            onClick={addDay}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Dodaj Dzień
                        </button>
                    </div>

                    {planData.days?.map((day, dayIndex) => (
                        <div key={day.id} className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
                            <input
                                type="text"
                                value={day.name}
                                onChange={(e) => setPlanData(prev => ({
                                    ...prev,
                                    days: prev.days?.map(d => d.id === day.id ? { ...d, name: e.target.value } : d) || []
                                }))}
                                className="text-lg font-semibold bg-transparent text-red-500 border-none outline-none mb-3"
                                placeholder="Nazwa dnia treningowego"
                                aria-label="Nazwa dnia treningowego"
                                title="Wprowadź nazwę dnia treningowego"
                            />

                            <div className="space-y-2">
                                {day.exercises.map((exercise) => (
                                    <div key={exercise.id} className="bg-[#333] rounded p-3 grid grid-cols-2 md:grid-cols-6 gap-2">
                                        <input
                                            type="text"
                                            placeholder="Nazwa ćwiczenia"
                                            value={exercise.name}
                                            onChange={(e) => updateExercise(day.id, exercise.id, 'name', e.target.value)}
                                            className="bg-[#444] border border-gray-600 rounded p-2 text-white col-span-2"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Serie"
                                            value={exercise.sets}
                                            onChange={(e) => updateExercise(day.id, exercise.id, 'sets', parseInt(e.target.value))}
                                            className="bg-[#444] border border-gray-600 rounded p-2 text-white"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Powtórzenia"
                                            value={exercise.reps}
                                            onChange={(e) => updateExercise(day.id, exercise.id, 'reps', e.target.value)}
                                            className="bg-[#444] border border-gray-600 rounded p-2 text-white"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Przerwa"
                                            value={exercise.rest}
                                            onChange={(e) => updateExercise(day.id, exercise.id, 'rest', e.target.value)}
                                            className="bg-[#444] border border-gray-600 rounded p-2 text-white"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Ciężar"
                                            value={exercise.weight || ''}
                                            onChange={(e) => updateExercise(day.id, exercise.id, 'weight', e.target.value)}
                                            className="bg-[#444] border border-gray-600 rounded p-2 text-white"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addExercise(day.id)}
                                    className="w-full py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                                >
                                    Dodaj Ćwiczenie
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                    >
                        Anuluj
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Zapisz Plan
                    </button>
                </div>
            </div>
        );
    };

    const DietPlanForm: React.FC<{ client: ClientData; onSave: (plan: DietPlan) => void; onCancel: () => void }> = ({ client, onSave, onCancel }) => {
        const [planData, setPlanData] = useState<Partial<DietPlan>>({
            name: '',
            description: '',
            totalCalories: 2000,
            meals: []
        });

        const addMeal = () => {
            const newMeal: Meal = {
                id: Date.now().toString(),
                name: '',
                ingredients: [],
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            };
            setPlanData(prev => ({
                ...prev,
                meals: [...(prev.meals || []), newMeal]
            }));
        };

        const updateMeal = (mealId: string, field: keyof Meal, value: any) => {
            setPlanData(prev => ({
                ...prev,
                meals: prev.meals?.map(meal =>
                    meal.id === mealId ? { ...meal, [field]: value } : meal
                ) || []
            }));
        };

        const handleSave = () => {
            const completePlan: DietPlan = {
                id: Date.now().toString(),
                name: planData.name || 'Plan Dietetyczny',
                description: planData.description || '',
                totalCalories: planData.totalCalories || 2000,
                meals: planData.meals || [],
                createdAt: new Date().toISOString()
            };
            onSave(completePlan);
        };

        return (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-red-500">Nowy Plan Dietetyczny dla {client.personalInfo.firstName} {client.personalInfo.lastName}</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nazwa planu"
                        value={planData.name || ''}
                        onChange={(e) => setPlanData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white"
                    />
                    <input
                        type="number"
                        placeholder="Łączne kalorie"
                        value={planData.totalCalories || ''}
                        onChange={(e) => setPlanData(prev => ({ ...prev, totalCalories: parseInt(e.target.value) }))}
                        className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white"
                    />
                </div>

                <textarea
                    placeholder="Opis planu"
                    value={planData.description || ''}
                    onChange={(e) => setPlanData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white"
                    rows={3}
                />

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-white">Posiłki</h4>
                        <button
                            onClick={addMeal}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Dodaj Posiłek
                        </button>
                    </div>

                    {planData.meals?.map((meal) => (
                        <div key={meal.id} className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
                            <input
                                type="text"
                                placeholder="Nazwa posiłku"
                                value={meal.name}
                                onChange={(e) => updateMeal(meal.id, 'name', e.target.value)}
                                className="w-full bg-[#333] border border-gray-600 rounded-lg p-3 text-white mb-3"
                            />
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                                <input
                                    type="number"
                                    placeholder="Kalorie"
                                    value={meal.calories}
                                    onChange={(e) => updateMeal(meal.id, 'calories', parseInt(e.target.value))}
                                    className="bg-[#444] border border-gray-600 rounded p-2 text-white"
                                />
                                <input
                                    type="number"
                                    placeholder="Białko (g)"
                                    value={meal.protein}
                                    onChange={(e) => updateMeal(meal.id, 'protein', parseInt(e.target.value))}
                                    className="bg-[#444] border border-gray-600 rounded p-2 text-white"
                                />
                                <input
                                    type="number"
                                    placeholder="Węglowodany (g)"
                                    value={meal.carbs}
                                    onChange={(e) => updateMeal(meal.id, 'carbs', parseInt(e.target.value))}
                                    className="bg-[#444] border border-gray-600 rounded p-2 text-white"
                                />
                                <input
                                    type="number"
                                    placeholder="Tłuszcz (g)"
                                    value={meal.fat}
                                    onChange={(e) => updateMeal(meal.id, 'fat', parseInt(e.target.value))}
                                    className="bg-[#444] border border-gray-600 rounded p-2 text-white"
                                />
                            </div>

                            <textarea
                                placeholder="Składniki (każdy w nowej linii)"
                                value={meal.ingredients.join('\n')}
                                onChange={(e) => updateMeal(meal.id, 'ingredients', e.target.value.split('\n').filter(i => i.trim()))}
                                className="w-full bg-[#444] border border-gray-600 rounded p-2 text-white"
                                rows={3}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                    >
                        Anuluj
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Zapisz Plan
                    </button>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg w-full max-w-7xl max-h-[95vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold uppercase text-white font-['Teko']">Panel Trenera</h2>
                        <p className="text-gray-400">Zarządzaj klientami i planami treningowymi</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white text-3xl leading-none"
                        aria-label="Zamknij panel trenera"
                        title="Zamknij panel trenera"
                    >
                        <CloseIcon className="w-8 h-8" />
                    </button>
                </div>

                <div className="flex h-full" style={{ maxHeight: 'calc(95vh - 100px)' }}>
                    {/* Sidebar */}
                    <div className="w-64 bg-[#2a2a2a] border-r border-gray-800 p-4">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('clients')}
                                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === 'clients' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                <ListIcon className="w-5 h-5 mr-3" />
                                Klienci ({clients.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === 'analytics' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                <AnalyticsIcon className="w-5 h-5 mr-3" />
                                Statystyki
                            </button>
                            <button
                                onClick={() => setIsClientManagementOpen(true)}
                                className="w-full flex items-center px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 border border-blue-600 hover:border-blue-500"
                            >
                                <ListIcon className="w-5 h-5 mr-3" />
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">Zarządzaj Klientami</span>
                                    <span className="text-xs text-blue-400">Nowy system!</span>
                                </div>
                                <ChevronRightIcon className="w-4 h-4 ml-auto" />
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {activeTab === 'clients' && (
                            <div>
                                {clientsLoading && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400">Ładowanie klientów...</p>
                                    </div>
                                )}
                                
                                {clientsError && (
                                    <div className="text-center py-12">
                                        <p className="text-red-400">Błąd ładowania klientów: {clientsError.message}</p>
                                    </div>
                                )}

                                {!clientsLoading && !clientsError && !selectedClient && !showTrainingPlanForm && !showDietPlanForm && (
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-6">Lista Klientów ({clients.length})</h3>
                                        <div className="grid gap-4">
                                            {clients.map((client) => (
                                                <div
                                                    key={client.id}
                                                    className="bg-[#2a2a2a] rounded-lg p-4 hover:bg-[#333] transition-colors cursor-pointer"
                                                    onClick={() => setSelectedClient(client)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="text-lg font-semibold text-white">{client.personalInfo.firstName} {client.personalInfo.lastName}</h4>
                                                            <p className="text-gray-400">{client.personalInfo.email}</p>
                                                            <p className="text-sm text-gray-500">
                                                                Rejestracja: {client.joinDate}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="flex space-x-2 mb-2">
                                                                {/* TODO: Check for training plans from API */}
                                                                {/* {client.trainingPlan && (
                                                                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                                                                        Plan treningowy
                                                                    </span>
                                                                )} */}
                                                                {/* TODO: Check for diet plans from API */}
                                                                {/* {client.dietPlan && (
                                                                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                                                                        Plan dietetyczny
                                                                    </span>
                                                                )} */}
                                                            </div>
                                                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {clients.length === 0 && (
                                                <div className="text-center py-12 text-gray-400">
                                                    Brak zarejestrowanych klientów
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedClient && !showTrainingPlanForm && !showDietPlanForm && (
                                    <div>
                                        <div className="flex items-center mb-6">
                                            <button
                                                onClick={() => setSelectedClient(null)}
                                                className="text-gray-400 hover:text-white mr-4"
                                            >
                                                ← Wróć
                                            </button>
                                            <h3 className="text-xl font-bold text-white">Profil Klienta: {selectedClient.personalInfo.firstName} {selectedClient.personalInfo.lastName}</h3>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-6">
                                            {/* Client Info */}
                                            <div className="bg-[#2a2a2a] rounded-lg p-6">
                                                <h4 className="text-lg font-semibold text-red-500 mb-4">Informacje Podstawowe</h4>
                                                <div className="space-y-2 text-gray-300">
                                                    <p><strong>Email:</strong> {selectedClient.personalInfo.email}</p>
                                                    <p><strong>Data rejestracji:</strong> {selectedClient.joinDate}</p>
                                                    <p><strong>Ostatnia aktywność:</strong> {selectedClient.lastActivity || 'Brak danych'}</p>
                                                </div>
                                            </div>

                                            {/* Goals */}
                                            <div className="bg-[#2a2a2a] rounded-lg p-6">
                                                <h4 className="text-lg font-semibold text-red-500 mb-4">Cele Klienta</h4>
                                                <div className="space-y-3">
                                                    {Object.entries(selectedClient.goals).map(([key, goal]: [string, any]) => (
                                                        <div key={key} className="flex justify-between items-center">
                                                            <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                            <span className="text-white">
                                                                {goal.current} → {goal.goal}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Plans Section */}
                                        <div className="mt-6 grid lg:grid-cols-2 gap-6">
                                            {/* Training Plan */}
                                            <div className="bg-[#2a2a2a] rounded-lg p-6">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="text-lg font-semibold text-red-500">Plan Treningowy</h4>
                                                    <button
                                                        onClick={() => setShowTrainingPlanForm(true)}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                                                    >
                                                        Utwórz Plan (TODO)
                                                    </button>
                                                </div>
                                                {/* TODO: Implement training plan display when API is ready */}
                                                <p className="text-gray-400">Plany treningowe - do implementacji w API</p>
                                            </div>

                                            {/* Diet Plan */}
                                            <div className="bg-[#2a2a2a] rounded-lg p-6">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="text-lg font-semibold text-red-500">Plan Dietetyczny</h4>
                                                    <button
                                                        onClick={() => setShowDietPlanForm(true)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                                    >
                                                        Utwórz Plan (TODO)
                                                    </button>
                                                </div>
                                                {/* TODO: Implement diet plan display when API is ready */}
                                                <p className="text-gray-400">Plany dietetyczne - do implementacji w API</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showTrainingPlanForm && selectedClient && (
                                    <TrainingPlanForm
                                        client={selectedClient}
                                        onSave={(plan) => {
                                            saveTrainingPlan(selectedClient.personalInfo.email || selectedClient.id, plan);
                                            setShowTrainingPlanForm(false);
                                        }}
                                        onCancel={() => setShowTrainingPlanForm(false)}
                                    />
                                )}

                                {showDietPlanForm && selectedClient && (
                                    <DietPlanForm
                                        client={selectedClient}
                                        onSave={(plan) => {
                                            saveDietPlan(selectedClient.personalInfo.email || selectedClient.id, plan);
                                            setShowDietPlanForm(false);
                                        }}
                                        onCancel={() => setShowDietPlanForm(false)}
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div>
                                <h3 className="text-xl font-bold text-white mb-6">Statystyki</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-[#2a2a2a] rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="bg-red-600 rounded-lg p-3 mr-4">
                                                <ListIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Łącznie klientów</p>
                                                <p className="text-2xl font-bold text-white">{clients.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-[#2a2a2a] rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="bg-green-600 rounded-lg p-3 mr-4">
                                                <AnalyticsIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Plany treningowe</p>
                                                <p className="text-2xl font-bold text-white">
                                                    0 {/* TODO: Count training plans when API ready */}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#2a2a2a] rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="bg-blue-600 rounded-lg p-3 mr-4">
                                                <AnalyticsIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Plany dietetyczne</p>
                                                <p className="text-2xl font-bold text-white">
                                                    0 {/* TODO: Count diet plans when API ready */}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#2a2a2a] rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="bg-purple-600 rounded-lg p-3 mr-4">
                                                <AnalyticsIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Aktywni klienci</p>
                                                <p className="text-2xl font-bold text-white">{clients.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ClientManagement Modal */}
            <ClientManagement 
                isOpen={isClientManagementOpen} 
                onClose={() => setIsClientManagementOpen(false)} 
            />
        </div>
    );
};

export default TrainerDashboard;