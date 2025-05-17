import { HttpStatus } from '../utils/httpStatus';
import { createResponse, createErrorResponse } from '../utils/response';
import {
    beginSerializableTransaction,
    commitTransaction,
    rollbackTransaction,
    getLastOrderCode,
    createTransaction,
    createTransactionProduct
  } from '../repositories/order.repository';

interface OrderItem {
    id_product: number;
    name: string;
    price: number;
    quantity: number;
}
  
export const createOrderService = async (address: string, payment_type: string, customerId: number, items: OrderItem[] ) => {
    try {
        await beginSerializableTransaction();
        await new Promise(resolve => setTimeout(resolve, 3000));

        //TGLBULANTAHUN
        const now = new Date();
        const dateKey = now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' }).replaceAll('/', '');
        
        //RUNNING NUMBER
        const lastCode = await getLastOrderCode();
        let newNumber = 1;
        if (lastCode) {
            const lastNumberPart = lastCode.split('-').pop();
            newNumber = parseInt(lastNumberPart || '0') + 1;
        }

        const runningNumber = String(newNumber).padStart(5, '0');
        const orderNumber = `ORDER-${customerId}-${dateKey}-${runningNumber}`;

        const created = await createTransaction(address, payment_type, orderNumber);

        for (const item of items) {
            const inserted = await createTransactionProduct(created.id, item);
            if (inserted !== 1) {
                throw new Error('Failed to insert transaction product');
            }
        }

        await commitTransaction();

        return createResponse(HttpStatus.CREATED, true, 'Order created successfully', items);
        
    } catch (err) {
        await rollbackTransaction();

        return createErrorResponse('Failed to create order', HttpStatus.UNAUTHORIZED);
    }
};
