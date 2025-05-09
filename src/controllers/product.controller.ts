import { Request, Response } from 'express';
import { createProductService } from '../services/product.service';

export const createProduct = async (req: Request, res: Response) => {
    const { name, price, expired_date } = req.body;
  
    const result = await createProductService(name, price, expired_date);
    res.status(result.statusCode).json(result);
};
  