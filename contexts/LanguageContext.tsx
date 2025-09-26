import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translations } from '../translations';

export type Language = 'pl' | 'en' | 'nl' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: { [key: string]: string }) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedTranslation = (language: Language, key: string): any => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
        result = result?.[k];
        if (result === undefined) return undefined;
    }
    return result;
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pl');

  const t = (key: string, params?: { [key: string]: string }): any => {
    let translation = getNestedTranslation(language, key) || getNestedTranslation('pl', key) || key;
    if (params) {
        Object.keys(params).forEach(pKey => {
            translation = translation.replace(`{{${pKey}}}`, params[pKey]);
        });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// --- START OF NEW AUTH CONTEXT CODE ---

export interface Goal {
    current: number;
    goal: number;
    history: { date: string; value: number }[];
}

export interface UserGoals {
    weight: Goal;
    pushups: Goal;
    pullups: Goal;
    runDistance: Goal;
    runTime: Goal; // For a fixed distance, e.g., 5k
    boxingDuration: Goal;
}

export interface User {
    name: string;
    email: string;
    goals: UserGoals;
    role?: 'user' | 'trainer'; // Dodaj role dla rozróżnienia
}

// ===== NOWE TYPY DLA ZARZĄDZANIA KLIENTAMI =====

export interface ClientPersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    height?: number; // cm
    medicalConditions?: string[];
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
}

export interface ClientGoals {
    primary: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'general_fitness';
    targetWeight?: number;
    targetDate?: string;
    motivations: string[];
    experience: 'beginner' | 'intermediate' | 'advanced';
    availableTime: number; // sessions per week
    preferredActivities: string[];
}

export interface MeasurementRecord {
    id: string;
    date: string;
    weight?: number;
    bodyFat?: number;
    muscleMass?: number;
    measurements?: {
        chest?: number;
        waist?: number;
        hips?: number;
        bicep?: number;
        thigh?: number;
    };
    photos?: {
        front?: string;
        side?: string;
        back?: string;
    };
    notes?: string;
    recordedBy: string; // trainer ID
}

export interface WorkoutExercise {
    id: string;
    name: string;
    category: 'strength' | 'cardio' | 'flexibility' | 'functional';
    muscleGroups: string[];
    equipment?: string[];
    instructions?: string;
    videoUrl?: string;
    sets?: number;
    reps?: string; // "8-12" lub "30 seconds"
    weight?: number;
    restTime?: number; // seconds
}

export interface WorkoutPlan {
    id: string;
    name: string;
    clientId: string;
    trainerId: string;
    duration: number; // weeks
    sessionsPerWeek: number;
    exercises: WorkoutExercise[];
    notes?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NutritionPlan {
    id: string;
    clientId: string;
    trainerId: string;
    dailyCalories: number;
    macros: {
        protein: number; // grams
        carbs: number;   // grams
        fats: number;    // grams
    };
    meals: {
        name: string;
        foods: string[];
        calories: number;
        time?: string;
    }[];
    restrictions?: string[];
    notes?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Client {
    id: string;
    personalInfo: ClientPersonalInfo;
    goals: ClientGoals;
    trainerId: string;
    measurements: MeasurementRecord[];
    workoutPlans: WorkoutPlan[];
    nutritionPlans: NutritionPlan[];
    status: 'active' | 'inactive' | 'paused';
    joinDate: string;
    lastActivity?: string;
    notes?: string;
}

// Nowe typy dla trenera
export interface Trainer {
    id: string;
    name: string;
    email: string;
    role: 'trainer';
    createdAt: Date;
}

interface AuthContextType {
    currentUser: User | null;
    currentTrainer: Trainer | null;
    login: (email: string, password: string) => boolean;
    trainerLogin: (email: string, password: string) => boolean;
    register: (name: string, email: string, password: string, goals: UserGoals) => boolean;
    logout: () => void;
    trainerLogout: () => void;
    updateUser: (user: User) => void;
    isTrainerAuthenticated: () => boolean;
    // Zarządzanie klientami
    clients: Client[];
    addClient: (clientData: Omit<Client, 'id' | 'trainerId' | 'joinDate'>) => boolean;
    updateClient: (clientId: string, clientData: Partial<Client>) => boolean;
    deleteClient: (clientId: string) => boolean;
    getClient: (clientId: string) => Client | null;
    getClientsByTrainer: (trainerId: string) => Client[];
    // Zarządzanie postępami
    addMeasurement: (clientId: string, measurement: Omit<MeasurementRecord, 'id' | 'recordedBy'>) => boolean;
    getMeasurements: (clientId: string) => MeasurementRecord[];
    // Zarządzanie planami
    addWorkoutPlan: (plan: Omit<WorkoutPlan, 'id' | 'createdAt' | 'updatedAt'>) => boolean;
    addNutritionPlan: (plan: Omit<NutritionPlan, 'id' | 'createdAt' | 'updatedAt'>) => boolean;
    getActiveWorkoutPlan: (clientId: string) => WorkoutPlan | null;
    getActiveNutritionPlan: (clientId: string) => NutritionPlan | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentTrainer, setCurrentTrainer] = useState<Trainer | null>(null);
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        try {
            const loggedInUserEmail = localStorage.getItem('loggedInUser');
            if (loggedInUserEmail) {
                const userData = localStorage.getItem(`user_${loggedInUserEmail}`);
                if (userData) {
                    setCurrentUser(JSON.parse(userData));
                }
            }
            // Sprawdź czy trener jest zalogowany
            const loggedInTrainerEmail = localStorage.getItem('loggedInTrainer');
            if (loggedInTrainerEmail) {
                const trainerData = localStorage.getItem(`trainer_${loggedInTrainerEmail}`);
                if (trainerData) {
                    setCurrentTrainer(JSON.parse(trainerData));
                }
            }
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
        }
    }, []);

    // Domyślne konto trenera (tymczasowe rozwiązanie)
    const DEFAULT_TRAINER = {
        id: 'trainer-1',
        name: 'Kajfasz Trainer',
        email: 'admin@kajfasz.nl', 
        role: 'trainer' as const,
        createdAt: new Date('2024-01-01')
    };

    // Domyślni testowi klienci
    const DEFAULT_CLIENTS = [
        {
            email: 'test@klient.pl',
            password: 'test123',
            name: 'Test Klient',
            goals: {
                weight: { current: 75, goal: 70, history: [{ date: new Date().toISOString(), value: 75 }] },
                pushups: { current: 15, goal: 30, history: [{ date: new Date().toISOString(), value: 15 }] },
                pullups: { current: 5, goal: 15, history: [{ date: new Date().toISOString(), value: 5 }] },
                runDistance: { current: 3, goal: 8, history: [{ date: new Date().toISOString(), value: 3 }] },
                runTime: { current: 30, goal: 25, history: [{ date: new Date().toISOString(), value: 30 }] },
                boxingDuration: { current: 5, goal: 15, history: [{ date: new Date().toISOString(), value: 5 }] },
            }
        },
        {
            email: 'anna@test.pl',
            password: 'anna123',
            name: 'Anna Kowalska',
            goals: {
                weight: { current: 65, goal: 60, history: [{ date: new Date().toISOString(), value: 65 }] },
                pushups: { current: 10, goal: 25, history: [{ date: new Date().toISOString(), value: 10 }] },
                pullups: { current: 2, goal: 10, history: [{ date: new Date().toISOString(), value: 2 }] },
                runDistance: { current: 2, goal: 6, history: [{ date: new Date().toISOString(), value: 2 }] },
                runTime: { current: 35, goal: 28, history: [{ date: new Date().toISOString(), value: 35 }] },
                boxingDuration: { current: 3, goal: 12, history: [{ date: new Date().toISOString(), value: 3 }] },
            }
        }
    ];

    // Inicjalizuj domyślne konto trenera przy pierwszym uruchomieniu
    useEffect(() => {
        const trainerExists = localStorage.getItem(`trainer_${DEFAULT_TRAINER.email}`);
        const trainerAccountExists = localStorage.getItem(`trainerAccount_${DEFAULT_TRAINER.email}`);
        
        if (!trainerExists || !trainerAccountExists) {
            localStorage.setItem(`trainer_${DEFAULT_TRAINER.email}`, JSON.stringify(DEFAULT_TRAINER));
            localStorage.setItem(`trainerAccount_${DEFAULT_TRAINER.email}`, JSON.stringify({
                email: DEFAULT_TRAINER.email,
                password: 'kajfasz2024!' // Bezpieczne hasło
            }));
        }
    }, []);

    // Inicjalizuj domyślnych testowych klientów
    useEffect(() => {
        DEFAULT_CLIENTS.forEach(client => {
            const userExists = localStorage.getItem(`user_${client.email}`);
            const accountExists = localStorage.getItem(`account_${client.email}`);
            
            if (!userExists || !accountExists) {
                console.log(`🔧 Tworzenie testowego klienta: ${client.email}`);
                localStorage.setItem(`user_${client.email}`, JSON.stringify({
                    name: client.name,
                    email: client.email,
                    goals: client.goals
                }));
                localStorage.setItem(`account_${client.email}`, JSON.stringify({
                    email: client.email,
                    password: client.password
                }));
            }
        });
    }, []);

    const login = (email: string, password: string): boolean => {
        console.log(`🔍 Próba logowania klienta: ${email}`);
        try {
            const accountData = localStorage.getItem(`account_${email}`);
            console.log(`📊 Dane konta znalezione:`, !!accountData);
            if (!accountData) {
                console.log(`❌ Brak konta dla: ${email}`);
                return false;
            }

            const userAccount = JSON.parse(accountData);
            console.log(`🔐 Sprawdzanie hasła...`);
            if (userAccount.password !== password) {
                console.log(`❌ Nieprawidłowe hasło dla: ${email}`);
                return false;
            }
            
            const userData = localStorage.getItem(`user_${email}`);
            console.log(`👤 Dane użytkownika znalezione:`, !!userData);
            if (!userData) {
                console.log(`❌ Brak danych użytkownika dla: ${email}`);
                return false;
            }

            const user = JSON.parse(userData);
            setCurrentUser(user);
            localStorage.setItem('loggedInUser', email);
            console.log(`✅ Logowanie udane dla: ${email}`);
            return true;
        } catch (error) {
            console.error("❌ Login failed", error);
            return false;
        }
    };

    const register = (name: string, email: string, password: string, goals: UserGoals): boolean => {
        if (localStorage.getItem(`user_${email}`)) {
            return false; // User already exists
        }
        try {
            const newUser: User = { name, email, goals };
            const newAccount = { email, password };

            localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
            localStorage.setItem(`account_${email}`, JSON.stringify(newAccount));
            
            setCurrentUser(newUser);
            localStorage.setItem('loggedInUser', email);
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            return false;
        }
    };
    
    const logout = () => {
        localStorage.removeItem('loggedInUser');
        setCurrentUser(null);
    };

    const updateUser = (user: User) => {
        try {
            setCurrentUser(user);
            localStorage.setItem(`user_${user.email}`, JSON.stringify(user));
        } catch (error) {
            console.error("Failed to update user", error);
        }
    }

    const trainerLogin = (email: string, password: string): boolean => {
        try {
            const accountData = localStorage.getItem(`trainerAccount_${email}`);
            if (!accountData) return false;

            const trainerAccount = JSON.parse(accountData);
            if (trainerAccount.password !== password) return false;
            
            const trainerData = localStorage.getItem(`trainer_${email}`);
            if (!trainerData) return false;

            setCurrentTrainer(JSON.parse(trainerData));
            localStorage.setItem('loggedInTrainer', email);
            return true;
        } catch (error) {
            console.error("Trainer login failed", error);
            return false;
        }
    };

    const trainerLogout = () => {
        localStorage.removeItem('loggedInTrainer');
        setCurrentTrainer(null);
    };

    const isTrainerAuthenticated = (): boolean => {
        return currentTrainer !== null;
    };

    // ===== FUNKCJE ZARZĄDZANIA KLIENTAMI =====

    // Ładowanie klientów z localStorage
    useEffect(() => {
        try {
            const clientsData = localStorage.getItem('clients');
            if (clientsData) {
                setClients(JSON.parse(clientsData));
            }
        } catch (error) {
            console.error("Failed to load clients from localStorage", error);
        }
    }, []);

    // Zapisywanie klientów do localStorage przy każdej zmianie
    useEffect(() => {
        try {
            localStorage.setItem('clients', JSON.stringify(clients));
        } catch (error) {
            console.error("Failed to save clients to localStorage", error);
        }
    }, [clients]);

    const generateId = (): string => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const addClient = (clientData: Omit<Client, 'id' | 'trainerId' | 'joinDate'>): boolean => {
        try {
            if (!currentTrainer) return false;
            
            const newClient: Client = {
                ...clientData,
                id: generateId(),
                trainerId: currentTrainer.id,
                joinDate: new Date().toISOString().split('T')[0],
                measurements: [],
                workoutPlans: [],
                nutritionPlans: []
            };

            setClients(prev => [...prev, newClient]);
            return true;
        } catch (error) {
            console.error("Failed to add client", error);
            return false;
        }
    };

    const updateClient = (clientId: string, clientData: Partial<Client>): boolean => {
        try {
            setClients(prev => prev.map(client => 
                client.id === clientId ? { ...client, ...clientData } : client
            ));
            return true;
        } catch (error) {
            console.error("Failed to update client", error);
            return false;
        }
    };

    const deleteClient = (clientId: string): boolean => {
        try {
            setClients(prev => prev.filter(client => client.id !== clientId));
            return true;
        } catch (error) {
            console.error("Failed to delete client", error);
            return false;
        }
    };

    const getClient = (clientId: string): Client | null => {
        return clients.find(client => client.id === clientId) || null;
    };

    const getClientsByTrainer = (trainerId: string): Client[] => {
        return clients.filter(client => client.trainerId === trainerId);
    };

    // ===== FUNKCJE ZARZĄDZANIA POSTĘPAMI =====

    const addMeasurement = (clientId: string, measurement: Omit<MeasurementRecord, 'id' | 'recordedBy'>): boolean => {
        try {
            if (!currentTrainer) return false;

            const newMeasurement: MeasurementRecord = {
                ...measurement,
                id: generateId(),
                recordedBy: currentTrainer.id
            };

            setClients(prev => prev.map(client => 
                client.id === clientId 
                    ? { ...client, measurements: [...client.measurements, newMeasurement] }
                    : client
            ));
            return true;
        } catch (error) {
            console.error("Failed to add measurement", error);
            return false;
        }
    };

    const getMeasurements = (clientId: string): MeasurementRecord[] => {
        const client = getClient(clientId);
        return client?.measurements || [];
    };

    // ===== FUNKCJE ZARZĄDZANIA PLANAMI =====

    const addWorkoutPlan = (plan: Omit<WorkoutPlan, 'id' | 'createdAt' | 'updatedAt'>): boolean => {
        try {
            const now = new Date().toISOString();
            const newPlan: WorkoutPlan = {
                ...plan,
                id: generateId(),
                createdAt: now,
                updatedAt: now
            };

            setClients(prev => prev.map(client => 
                client.id === plan.clientId 
                    ? { ...client, workoutPlans: [...client.workoutPlans, newPlan] }
                    : client
            ));
            return true;
        } catch (error) {
            console.error("Failed to add workout plan", error);
            return false;
        }
    };

    const addNutritionPlan = (plan: Omit<NutritionPlan, 'id' | 'createdAt' | 'updatedAt'>): boolean => {
        try {
            const now = new Date().toISOString();
            const newPlan: NutritionPlan = {
                ...plan,
                id: generateId(),
                createdAt: now,
                updatedAt: now
            };

            setClients(prev => prev.map(client => 
                client.id === plan.clientId 
                    ? { ...client, nutritionPlans: [...client.nutritionPlans, newPlan] }
                    : client
            ));
            return true;
        } catch (error) {
            console.error("Failed to add nutrition plan", error);
            return false;
        }
    };

    const getActiveWorkoutPlan = (clientId: string): WorkoutPlan | null => {
        const client = getClient(clientId);
        return client?.workoutPlans.find(plan => plan.isActive) || null;
    };

    const getActiveNutritionPlan = (clientId: string): NutritionPlan | null => {
        const client = getClient(clientId);
        return client?.nutritionPlans.find(plan => plan.isActive) || null;
    };

    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            currentTrainer,
            login, 
            trainerLogin,
            register, 
            logout, 
            trainerLogout,
            updateUser,
            isTrainerAuthenticated,
            // Zarządzanie klientami
            clients,
            addClient,
            updateClient,
            deleteClient,
            getClient,
            getClientsByTrainer,
            // Zarządzanie postępami
            addMeasurement,
            getMeasurements,
            // Zarządzanie planami
            addWorkoutPlan,
            addNutritionPlan,
            getActiveWorkoutPlan,
            getActiveNutritionPlan
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
