import {
    beginSerializableTransaction,
    commitTransaction,
    rollbackTransaction,
    insertOrder,
    insertOrderDetail,
    getProductPrice,
    getTopCustomersThisMonth
  } from '../repositories/transaction.repository';
import { HttpStatus } from '../utils/httpStatus';
import { createResponse, createErrorResponse } from '../utils/response';
  
  export const createOrderService = async (
    orderBy: number,
    orderDate: string,
    items: { productId: number; quantity: number; subTotal?: number }[]
  ) => {
    try {
      await beginSerializableTransaction();
  
      // Menghitung total dan sub-total untuk setiap item
      let total = 0;
      const detailedItems = [];
  
      for (const item of items) {
        const productPrice = await getProductPrice(item.productId);
        const subTotal = productPrice * item.quantity;
        total += subTotal;
  
        detailedItems.push({
          ...item,
          subTotal,
        });
      }

      const formattedExpiredDate = convertDateFormat(orderDate); // "2025-12-31"
  
      const orderId = await insertOrder(orderBy, formattedExpiredDate, total);
  
      for (const item of detailedItems) {
        await insertOrderDetail(orderId, item.productId, item.quantity, item.subTotal);
      }
  
      await commitTransaction();
        
      return createResponse(HttpStatus.CREATED, true, 'Order created successfully', orderId);

    } catch (error) {
      await rollbackTransaction();
      
      return createErrorResponse('Failed to create order', HttpStatus.UNAUTHORIZED);
    }
  };
  
const convertDateFormat = (expired_date: string) => {
    const [day, month, year] = expired_date.split('-');

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};
export const getTopCustomersThisMonthService = async () => {
    try {
        const customers = await getTopCustomersThisMonth();

        return createResponse(HttpStatus.CREATED, true, 'Top 10 customers retrieved successfully', customers);
    } catch (error) {
        return createErrorResponse('Failed to retrieve top customers', HttpStatus.UNAUTHORIZED);
    }
};