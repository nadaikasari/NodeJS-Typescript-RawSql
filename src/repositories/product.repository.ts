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

export const getLastProductCode = async () => {
    const result = await client.query('SELECT product_code FROM products ORDER BY product_id DESC LIMIT 1');
    return result.rows[0]?.product_code;
};

export const insertProduct = async (code: string, name: string, price: number, status_product: string, expired_date: string) => {
    const result = await client.query(
        'INSERT INTO products (product_code, product_name, price, status_product, expired_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [code, name, price, status_product, expired_date]
    );
    return result.rows[0];
};

export const updateExpiredProducts = async (): Promise<void> => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Set time to start of the day (00:00:00)
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Set time to end of the day (23:59:59)

        // Update products whose expired_date is today
        const result = await client.query(
        'UPDATE products SET status_product = $1 WHERE expired_date BETWEEN $2 AND $3 RETURNING *',
        ['EXPIRED', startOfDay, endOfDay]
        );

        if (result.rows.length > 0) {
        console.log(`${result.rows.length} products were updated to expired.`);
        } else {
        console.log('No products were updated today.');
        }
    } catch (error) {
        console.error('Error updating expired products:', error);
    }
};