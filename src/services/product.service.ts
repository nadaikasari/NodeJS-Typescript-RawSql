import {
    beginSerializableTransaction,
    commitTransaction,
    rollbackTransaction,
    getLastProductCode,
    insertProduct,
  } from '../repositories/product.repository';
import { HttpStatus } from '../utils/httpStatus';
import { createResponse, createErrorResponse } from '../utils/response';

export const createProductService = async (name: string, price: number, expired_date: string) => {
    try {
        await beginSerializableTransaction();

        const lastCode = await getLastProductCode();
        const nextNumber = lastCode ? parseInt(lastCode.split('-')[1]) + 1 : 1;
        const newCode = `PRD-${String(nextNumber).padStart(4, '0')}`;

        const formattedExpiredDate = convertDateFormat(expired_date); // "2025-12-31"

        const created = await insertProduct(newCode, name, price, 'NEW', formattedExpiredDate);

        await commitTransaction();

    return createResponse(HttpStatus.CREATED, true, 'Product created successfully', created);
        
    } catch (err) {
        await rollbackTransaction();

        return createErrorResponse('Failed to create product', HttpStatus.UNAUTHORIZED);
    }
};

const convertDateFormat = (expired_date: string) => {
    const [day, month, year] = expired_date.split('-');

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

