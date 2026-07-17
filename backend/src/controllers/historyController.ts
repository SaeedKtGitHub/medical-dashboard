import { Request, Response } from 'express';
import { AppError } from '../utils/errors';
import { asyncHandler } from '../utils/asyncHandler';
import {
  findNearestSnapshotId,
  getHistorySnapshotById,
  listHistorySnapshots,
} from '../services/historyService';

export const historyController = {
  listSnapshots: asyncHandler(async (_req: Request, res: Response) => {
    const snapshots = await listHistorySnapshots();
    res.json({ success: true, data: snapshots });
  }),

  getSnapshot: asyncHandler(async (req: Request, res: Response) => {
    const { snapshotId } = req.params;
    const state = await getHistorySnapshotById(snapshotId);

    if (!state) {
      throw new AppError('History snapshot not found', 404);
    }

    res.json({ success: true, data: state });
  }),

  getNearestToDateTime: asyncHandler(async (req: Request, res: Response) => {
    const datetime = String(req.query.datetime ?? '');
    const snapshotId = await findNearestSnapshotId(datetime);

    if (!snapshotId) {
      throw new AppError('No history snapshots available yet', 404);
    }

    const state = await getHistorySnapshotById(snapshotId);

    if (!state) {
      throw new AppError('History snapshot not found', 404);
    }

    res.json({ success: true, data: state });
  }),
};
