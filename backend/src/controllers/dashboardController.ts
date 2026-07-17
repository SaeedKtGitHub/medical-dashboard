import { Request, Response } from 'express';
import { getDashboardStats } from '../services/dashboardService';
import { asyncHandler } from '../utils/asyncHandler';

export const dashboardController = {
  getStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await getDashboardStats();
    res.json({ success: true, data: stats });
  }),
};
