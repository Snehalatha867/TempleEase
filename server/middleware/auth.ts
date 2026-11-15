import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dataStore } from '../data/store.js';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set to at least 32 characters.');
  }
  return secret;
};

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
    name: string;
  };
}

export const generateToken = (user: { _id: string; email: string; role: string; name: string }) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to continue.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret()) as {
      id: string;
      email: string;
      role: 'USER' | 'ADMIN';
      name: string;
    };

    const user = await dataStore.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session no longer valid. Please log in again.'
      });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.'
    });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrative privileges required.'
      });
    }
    next();
  });
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, getJwtSecret()) as {
        id: string;
        email: string;
        role: 'USER' | 'ADMIN';
        name: string;
      };
      const user = await dataStore.findUserById(decoded.id);
      if (user) {
        req.user = {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name
        };
      }
    }
  } catch {
    // optional token, ignore error
  }
  next();
};
