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
}

interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string) => boolean;
    register: (name: string, email: string, password: string, goals: UserGoals) => boolean;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        try {
            const loggedInUserEmail = localStorage.getItem('loggedInUser');
            if (loggedInUserEmail) {
                const userData = localStorage.getItem(`user_${loggedInUserEmail}`);
                if (userData) {
                    setCurrentUser(JSON.parse(userData));
                }
            }
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
        }
    }, []);

    const login = (email: string, password: string): boolean => {
        try {
            const accountData = localStorage.getItem(`account_${email}`);
            if (!accountData) return false;

            const userAccount = JSON.parse(accountData);
            if (userAccount.password !== password) return false;
            
            const userData = localStorage.getItem(`user_${email}`);
            if (!userData) return false;

            setCurrentUser(JSON.parse(userData));
            localStorage.setItem('loggedInUser', email);
            return true;
        } catch (error) {
            console.error("Login failed", error);
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

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout, updateUser }}>
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
