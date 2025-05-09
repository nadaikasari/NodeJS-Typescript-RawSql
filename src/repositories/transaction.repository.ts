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

export const insertOrder = async (orderBy: number, orderDate: string, total: number) => {
    const result = await client.query(
        'INSERT INTO orders (ordered_by, order_date, total) VALUES ($1, $2, $3) RETURNING order_id',
        [orderBy, orderDate, total]
    );
    return result.rows[0].order_id;
};
  
export const insertOrderDetail = async (
    orderId: number,
    productId: number,
    quantity: number,
    subTotal: number
    ) => {
    await client.query(
        'INSERT INTO order_details (order_id, product_id, quantity, sub_total) VALUES ($1, $2, $3, $4)',
        [orderId, productId, quantity, subTotal]
    );
};

export const getProductPrice = async (productId: number) => {
    const result = await client.query('SELECT price FROM products WHERE product_id = $1', [productId]);
    return result.rows[0]?.price || 0;
};

export const getTopCustomersThisMonth = async () => {
    const result = await client.query(
      `SELECT 
        u.id AS user_id,
        u.name AS user_name,
        SUM(o.total) AS total_spent
      FROM orders o
      JOIN users u ON u.id = o.ordered_by
      WHERE DATE_TRUNC('month', o.order_date) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY u.id, u.name
      ORDER BY total_spent DESC
      LIMIT 10`
    );
  
    return result.rows;
};
  