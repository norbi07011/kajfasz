import React, { useState, useEffect } from 'react';
import { useLanguage, useAuth } from '../contexts/LanguageContext';
import { AnalyticsIcon, ListIcon, CloseIcon, ChevronRightIcon } from './icons';

interface TrainingPlan {
    id: string;
    name: string;
    description: string;
    duration: string;
    days: TrainingDay[];
    createdAt: string;
}

interface TrainingDay {
    id: string;
    name: string;
    exercises: Exercise[];
}

interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: string;
    weight?: string;
    rest: string;
    notes?: string;
    completed?: boolean;
}

interface DietPlan {
    id: string;
    name: string;
    description: string;
    totalCalories: number;
    meals: Meal[];
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

interface AdvancedDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdvancedDashboard: React.FC<AdvancedDashboardProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const { currentUser, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
    const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
    const [selectedDay, setSelectedDay] = useState<TrainingDay | null>(null);
    const [workoutProgress, setWorkoutProgress] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (isOpen && currentUser) {
            loadUserPlans();
            loadWorkoutProgress();
        }
    }, [isOpen, currentUser]);

    const loadUserPlans = () => {
        if (!currentUser) return;
        
        const trainingPlanData = localStorage.getItem(`trainingPlan_${currentUser.email}`);
        if (trainingPlanData) {
            setTrainingPlan(JSON.parse(trainingPlanData));
        }

        const dietPlanData = localStorage.getItem(`dietPlan_${currentUser.email}`);
        if (dietPlanData) {
            setDietPlan(JSON.parse(dietPlanData));
        }
    };

    const loadWorkoutProgress = () => {
        if (!currentUser) return;
        
        const progressData = localStorage.getItem(`workoutProgress_${currentUser.email}`);
        if (progressData) {
            setWorkoutProgress(JSON.parse(progressData));
        }
    };

    const saveWorkoutProgress = (newProgress: { [key: string]: boolean }) => {
        if (!currentUser) return;
        
        setWorkoutProgress(newProgress);
        localStorage.setItem(`workoutProgress_${currentUser.email}`, JSON.stringify(newProgress));
    };

    const markExerciseComplete = (exerciseId: string, completed: boolean) => {
        const newProgress = { ...workoutProgress, [exerciseId]: completed };
        saveWorkoutProgress(newProgress);
    };

    const getCurrentWeekProgress = () => {
        if (!trainingPlan) return 0;
        
        const totalExercises = trainingPlan.days.reduce((total, day) => total + day.exercises.length, 0);
        const completedExercises = Object.values(workoutProgress).filter(Boolean).length;
        
        return totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
    };

    const getStreakDays = () => {
        // Mock streak calculation - in real app this would be based on actual workout dates
        return 7;
    };

    if (!isOpen || !currentUser) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg w-full max-w-7xl max-h-[95vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold uppercase text-white font-['Teko']">
                            {t('dashboard.welcome_message').replace('{{name}}', currentUser.name)}
                        </h2>
                        <p className="text-gray-400">{t('dashboard.subtitle')}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white text-3xl leading-none"
                        aria-label="Zamknij dashboard"
                        title="Zamknij dashboard"
                    >
                        <CloseIcon className="w-8 h-8" />
                    </button>
                </div>

                <div className="flex h-full" style={{ maxHeight: 'calc(95vh - 100px)' }}>
                    {/* Sidebar */}
                    <div className="w-64 bg-[#2a2a2a] border-r border-gray-800 p-4">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === 'overview' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                <AnalyticsIcon className="w-5 h-5 mr-3" />
                                Przegląd
                            </button>
                            <button
                                onClick={() => setActiveTab('training')}
                                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === 'training' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                <ListIcon className="w-5 h-5 mr-3" />
                                Plan Treningowy
                            </button>
                            <button
                                onClick={() => setActiveTab('diet')}
                                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === 'diet' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                <ListIcon className="w-5 h-5 mr-3" />
                                Plan Dietetyczny
                            </button>
                            <button
                                onClick={() => setActiveTab('goals')}
                                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === 'goals' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                <AnalyticsIcon className="w-5 h-5 mr-3" />
                                Moje Cele
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">Dashboard - Przegląd</h3>
                                
                                {/* Quick Stats */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-[#2a2a2a] rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="bg-red-600 rounded-lg p-3 mr-4">
                                                <AnalyticsIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Postęp tygodnia</p>
                                                <p className="text-2xl font-bold text-white">{getCurrentWeekProgress()}%</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-[#2a2a2a] rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="bg-green-600 rounded-lg p-3 mr-4">
                                                <ListIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Seria dni</p>
                                                <p className="text-2xl font-bold text-white">{getStreakDays()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#2a2a2a] rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="bg-blue-600 rounded-lg p-3 mr-4">
                                                <AnalyticsIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Plan treningowy</p>
                                                <p className="text-lg font-bold text-white">
                                                    {trainingPlan ? '✓ Aktywny' : '⏳ Oczekujący'}
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
                                                <p className="text-gray-400 text-sm">Plan diety</p>
                                                <p className="text-lg font-bold text-white">
                                                    {dietPlan ? '✓ Aktywny' : '⏳ Oczekujący'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Today's Workout */}
                                {trainingPlan && trainingPlan.days.length > 0 && (
                                    <div className="bg-[#2a2a2a] rounded-lg p-6">
                                        <h4 className="text-lg font-semibold text-red-500 mb-4">Dzisiejszy Trening</h4>
                                        <div className="bg-[#333] rounded-lg p-4">
                                            <h5 className="font-semibold text-white mb-2">{trainingPlan.days[0].name}</h5>
                                            <p className="text-gray-400 mb-4">
                                                {trainingPlan.days[0].exercises.length} ćwiczeń do wykonania
                                            </p>
                                            <button
                                                onClick={() => setActiveTab('training')}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                            >
                                                Rozpocznij trening
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Goals Progress */}
                                <div className="bg-[#2a2a2a] rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-red-500 mb-4">Postęp w Celach</h4>
                                    <div className="space-y-4">
                                        {Object.entries(currentUser.goals).slice(0, 3).map(([key, goal]: [string, any]) => (
                                            <div key={key}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-white capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1')}
                                                    </span>
                                                    <span className="text-gray-400">
                                                        {goal.current} / {goal.goal}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${Math.min((goal.current / goal.goal) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'training' && (
                            <div className="space-y-6">
                                {!selectedDay && (
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-6">Plan Treningowy</h3>
                                        {trainingPlan ? (
                                            <div>
                                                <div className="bg-[#2a2a2a] rounded-lg p-6 mb-6">
                                                    <h4 className="text-lg font-semibold text-red-500 mb-2">{trainingPlan.name}</h4>
                                                    <p className="text-gray-400 mb-2">{trainingPlan.description}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Czas trwania: {trainingPlan.duration} | Utworzony: {new Date(trainingPlan.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <div className="grid gap-4">
                                                    {trainingPlan.days.map((day) => {
                                                        const completedExercises = day.exercises.filter(ex => workoutProgress[ex.id]).length;
                                                        const progressPercentage = day.exercises.length > 0 
                                                            ? Math.round((completedExercises / day.exercises.length) * 100) 
                                                            : 0;

                                                        return (
                                                            <div
                                                                key={day.id}
                                                                className="bg-[#2a2a2a] rounded-lg p-4 hover:bg-[#333] transition-colors cursor-pointer"
                                                                onClick={() => setSelectedDay(day)}
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex-1">
                                                                        <h5 className="text-lg font-semibold text-white mb-1">{day.name}</h5>
                                                                        <p className="text-gray-400 mb-2">
                                                                            {day.exercises.length} ćwiczeń
                                                                        </p>
                                                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                                                            <div
                                                                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                                                style={{ width: `${progressPercentage}%` }}
                                                                            ></div>
                                                                        </div>
                                                                        <p className="text-sm text-gray-500 mt-1">
                                                                            {completedExercises}/{day.exercises.length} ukończone ({progressPercentage}%)
                                                                        </p>
                                                                    </div>
                                                                    <ChevronRightIcon className="w-5 h-5 text-gray-400 ml-4" />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-[#2a2a2a] rounded-lg p-6 text-center">
                                                <h4 className="text-lg font-semibold text-white mb-2">Brak planu treningowego</h4>
                                                <p className="text-gray-400 mb-4">
                                                    Trener jeszcze nie przypisał Ci planu treningowego. Skontaktuj się z trenerem aby otrzymać spersonalizowany plan.
                                                </p>
                                                <button
                                                    onClick={onClose}
                                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                >
                                                    Skontaktuj się z trenerem
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedDay && (
                                    <div>
                                        <div className="flex items-center mb-6">
                                            <button
                                                onClick={() => setSelectedDay(null)}
                                                className="text-gray-400 hover:text-white mr-4"
                                            >
                                                ← Wróć do planu
                                            </button>
                                            <h3 className="text-xl font-bold text-white">{selectedDay.name}</h3>
                                        </div>

                                        <div className="space-y-4">
                                            {selectedDay.exercises.map((exercise) => (
                                                <div key={exercise.id} className="bg-[#2a2a2a] rounded-lg p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h5 className="text-lg font-semibold text-white mb-2">{exercise.name}</h5>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                                                                <div>
                                                                    <span className="font-medium">Serie:</span> {exercise.sets}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Powtórzenia:</span> {exercise.reps}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Przerwa:</span> {exercise.rest}
                                                                </div>
                                                                {exercise.weight && (
                                                                    <div>
                                                                        <span className="font-medium">Ciężar:</span> {exercise.weight}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {exercise.notes && (
                                                                <p className="text-gray-400 text-sm mt-2">
                                                                    <span className="font-medium">Notatki:</span> {exercise.notes}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <button
                                                                onClick={() => markExerciseComplete(exercise.id, !workoutProgress[exercise.id])}
                                                                className={`px-4 py-2 rounded-lg transition-colors ${
                                                                    workoutProgress[exercise.id]
                                                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                                                        : 'bg-gray-600 text-white hover:bg-gray-500'
                                                                }`}
                                                            >
                                                                {workoutProgress[exercise.id] ? '✓ Ukończone' : 'Oznacz jako ukończone'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'diet' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6">Plan Dietetyczny</h3>
                                {dietPlan ? (
                                    <div>
                                        <div className="bg-[#2a2a2a] rounded-lg p-6 mb-6">
                                            <h4 className="text-lg font-semibold text-red-500 mb-2">{dietPlan.name}</h4>
                                            <p className="text-gray-400 mb-2">{dietPlan.description}</p>
                                            <p className="text-sm text-gray-500">
                                                Łączne kalorie: {dietPlan.totalCalories} kcal | Utworzony: {new Date(dietPlan.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="grid gap-4">
                                            {dietPlan.meals.map((meal) => (
                                                <div key={meal.id} className="bg-[#2a2a2a] rounded-lg p-4">
                                                    <h5 className="text-lg font-semibold text-white mb-3">{meal.name}</h5>
                                                    
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                                        <div className="bg-[#333] rounded p-2 text-center">
                                                            <p className="text-gray-400">Kalorie</p>
                                                            <p className="text-white font-semibold">{meal.calories} kcal</p>
                                                        </div>
                                                        <div className="bg-[#333] rounded p-2 text-center">
                                                            <p className="text-gray-400">Białko</p>
                                                            <p className="text-white font-semibold">{meal.protein}g</p>
                                                        </div>
                                                        <div className="bg-[#333] rounded p-2 text-center">
                                                            <p className="text-gray-400">Węglowodany</p>
                                                            <p className="text-white font-semibold">{meal.carbs}g</p>
                                                        </div>
                                                        <div className="bg-[#333] rounded p-2 text-center">
                                                            <p className="text-gray-400">Tłuszcz</p>
                                                            <p className="text-white font-semibold">{meal.fat}g</p>
                                                        </div>
                                                    </div>

                                                    {meal.ingredients.length > 0 && (
                                                        <div>
                                                            <p className="text-gray-400 font-medium mb-2">Składniki:</p>
                                                            <ul className="text-gray-300 text-sm space-y-1">
                                                                {meal.ingredients.map((ingredient, index) => (
                                                                    <li key={index} className="flex items-center">
                                                                        <span className="text-red-500 mr-2">•</span>
                                                                        {ingredient}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-[#2a2a2a] rounded-lg p-6 text-center">
                                        <h4 className="text-lg font-semibold text-white mb-2">Brak planu dietetycznego</h4>
                                        <p className="text-gray-400 mb-4">
                                            Trener jeszcze nie przypisał Ci planu dietetycznego. Wypełnij ankietę dietetyczną aby otrzymać spersonalizowany plan.
                                        </p>
                                        <button
                                            onClick={onClose}
                                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Wypełnij ankietę dietetyczną
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'goals' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6">Moje Cele</h3>
                                <div className="grid gap-6">
                                    {Object.entries(currentUser.goals).map(([key, goal]: [string, any]) => (
                                        <div key={key} className="bg-[#2a2a2a] rounded-lg p-6">
                                            <h4 className="text-lg font-semibold text-red-500 mb-4 capitalize">
                                                {key.replace(/([A-Z])/g, ' $1')}
                                            </h4>
                                            
                                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                                <div className="bg-[#333] rounded p-4 text-center">
                                                    <p className="text-gray-400 text-sm">Obecna wartość</p>
                                                    <p className="text-2xl font-bold text-white">{goal.current}</p>
                                                </div>
                                                <div className="bg-[#333] rounded p-4 text-center">
                                                    <p className="text-gray-400 text-sm">Cel</p>
                                                    <p className="text-2xl font-bold text-green-500">{goal.goal}</p>
                                                </div>
                                                <div className="bg-[#333] rounded p-4 text-center">
                                                    <p className="text-gray-400 text-sm">Postęp</p>
                                                    <p className="text-2xl font-bold text-blue-500">
                                                        {Math.min(Math.round((goal.current / goal.goal) * 100), 100)}%
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                                                <div
                                                    className="bg-gradient-to-r from-red-600 to-red-400 h-3 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min((goal.current / goal.goal) * 100, 100)}%` }}
                                                ></div>
                                            </div>

                                            {goal.history && goal.history.length > 1 && (
                                                <div className="text-sm text-gray-400">
                                                    Ostatnia aktualizacja: {new Date(goal.history[goal.history.length - 1].date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedDashboard;