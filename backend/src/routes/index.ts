import { Router } from 'express';
import hospitalsRouter from './hospitals';
import ambulancesRouter from './ambulances';
import alertsRouter from './alerts';
import dashboardRouter from './dashboard';
import historyRouter from './history';

const apiRouter = Router();

apiRouter.use('/hospitals', hospitalsRouter);
apiRouter.use('/ambulances', ambulancesRouter);
apiRouter.use('/alerts', alertsRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/history', historyRouter);

apiRouter.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok' });
});

export default apiRouter;
