import { Request, Response } from 'express';
import { getAllAmbulances } from '../services/ambulanceService';
import { getNearestHospitalsForAmbulance } from '../services/nearestHospitalService';
import { asyncHandler } from '../utils/asyncHandler';

export const ambulanceController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const ambulances = await getAllAmbulances();
    res.json({ success: true, data: ambulances });
  }),

  getNearestHospitals: asyncHandler(async (req: Request, res: Response) => {
    const nearest = await getNearestHospitalsForAmbulance(req.params.id);
    res.json({ success: true, data: nearest });
  }),
};
