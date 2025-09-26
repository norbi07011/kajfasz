import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TrainerData } from '../types/index.js';

// Tymczasowy mock trener - w produkcji będzie z bazy danych
const mockTrainer: TrainerData = {
  id: 'trainer-1',
  name: 'Kajfasz Trainer',
  email: 'trener@kajfasz.com',
  role: 'trainer',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export interface AuthenticatedRequest extends Request {
  trainer?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ error: 'JWT secret not configured' });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      name: string;
    };

    // Verify trainer - tymczasowo mock, później z bazy
    if (decoded.id !== mockTrainer.id) {
      res.status(401).json({ error: 'Trainer not found' });
      return;
    }

    req.trainer = {
      id: mockTrainer.id,
      email: mockTrainer.email,
      name: mockTrainer.name
    };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};