import express, { Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import type { WorkoutPlan, NutritionPlan, Exercise, ApiResponse } from '../types/index.js';

const router = express.Router();

// Mock workout plans database
const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: uuidv4(),
    clientId: 'client-1',
    trainerId: 'trainer-1',
    name: 'Beginner Strength Building',
    description: 'A comprehensive strength building program for beginners',
    duration: 12,
    sessionsPerWeek: 3,
    exercises: [
      {
        id: uuidv4(),
        name: 'Squats',
        sets: 3,
        reps: '8-12',
        weight: 50,
        restTime: 90,
        notes: 'Focus on proper form'
      },
      {
        id: uuidv4(),
        name: 'Push-ups',
        sets: 3,
        reps: 10,
        restTime: 60,
        notes: 'Modify on knees if needed'
      }
    ],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }
];

// Mock nutrition plans database
const mockNutritionPlans: NutritionPlan[] = [
  {
    id: uuidv4(),
    clientId: 'client-1',
    trainerId: 'trainer-1',
    dailyCalories: 2200,
    macros: {
      protein: 150,
      carbs: 220,
      fats: 85
    },
    meals: [
      {
        id: uuidv4(),
        name: 'Breakfast',
        time: '08:00',
        calories: 320,
        ingredients: [
          {
            id: uuidv4(),
            name: 'Oatmeal',
            amount: 80,
            unit: 'g',
            calories: 320,
            protein: 12,
            carbs: 55,
            fats: 6
          }
        ]
      }
    ],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }
];

// Validation schemas
const exerciseSchema = z.object({
  name: z.string().min(1),
  sets: z.number().min(1),
  reps: z.union([z.number().min(1), z.string()]),
  weight: z.number().positive().optional(),
  restTime: z.number().positive().optional(),
  notes: z.string().optional()
});

const createWorkoutPlanSchema = z.object({
  clientId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().min(1),
  sessionsPerWeek: z.number().min(1).max(7),
  exercises: z.array(exerciseSchema),
  notes: z.string().optional(),
  isActive: z.boolean().default(true)
});

const updateWorkoutPlanSchema = createWorkoutPlanSchema.partial();

const ingredientSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  unit: z.string().min(1),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fats: z.number().min(0)
});

const mealSchema = z.object({
  name: z.string().min(1),
  time: z.string(),
  calories: z.number().min(0),
  ingredients: z.array(ingredientSchema)
});

const createNutritionPlanSchema = z.object({
  clientId: z.string().uuid(),
  dailyCalories: z.number().positive(),
  macros: z.object({
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fats: z.number().min(0)
  }),
  meals: z.array(mealSchema),
  isActive: z.boolean().default(true)
});

const updateNutritionPlanSchema = createNutritionPlanSchema.partial();

// WORKOUT PLANS ROUTES

// GET /api/plans/workouts - List workout plans
router.get('/workouts', (req: Request, res: Response) => {
  const { clientId, isActive } = req.query;
  
  console.log(`🏋️ GET /api/plans/workouts - Retrieving workout plans`, { clientId, isActive });
  
  let filteredPlans = [...mockWorkoutPlans];
  
  if (clientId && typeof clientId === 'string') {
    filteredPlans = filteredPlans.filter(p => p.clientId === clientId);
  }
  
  if (isActive !== undefined) {
    const activeFilter = isActive === 'true';
    filteredPlans = filteredPlans.filter(p => p.isActive === activeFilter);
  }
  
  const response: ApiResponse<WorkoutPlan[]> = {
    success: true,
    data: filteredPlans,
    message: `Retrieved ${filteredPlans.length} workout plans`
  };
  
  res.json(response);
  console.log(`✅ Returned ${filteredPlans.length} workout plans`);
});

// GET /api/plans/workouts/:id - Get specific workout plan
router.get('/workouts/:id', (req: Request, res: Response) => {
  console.log(`🏋️ GET /api/plans/workouts/${req.params.id} - Getting workout plan details`);
  
  const workoutPlan = mockWorkoutPlans.find(p => p.id === req.params.id);
  
  if (!workoutPlan) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: 'Workout plan not found'
    };
    res.status(404).json(response);
    console.log('❌ Workout plan not found');
    return;
  }
  
  const response: ApiResponse<WorkoutPlan> = {
    success: true,
    data: workoutPlan,
    message: 'Workout plan retrieved successfully'
  };
  
  res.json(response);
  console.log('✅ Workout plan details sent');
});

// POST /api/plans/workouts - Create new workout plan
router.post('/workouts', (req: Request, res: Response) => {
  console.log('🏋️ POST /api/plans/workouts - Creating new workout plan');
  
  try {
    const validatedData = createWorkoutPlanSchema.parse(req.body);
    
    const newWorkoutPlan: WorkoutPlan = {
      id: uuidv4(),
      trainerId: 'trainer-1', // Mock trainer ID
      ...validatedData,
      exercises: validatedData.exercises.map(exercise => ({
        id: uuidv4(),
        ...exercise
      } as Exercise)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as WorkoutPlan;
    
    mockWorkoutPlans.push(newWorkoutPlan);
    
    const response: ApiResponse<WorkoutPlan> = {
      success: true,
      data: newWorkoutPlan,
      message: 'Workout plan created successfully'
    };
    
    res.status(201).json(response);
    console.log(`✅ Workout plan created with ID: ${newWorkoutPlan.id}`);
    
  } catch (error) {
    console.error('❌ Workout plan creation error:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof z.ZodError ? 'Invalid workout plan data' : 'Failed to create workout plan'
    };
    
    res.status(400).json(response);
  }
});

// PUT /api/plans/workouts/:id - Update workout plan
router.put('/workouts/:id', (req: Request, res: Response) => {
  console.log(`🏋️ PUT /api/plans/workouts/${req.params.id} - Updating workout plan`);
  
  const planIndex = mockWorkoutPlans.findIndex(p => p.id === req.params.id);
  
  if (planIndex === -1) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: 'Workout plan not found'
    };
    res.status(404).json(response);
    console.log('❌ Workout plan not found for update');
    return;
  }
  
  try {
    const validatedData = updateWorkoutPlanSchema.parse(req.body);
    
    const currentPlan = mockWorkoutPlans[planIndex]!;
    
    const updatedPlan: WorkoutPlan = {
      ...currentPlan,
      ...validatedData,
      exercises: validatedData.exercises 
        ? validatedData.exercises.map(exercise => ({
            id: uuidv4(),
            ...exercise
          } as Exercise))
        : currentPlan.exercises,
      updatedAt: new Date().toISOString()
    } as WorkoutPlan;
    
    mockWorkoutPlans[planIndex] = updatedPlan;
    
    const response: ApiResponse<WorkoutPlan> = {
      success: true,
      data: updatedPlan,
      message: 'Workout plan updated successfully'
    };
    
    res.json(response);
    console.log(`✅ Workout plan ${req.params.id} updated successfully`);
    
  } catch (error) {
    console.error('❌ Workout plan update error:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof z.ZodError ? 'Invalid workout plan data' : 'Failed to update workout plan'
    };
    
    res.status(400).json(response);
  }
});

// DELETE /api/plans/workouts/:id - Delete workout plan
router.delete('/workouts/:id', (req: Request, res: Response) => {
  console.log(`🏋️ DELETE /api/plans/workouts/${req.params.id} - Deleting workout plan`);
  
  const planIndex = mockWorkoutPlans.findIndex(p => p.id === req.params.id);
  
  if (planIndex === -1) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: 'Workout plan not found'
    };
    res.status(404).json(response);
    console.log('❌ Workout plan not found for deletion');
    return;
  }
  
  const deletedPlan = mockWorkoutPlans.splice(planIndex, 1)[0]!;
  
  const response: ApiResponse<WorkoutPlan> = {
    success: true,
    data: deletedPlan,
    message: 'Workout plan deleted successfully'
  };
  
  res.json(response);
  console.log(`✅ Workout plan ${req.params.id} deleted successfully`);
});

// NUTRITION PLANS ROUTES

// GET /api/plans/nutrition - List nutrition plans
router.get('/nutrition', (req: Request, res: Response) => {
  const { clientId, isActive } = req.query;
  
  console.log(`🥗 GET /api/plans/nutrition - Retrieving nutrition plans`, { clientId, isActive });
  
  let filteredPlans = [...mockNutritionPlans];
  
  if (clientId && typeof clientId === 'string') {
    filteredPlans = filteredPlans.filter(p => p.clientId === clientId);
  }
  
  if (isActive !== undefined) {
    const activeFilter = isActive === 'true';
    filteredPlans = filteredPlans.filter(p => p.isActive === activeFilter);
  }
  
  const response: ApiResponse<NutritionPlan[]> = {
    success: true,
    data: filteredPlans,
    message: `Retrieved ${filteredPlans.length} nutrition plans`
  };
  
  res.json(response);
  console.log(`✅ Returned ${filteredPlans.length} nutrition plans`);
});

// GET /api/plans/nutrition/:id - Get specific nutrition plan
router.get('/nutrition/:id', (req: Request, res: Response) => {
  console.log(`🥗 GET /api/plans/nutrition/${req.params.id} - Getting nutrition plan details`);
  
  const nutritionPlan = mockNutritionPlans.find(p => p.id === req.params.id);
  
  if (!nutritionPlan) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: 'Nutrition plan not found'
    };
    res.status(404).json(response);
    console.log('❌ Nutrition plan not found');
    return;
  }
  
  const response: ApiResponse<NutritionPlan> = {
    success: true,
    data: nutritionPlan,
    message: 'Nutrition plan retrieved successfully'
  };
  
  res.json(response);
  console.log('✅ Nutrition plan details sent');
});

// POST /api/plans/nutrition - Create new nutrition plan
router.post('/nutrition', (req: Request, res: Response) => {
  console.log('🥗 POST /api/plans/nutrition - Creating new nutrition plan');
  
  try {
    const validatedData = createNutritionPlanSchema.parse(req.body);
    
    const newNutritionPlan: NutritionPlan = {
      id: uuidv4(),
      trainerId: 'trainer-1', // Mock trainer ID
      ...validatedData,
      meals: validatedData.meals.map(meal => ({
        id: uuidv4(),
        ...meal,
        ingredients: meal.ingredients.map(ingredient => ({
          id: uuidv4(),
          ...ingredient
        }))
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as NutritionPlan;
    
    mockNutritionPlans.push(newNutritionPlan);
    
    const response: ApiResponse<NutritionPlan> = {
      success: true,
      data: newNutritionPlan,
      message: 'Nutrition plan created successfully'
    };
    
    res.status(201).json(response);
    console.log(`✅ Nutrition plan created with ID: ${newNutritionPlan.id}`);
    
  } catch (error) {
    console.error('❌ Nutrition plan creation error:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof z.ZodError ? 'Invalid nutrition plan data' : 'Failed to create nutrition plan'
    };
    
    res.status(400).json(response);
  }
});

// PUT /api/plans/nutrition/:id - Update nutrition plan
router.put('/nutrition/:id', (req: Request, res: Response) => {
  console.log(`🥗 PUT /api/plans/nutrition/${req.params.id} - Updating nutrition plan`);
  
  const planIndex = mockNutritionPlans.findIndex(p => p.id === req.params.id);
  
  if (planIndex === -1) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: 'Nutrition plan not found'
    };
    res.status(404).json(response);
    console.log('❌ Nutrition plan not found for update');
    return;
  }
  
  try {
    const validatedData = updateNutritionPlanSchema.parse(req.body);
    
    const currentPlan = mockNutritionPlans[planIndex]!;
    
    const updatedPlan: NutritionPlan = {
      ...currentPlan,
      ...validatedData,
      meals: validatedData.meals 
        ? validatedData.meals.map(meal => ({
            id: uuidv4(),
            ...meal,
            ingredients: meal.ingredients.map(ingredient => ({
              id: uuidv4(),
              ...ingredient
            }))
          }))
        : currentPlan.meals,
      updatedAt: new Date().toISOString()
    } as NutritionPlan;
    
    mockNutritionPlans[planIndex] = updatedPlan;
    
    const response: ApiResponse<NutritionPlan> = {
      success: true,
      data: updatedPlan,
      message: 'Nutrition plan updated successfully'
    };
    
    res.json(response);
    console.log(`✅ Nutrition plan ${req.params.id} updated successfully`);
    
  } catch (error) {
    console.error('❌ Nutrition plan update error:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof z.ZodError ? 'Invalid nutrition plan data' : 'Failed to update nutrition plan'
    };
    
    res.status(400).json(response);
  }
});

// DELETE /api/plans/nutrition/:id - Delete nutrition plan
router.delete('/nutrition/:id', (req: Request, res: Response) => {
  console.log(`🥗 DELETE /api/plans/nutrition/${req.params.id} - Deleting nutrition plan`);
  
  const planIndex = mockNutritionPlans.findIndex(p => p.id === req.params.id);
  
  if (planIndex === -1) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: 'Nutrition plan not found'
    };
    res.status(404).json(response);
    console.log('❌ Nutrition plan not found for deletion');
    return;
  }
  
  const deletedPlan = mockNutritionPlans.splice(planIndex, 1)[0]!;
  
  const response: ApiResponse<NutritionPlan> = {
    success: true,
    data: deletedPlan,
    message: 'Nutrition plan deleted successfully'
  };
  
  res.json(response);
  console.log(`✅ Nutrition plan ${req.params.id} deleted successfully`);
});

export default router;