/**
 * API Types - Frontend definitions matching backend API contracts
 */

// Response wrapper from backend
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  trainer: TrainerData;
}

export interface TrainerData {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastLogin?: string;
}

// Client types
export interface ClientPersonalInfo {
  firstName: string;
  lastName: string;
  email?: string;
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
  primary: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'general_fitness';
  targetWeight?: number;
  targetDate?: string;
  motivations?: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  availableTime: number; // sessions per week
  preferredActivities?: string[];
}

export interface ClientData {
  id: string;
  trainerId: string;
  personalInfo: ClientPersonalInfo;
  goals: ClientGoals;
  measurements: MeasurementRecord[];
  status: 'active' | 'inactive' | 'paused';
  joinDate: string;
  lastActivity?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Measurement types
export interface MeasurementRecord {
  id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  bicep?: number;
  thigh?: number;
  photos?: {
    front?: string;
    side?: string;
    back?: string;
  };
  notes?: string;
}

// Workout Plan types
export interface WorkoutPlan {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'functional';
  equipment?: string[];
  instructions: string;
  sets?: number;
  reps?: number;
  duration?: number; // seconds
  restTime?: number; // seconds
  weight?: number;
  notes?: string;
}

// Nutrition Plan types
export interface NutritionPlan {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  dailyCalories: number;
  macros: MacroTargets;
  meals: Meal[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MacroTargets {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Food[];
  totalCalories: number;
  macros: MacroTargets;
}

export interface Food {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// API Error types
export interface ApiErrorData {
  error: string;
  message?: string;
  statusCode?: number;
  details?: any;
}