import { ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: 'VALIDATION_ERROR',
      fields: err.flatten().fieldErrors
    });
  }

  // Known operational errors
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({
      error: err.code,
      message: err.message
    });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
}
