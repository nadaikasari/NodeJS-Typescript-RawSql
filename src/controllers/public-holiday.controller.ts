import { Request, Response } from 'express';
import { fetchPublicHolidayDatas } from '../services/public-holiday.service';

export const getListPublicHoliday = async (req: Request, res: Response) => {
    const result = await fetchPublicHolidayDatas();
    res.status(result.statusCode).json(result);
};
