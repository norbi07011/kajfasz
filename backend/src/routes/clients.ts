import express, { Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import type { ClientData, ClientGoals, ApiResponse } from '../types/index.js';

const router = express.Router();

// Mock clients database
const mockClients: ClientData[] = [
  {
    id: uuidv4(),
    trainerId: 'trainer-1',
    personalInfo: {
      firstName: 'Jan',
      lastName: 'Kowalski',
      email: 'jan.kowalski@example.com',
      phone: '123-456-789',
      dateOfBirth: '1990-01-15',
      gender: 'male',
      height: 180,
      medicalConditions: []
    },
    goals: {
      primary: 'weight_loss',
      targetWeight: 75,
      targetDate: '2025-06-01',
      experience: 'beginner',
      availableTime: 3,
      motivations: ['Better health', 'More energy']
    },
    measurements: [
      {
        id: uuidv4(),
        date: '2025-01-01',
        weight: 85,
        bodyFat: 20,
        chest: 95,
        waist: 85,
        hips: 90,
        bicep: 32,
        thigh: 55,
        notes: 'Initial measurements'
      }
    ],
    status: 'active',
    joinDate: '2025-01-01',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }
];

// Validation schemas
const createClientSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    dateOfBirth: z.string(),
    gender: z.enum(['male', 'female', 'other']),
    address: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      postalCode: z.string().min(1),
      country: z.string().min(1)
    })
  }),
  goals: z.object({
    primary: z.enum(['weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness']),
    targetWeight: z.number().optional(),
    targetDate: z.string().optional(),
    motivations: z.array(z.string()).optional(),
    experience: z.enum(['beginner', 'intermediate', 'advanced']),
    availableTime: z.number().positive(),
    preferredActivities: z.array(z.string()).optional()
  })
});

const updateClientSchema = createClientSchema.partial();

// GET /api/clients - List all clients
router.get('/', (req: Request, res: Response) => {
  console.log('📋 GET /api/clients - Listing all clients');
  
  const response: ApiResponse<ClientData[]> = {
    success: true,
    data: mockClients,
    message: `Found ${mockClients.length} clients`
  };
  
  res.json(response);
  console.log(`✅ Returned ${mockClients.length} clients`);
});

// GET /api/clients/:id - Get specific client
router.get('/:id', (req: Request, res: Response) => {
  console.log(`📋 GET /api/clients/${req.params.id} - Getting client details`);
  
  const client: ClientData | undefined = mockClients.find(c => c.id === req.params.id);
  
  if (!client) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: 'Client not found'
    };
    res.status(404).json(response);
    console.log('❌ Client not found');
    return;
  }
  
  const response: ApiResponse<ClientData> = {
    success: true,
    data: client,
    message: 'Client retrieved successfully'
  };
  
  res.json(response);
  console.log('✅ Client details sent');
});

// POST /api/clients - Create new client
router.post('/', (req: Request, res: Response) => {
  console.log('📋 POST /api/clients - Creating new client');
  
  try {
    const validatedData = createClientSchema.parse(req.body);
    
    const newClient: ClientData = {
      id: uuidv4(),
      trainerId: 'trainer-1', // Mock trainer ID
      personalInfo: validatedData.personalInfo,
      goals: validatedData.goals as ClientGoals,
      measurements: [],
      status: 'active',
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockClients.push(newClient);
    
    const response: ApiResponse<ClientData> = {
      success: true,
      data: newClient,
      message: 'Client created successfully'
    };
    
    res.status(201).json(response);
    console.log(`✅ Client created with ID: ${newClient.id}`);
    
  } catch (error) {
    console.error('❌ Client creation error:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof z.ZodError ? 'Invalid client data' : 'Failed to create client'
    };
    
    res.status(400).json(response);
  }
});

// PUT /api/clients/:id - Update existing client
router.put('/:id', (req: Request, res: Response) => {
  console.log(`📋 PUT /api/clients/${req.params.id} - Updating client`);
  
  const clientIndex = mockClients.findIndex(c => c.id === req.params.id);
  
  if (clientIndex === -1) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: 'Client not found'
    };
    res.status(404).json(response);
    console.log('❌ Client not found for update');
    return;
  }
  
  try {
    const validatedData = updateClientSchema.parse(req.body);
    
    const currentClient = mockClients[clientIndex]!; // Non-null assertion since we already checked the index
    
    const updatedClient: ClientData = {
      ...currentClient,
      ...validatedData,
      personalInfo: validatedData.personalInfo 
        ? { ...currentClient.personalInfo, ...validatedData.personalInfo }
        : currentClient.personalInfo,
      goals: validatedData.goals 
        ? { ...currentClient.goals, ...validatedData.goals } as ClientGoals
        : currentClient.goals,
      updatedAt: new Date().toISOString()
    };
    
    mockClients[clientIndex] = updatedClient;
    
    const response: ApiResponse<ClientData> = {
      success: true,
      data: updatedClient,
      message: 'Client updated successfully'
    };
    
    res.json(response);
    console.log(`✅ Client ${req.params.id} updated successfully`);
    
  } catch (error) {
    console.error('❌ Client update error:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof z.ZodError ? 'Invalid client data' : 'Failed to update client'
    };
    
    res.status(400).json(response);
  }
});

// DELETE /api/clients/:id - Delete client
router.delete('/:id', (req: Request, res: Response) => {
  console.log(`📋 DELETE /api/clients/${req.params.id} - Deleting client`);
  
  const clientIndex = mockClients.findIndex(c => c.id === req.params.id);
  
  if (clientIndex === -1) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: 'Client not found'
    };
    res.status(404).json(response);
    console.log('❌ Client not found for deletion');
    return;
  }
  
  const deletedClient = mockClients.splice(clientIndex, 1)[0]!; // Non-null assertion since we already checked the index
  
  const response: ApiResponse<ClientData> = {
    success: true,
    data: deletedClient,
    message: 'Client deleted successfully'
  };
  
  res.json(response);
  console.log(`✅ Client ${req.params.id} deleted successfully`);
});

export default router;