import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { TrainerData, LoginRequest, LoginResponse, ApiResponse } from '../types/index.js';

const router = express.Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Mock trainer data - w produkcji z bazy danych
const mockTrainer: TrainerData = {
  id: 'trainer-1',
  name: 'Kajfasz Trainer',
  email: 'trener@kajfasz.com',
  role: 'trainer',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Zahashowane hasło "trener123" 
const hashedPassword = '$2a$12$7KNPR4gZBa3z.gE5v8w1jeKkl8A8hEwZjhMQHQhN1d1BO5aZGG8yK';

/**
 * POST /api/auth/login
 * Logowanie trenera
 */
router.post('/login', async (req, res): Promise<void> => {
  try {
    // Walidacja danych wejściowych
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        message: result.error.errors.map(err => err.message).join(', ')
      };
      res.status(400).json(response);
      return;
    }

    const { email, password }: LoginRequest = result.data;

    // Sprawdź czy trener istnieje
    if (email !== mockTrainer.email) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid credentials',
        message: 'Email lub hasło jest nieprawidłowe'
      };
      res.status(401).json(response);
      return;
    }

    // Sprawdź hasło
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid credentials',
        message: 'Email lub hasło jest nieprawidłowe'
      };
      res.status(401).json(response);
      return;
    }

    // Generuj JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      const response: ApiResponse = {
        success: false,
        error: 'Server configuration error'
      };
      res.status(500).json(response);
      return;
    }

    const tokenPayload = { 
      id: mockTrainer.id, 
      email: mockTrainer.email, 
      name: mockTrainer.name 
    };
    
    const token = jwt.sign(
      tokenPayload,
      jwtSecret as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );

    const loginResponse: LoginResponse = {
      token,
      trainer: mockTrainer,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };

    const response: ApiResponse<LoginResponse> = {
      success: true,
      data: loginResponse,
      message: 'Zalogowano pomyślnie'
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

/**
 * POST /api/auth/verify
 * Weryfikacja tokenu JWT
 */
router.post('/verify', (req, res): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      const response: ApiResponse = {
        success: false,
        error: 'Token required',
        message: 'Brak tokenu autoryzacji'
      };
      res.status(401).json(response);
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      const response: ApiResponse = {
        success: false,
        error: 'Server configuration error'
      };
      res.status(500).json(response);
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      name: string;
    };

    // Sprawdź czy trener istnieje
    if (decoded.id !== mockTrainer.id) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid token',
        message: 'Token jest nieprawidłowy'
      };
      res.status(401).json(response);
      return;
    }

    const response: ApiResponse<TrainerData> = {
      success: true,
      data: mockTrainer,
      message: 'Token jest prawidłowy'
    };

    res.json(response);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid token',
        message: 'Token jest nieprawidłowy lub wygasł'
      };
      res.status(403).json(response);
      return;
    }

    console.error('Token verification error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

/**
 * GET /api/auth/profile
 * Pobranie profilu zalogowanego trenera
 */
router.get('/profile', (req, res) => {
  try {
    // Tutaj normalnie używalibyśmy middleware authenticateToken
    // ale dla uproszczenia zwrócimy mock data
    const response: ApiResponse<TrainerData> = {
      success: true,
      data: mockTrainer,
      message: 'Profil trenera'
    };

    res.json(response);
  } catch (error) {
    console.error('Profile error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

export default router;