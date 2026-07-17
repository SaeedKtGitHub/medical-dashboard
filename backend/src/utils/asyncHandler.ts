import { NextFunction, Request, Response } from 'express';
import { isAppError } from '../utils/errors';
import { logger } from '../utils/logger';

export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (isAppError(error)) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
    return;
  }

  logger.error('Unhandled error', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
}
