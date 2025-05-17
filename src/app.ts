import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import publicHolidayRoutes from './routes/public-holiday.routes';
import transactionRoutes from './routes/transaction.routes';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', publicHolidayRoutes);
app.use('/api', transactionRoutes);
app.use('/api', orderRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
