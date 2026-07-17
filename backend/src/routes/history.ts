import { Router } from 'express';
import { historyController } from '../controllers/historyController';

const router = Router();

router.get('/snapshots', historyController.listSnapshots);
router.get('/at', historyController.getNearestToDateTime);
router.get('/:snapshotId', historyController.getSnapshot);

export default router;
