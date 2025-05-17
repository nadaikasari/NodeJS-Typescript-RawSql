import fs from 'fs/promises';
import path from 'path';
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

const baseFolder = path.join(process.cwd(), 'database', 'customer-order');
const processingCustomers = new Map<number, boolean>();

async function saveOrderFile(orderNumber: string, data: object, retries = 3): Promise<void> {
    const filePath = path.join(baseFolder, `${orderNumber}.json`);
    try {
        await fs.mkdir(baseFolder, { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        if (retries > 0) {
            return saveOrderFile(orderNumber, data, retries - 1);
        } else {
            throw new Error(`Failed to save order file after 3 retries: ${error.message}`);
        }
    }
}

export const createOrderService = async (
    address: string,
    payment_type: string,
    customerId: number,
    items: OrderItem[]
) => {
    if (processingCustomers.get(customerId)) {
        return createErrorResponse(
            `A previous order request for customer ${customerId} is still processing. Please try again later.`,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    processingCustomers.set(customerId, true);

    try {
        await beginSerializableTransaction();
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate delay

        // Generate order code (TGLBULANTAHUN)
        const now = new Date();
        const dateKey = now.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        }).replaceAll('/', '');

        // Running number
        const lastCode = await getLastOrderCode();
        let newNumber = 1;
        if (lastCode) {
            const lastNumberPart = lastCode.split('-').pop();
            newNumber = parseInt(lastNumberPart || '0') + 1;
        }
        const runningNumber = String(newNumber).padStart(5, '0');
        const orderNumber = `ORDER-${customerId}-${dateKey}-${runningNumber}`;

        // Insert to transactions table
        const created = await createTransaction(address, payment_type, orderNumber);

        // Insert each item to transaction_products
        for (const item of items) {
            const inserted = await createTransactionProduct(created.id, item);
            if (inserted !== 1) {
                throw new Error('Failed to insert transaction product');
            }
        }

        await commitTransaction();

        // Save JSON file with retry logic
        await saveOrderFile(orderNumber, { address, payment_type, customerId, items });

        return createResponse(HttpStatus.CREATED, true, 'Order created successfully', created);
    } catch (err: any) {
        await rollbackTransaction();
        return createErrorResponse(`Failed to create order: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
        processingCustomers.delete(customerId);
    }
};
