// Tymczasowe typy API - kompatybilne z frontend
export interface TrainerData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

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
    relation: string;
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

export interface WorkoutPlan {
  id: string;
  clientId: string;
  trainerId: string;
  name: string;
  description?: string;
  duration: number; // weeks
  sessionsPerWeek: number;
  exercises: Exercise[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number | string; // can be "12-15" or number
  weight?: number;
  restTime?: number; // seconds
  notes?: string;
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
  meals: Meal[];
  restrictions?: string[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string; // "08:00"
  calories: number;
  ingredients: Ingredient[];
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string; // "g", "ml", "piece"
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  trainer: TrainerData;
  expiresIn: string;
}

export interface CreateClientRequest {
  personalInfo: ClientPersonalInfo;
  goals: ClientGoals;
  notes?: string;
}

export interface UpdateClientRequest {
  personalInfo?: Partial<ClientPersonalInfo>;
  goals?: Partial<ClientGoals>;
  notes?: string;
  status?: 'active' | 'inactive' | 'paused';
}

export interface AddMeasurementRequest {
  date?: string;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  bicep?: number;
  thigh?: number;
  notes?: string;
}