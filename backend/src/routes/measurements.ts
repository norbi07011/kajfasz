import express, { Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import type { MeasurementRecord, ClientData, ApiResponse } from '../types/index.js';

const router = express.Router();

// Mock measurements database (in real app this would be database calls)
const mockMeasurements: MeasurementRecord[] = [
  {
    id: uuidv4(),
    date: '2025-01-01',
    weight: 85.5,
    bodyFat: 20.2,
    chest: 95,
    waist: 85,
    hips: 90,
    bicep: 32,
    thigh: 55,
    notes: 'Initial measurements - feeling motivated!'
  },
  {
    id: uuidv4(),
    date: '2025-01-15',
    weight: 84.2,
    bodyFat: 19.8,
    chest: 95.5,
    waist: 84,
    hips: 89.5,
    bicep: 32.5,
    thigh: 55.2,
    notes: 'Great progress after 2 weeks!'
  }
];

// Validation schemas
const createMeasurementSchema = z.object({
  clientId: z.string().uuid(),
  date: z.string(),
  weight: z.number().positive().optional(),
  bodyFat: z.number().min(0).max(100).optional(),
  chest: z.number().positive().optional(),
  waist: z.number().positive().optional(),
  hips: z.number().positive().optional(),
  bicep: z.number().positive().optional(),
  thigh: z.number().positive().optional(),
  photos: z.object({
    front: z.string().optional(),
    side: z.string().optional(),
    back: z.string().optional()
  }).optional(),
  notes: z.string().optional()
});

const updateMeasurementSchema = createMeasurementSchema.partial();

// GET /api/measurements - List measurements (optionally filtered by client)
router.get('/', (req: Request, res: Response) => {
  const { clientId, startDate, endDate, limit } = req.query;
  
  console.log(`📊 GET /api/measurements - Retrieving measurements`, { clientId, startDate, endDate, limit });
  
  let filteredMeasurements = [...mockMeasurements];
  
  // Filter by clientId if provided
  if (clientId && typeof clientId === 'string') {
    filteredMeasurements = filteredMeasurements.filter(m => 
      (m as any).clientId === clientId
    );
  }
  
  // Filter by date range if provided
  if (startDate && typeof startDate === 'string') {
    filteredMeasurements = filteredMeasurements.filter(m => 
      new Date(m.date) >= new Date(startDate)
    );
  }
  
  if (endDate && typeof endDate === 'string') {
    filteredMeasurements = filteredMeasurements.filter(m => 
      new Date(m.date) <= new Date(endDate)
    );
  }
  
  // Sort by date (newest first)
  filteredMeasurements.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Apply limit if provided
  if (limit && typeof limit === 'string') {
    const limitNum = parseInt(limit, 10);
    if (!isNaN(limitNum) && limitNum > 0) {
      filteredMeasurements = filteredMeasurements.slice(0, limitNum);
    }
  }
  
  const response: ApiResponse<MeasurementRecord[]> = {
    success: true,
    data: filteredMeasurements,
    message: `Retrieved ${filteredMeasurements.length} measurements`
  };
  
  res.json(response);
  console.log(`✅ Returned ${filteredMeasurements.length} measurements`);
});

// GET /api/measurements/:id - Get specific measurement
router.get('/:id', (req: Request, res: Response) => {
  console.log(`📊 GET /api/measurements/${req.params.id} - Getting measurement details`);
  
  const measurement = mockMeasurements.find(m => m.id === req.params.id);
  
  if (!measurement) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: 'Measurement not found'
    };
    res.status(404).json(response);
    console.log('❌ Measurement not found');
    return;
  }
  
  const response: ApiResponse<MeasurementRecord> = {
    success: true,
    data: measurement,
    message: 'Measurement retrieved successfully'
  };
  
  res.json(response);
  console.log('✅ Measurement details sent');
});

// POST /api/measurements - Create new measurement
router.post('/', (req: Request, res: Response) => {
  console.log('📊 POST /api/measurements - Creating new measurement');
  
  try {
    const validatedData = createMeasurementSchema.parse(req.body);
    
    const newMeasurement: MeasurementRecord = {
      id: uuidv4(),
      date: validatedData.date,
      weight: validatedData.weight,
      bodyFat: validatedData.bodyFat,
      chest: validatedData.chest,
      waist: validatedData.waist,
      hips: validatedData.hips,
      bicep: validatedData.bicep,
      thigh: validatedData.thigh,
      photos: validatedData.photos,
      notes: validatedData.notes
    } as MeasurementRecord;
    
    mockMeasurements.push(newMeasurement);
    
    const response: ApiResponse<MeasurementRecord> = {
      success: true,
      data: newMeasurement,
      message: 'Measurement created successfully'
    };
    
    res.status(201).json(response);
    console.log(`✅ Measurement created with ID: ${newMeasurement.id}`);
    
  } catch (error) {
    console.error('❌ Measurement creation error:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof z.ZodError ? 'Invalid measurement data' : 'Failed to create measurement'
    };
    
    res.status(400).json(response);
  }
});

// PUT /api/measurements/:id - Update existing measurement
router.put('/:id', (req: Request, res: Response) => {
  console.log(`📊 PUT /api/measurements/${req.params.id} - Updating measurement`);
  
  const measurementIndex = mockMeasurements.findIndex(m => m.id === req.params.id);
  
  if (measurementIndex === -1) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: 'Measurement not found'
    };
    res.status(404).json(response);
    console.log('❌ Measurement not found for update');
    return;
  }
  
  try {
    const validatedData = updateMeasurementSchema.parse(req.body);
    
    const currentMeasurement = mockMeasurements[measurementIndex]!;
    
    const updatedMeasurement: MeasurementRecord = {
      ...currentMeasurement,
      ...validatedData,
      photos: validatedData.photos 
        ? { ...currentMeasurement.photos, ...validatedData.photos } as MeasurementRecord['photos']
        : currentMeasurement.photos
    } as MeasurementRecord;
    
    mockMeasurements[measurementIndex] = updatedMeasurement;
    
    const response: ApiResponse<MeasurementRecord> = {
      success: true,
      data: updatedMeasurement,
      message: 'Measurement updated successfully'
    };
    
    res.json(response);
    console.log(`✅ Measurement ${req.params.id} updated successfully`);
    
  } catch (error) {
    console.error('❌ Measurement update error:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof z.ZodError ? 'Invalid measurement data' : 'Failed to update measurement'
    };
    
    res.status(400).json(response);
  }
});

// DELETE /api/measurements/:id - Delete measurement
router.delete('/:id', (req: Request, res: Response) => {
  console.log(`📊 DELETE /api/measurements/${req.params.id} - Deleting measurement`);
  
  const measurementIndex = mockMeasurements.findIndex(m => m.id === req.params.id);
  
  if (measurementIndex === -1) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: 'Measurement not found'
    };
    res.status(404).json(response);
    console.log('❌ Measurement not found for deletion');
    return;
  }
  
  const deletedMeasurement = mockMeasurements.splice(measurementIndex, 1)[0]!;
  
  const response: ApiResponse<MeasurementRecord> = {
    success: true,
    data: deletedMeasurement,
    message: 'Measurement deleted successfully'
  };
  
  res.json(response);
  console.log(`✅ Measurement ${req.params.id} deleted successfully`);
});

// GET /api/measurements/analytics/progress - Get measurement analytics/progress
router.get('/analytics/progress', (req: Request, res: Response) => {
  const { clientId, metric } = req.query;
  
  console.log(`📊 GET /api/measurements/analytics/progress - Getting progress analytics`, { clientId, metric });
  
  let measurements = [...mockMeasurements];
  
  // Filter by clientId if provided
  if (clientId && typeof clientId === 'string') {
    measurements = measurements.filter((m: any) => m.clientId === clientId);
  }
  
  // Sort by date
  measurements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let analytics: any = {
    totalMeasurements: measurements.length,
    dateRange: {
      start: measurements.length > 0 ? measurements[0]!.date : null,
      end: measurements.length > 0 ? measurements[measurements.length - 1]!.date : null
    },
    trends: {}
  };
  
  // Calculate trends for numeric metrics
  const numericMetrics = ['weight', 'bodyFat', 'chest', 'waist', 'hips', 'bicep', 'thigh'];
  
  for (const metricName of numericMetrics) {
    const values = measurements
      .map(m => (m as any)[metricName])
      .filter(v => v !== undefined && v !== null);
      
    if (values.length >= 2) {
      const change = values[values.length - 1] - values[0];
      const percentageChange = (change / values[0]) * 100;
      
      analytics.trends[metricName] = {
        start: values[0],
        current: values[values.length - 1],
        change,
        percentageChange: Math.round(percentageChange * 100) / 100,
        direction: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'stable'
      };
    }
  }
  
  const response: ApiResponse<any> = {
    success: true,
    data: analytics,
    message: 'Progress analytics retrieved successfully'
  };
  
  res.json(response);
  console.log('✅ Progress analytics sent');
});

export default router;