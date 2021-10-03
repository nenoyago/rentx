import { Request, Response, NextFunction } from 'express';

import { AppError } from '@shared/errors/AppError';
import { verifyToken } from '@utils/generateAndVerifyToken';

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: user_id } = verifyToken(token, 'token');

    request.user = {
      id: user_id,
    };

    return next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}
