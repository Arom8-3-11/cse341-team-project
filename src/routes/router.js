import { Router } from 'express';
import apiRoutes from './api-routes.js';
import ejsRoutes from './ejs-routes.js';

const router = Router();

// JSON API endpoints
router.use('/api', apiRoutes);

// EJS page routes
router.use('/', ejsRoutes);

export default router;
