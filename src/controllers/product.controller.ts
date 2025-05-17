import { Request, Response } from 'express';
import { createProductService, deleteProductService, getAllProductService, updateProductService } from '../services/product.service';

export const createProduct = async (req: Request, res: Response) => {
    const { name, price, expired_date } = req.body;
  
    const result = await createProductService(name, price, expired_date);
    res.status(result.statusCode).json(result);
};
  
export const updateProduct = async (req: Request, res: Response) => {
    const { product_id, name, price, expired_date } = req.body;
  
    const result = await updateProductService(product_id, name, price, expired_date);
    res.status(result.statusCode).json(result);
};

export const deleteProduct = async (req: Request, res: Response) => {
    const product_id = parseInt(req.params.id, 10);
  
    const result = await deleteProductService(product_id);
    res.status(result.statusCode).json(result);
};

export const getAllProduct = async (req: Request, res: Response) => {
    const result = await getAllProductService();
    res.status(result.statusCode).json(result);
}