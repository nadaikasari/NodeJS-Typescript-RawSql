import { Router } from 'express';
import { createOrder} from '../controllers/order.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/orders-transaction', authenticateToken, createOrder);

export default router;
