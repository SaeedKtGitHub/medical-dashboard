import { Router } from 'express';
import { hospitalController } from '../controllers/hospitalController';

const router = Router();

router.get('/', hospitalController.getAll);

export default router;
