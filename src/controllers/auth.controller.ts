import { Request, Response } from 'express';
import { registerService, loginService } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = await registerService(name, email, password);
    res.status(user.statusCode).json(user);
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    res.status(result.statusCode).json(result);
};
