import { Router } from 'express';
import { ambulanceController } from '../controllers/ambulanceController';

const router = Router();

router.get('/', ambulanceController.getAll);
router.get('/:id/nearest-hospitals', ambulanceController.getNearestHospitals);

export default router;
