import { Router } from 'express';
import { createProduct, updateProduct, deleteProduct, getAllProduct } from '../controllers/product.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/products', authenticateToken, createProduct);
router.put('/products', authenticateToken, updateProduct);
router.delete('/products/:id', authenticateToken, deleteProduct);
router.get('/products', authenticateToken, getAllProduct)

export default router;
