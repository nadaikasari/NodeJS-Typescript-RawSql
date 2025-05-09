import { Request, Response } from 'express';
import { createOrderService, getTopCustomersThisMonthService } from '../services/transaction.service';

export const createOrder = async (req: Request, res: Response) => {
    const { orderBy, orderDate, items } = req.body;

    const result = await createOrderService(orderBy, orderDate, items);
    res.status(result.statusCode).json(result);
};

export const getTopCustomersThisMonth = async (_req: Request, res: Response) => {
    const result = await getTopCustomersThisMonthService();
    res.status(result.statusCode).json(result);
};