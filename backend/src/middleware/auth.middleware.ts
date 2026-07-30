import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.shopilot_token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token is required.' });
  }

  const secret = process.env.JWT_ACCESS_SECRET || 'shopilot_super_secret_access_token_key_2026';

  jwt.verify(token, secret, (err: any, user: any) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
    }
    req.user = user;
    next();
  });
};
