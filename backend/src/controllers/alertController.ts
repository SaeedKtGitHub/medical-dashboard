import { Request, Response } from 'express';
import { getLatestAlerts } from '../services/alertService';
import { asyncHandler } from '../utils/asyncHandler';

export const alertController = {
  getLatest: asyncHandler(async (_req: Request, res: Response) => {
    const alerts = await getLatestAlerts();
    res.json({ success: true, data: alerts });
  }),
};
