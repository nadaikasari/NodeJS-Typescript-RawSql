import { Router } from 'express';
import { getListPublicHoliday } from '../controllers/public-holiday.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/public-holidays', authenticateToken, getListPublicHoliday);

export default router;
