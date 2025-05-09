import { Router } from 'express';
import { createProduct } from '../controllers/product.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/products', authenticateToken, createProduct);

export default router;
