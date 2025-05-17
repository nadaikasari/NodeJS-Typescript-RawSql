import { Request, Response } from 'express';
import { createOrderService} from '../services/order.service';

export const createOrder = async (req: Request, res: Response) => {
    const { address, payment_type, items } = req.body;
    const customerId = req.user?.id || 1;

    const result = await createOrderService(address, payment_type, customerId, items);
    res.status(result.statusCode).json(result);
};
  