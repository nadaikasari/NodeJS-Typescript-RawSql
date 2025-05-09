import { Router } from 'express';
import { createOrder, getTopCustomersThisMonth } from '../controllers/transaction.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/orders', authenticateToken, createOrder);
router.get('/top-customers', authenticateToken, getTopCustomersThisMonth);

export default router;

