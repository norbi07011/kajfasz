import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: ApiError | ZodError | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('🚨 Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
    return;
  }

  // Custom API errors
  if (error.isOperational && error.statusCode) {
    res.status(error.statusCode).json({
      error: error.message
    });
    return;
  }

  // Fallback for unknown errors
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
};

export const createApiError = (message: string, statusCode: number = 500): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};