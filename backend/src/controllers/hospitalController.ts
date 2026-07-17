import { Request, Response } from 'express';
import { getAllHospitals } from '../services/hospitalService';
import { parseHospitalFilters } from '../services/hospitalFilterService';
import { asyncHandler } from '../utils/asyncHandler';

export const hospitalController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const filters = parseHospitalFilters(req.query as Record<string, unknown>);
    const hospitals = await getAllHospitals(filters);
    res.json({ success: true, data: hospitals });
  }),
};
