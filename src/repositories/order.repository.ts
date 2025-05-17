import client from '../db/connection';

export const beginSerializableTransaction = async () => {
    await client.query('BEGIN');
    await client.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');
};

export const commitTransaction = async () => {
    await client.query('COMMIT');
};

export const rollbackTransaction = async () => {
    await client.query('ROLLBACK');
};

export const getLastOrderCode = async () => {
    const result = await client.query('SELECT order_code FROM transactions ORDER BY id DESC LIMIT 1');
    return result.rows[0]?.order_code;
};

export const createTransaction = async (
    address: string,
    paymentType: string,
    orderCode: string
  ) => {
    const result = await client.query(
      `INSERT INTO transactions (address, payment_type, order_code)
       VALUES ($1, $2, $3) RETURNING *`,
      [address, paymentType, orderCode]
    );
    return result.rows[0];
};

export interface OrderItem {
    id_product: number;
    price: number;
    quantity: number;
}
  
export const createTransactionProduct = async (
    transactionId: number,
    item: OrderItem
  ) => {
    const result = await client.query(
      `INSERT INTO transaction_product (transaction_id, id_product, price, quantity)
       VALUES ($1, $2, $3, $4)`,
      [transactionId, item.id_product, item.price, item.quantity]
    );
    return result.rowCount;
};
  
  
  