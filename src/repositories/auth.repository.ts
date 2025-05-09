import client from '../db/connection';

export const findUserByEmail = async (email: string) => {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

export const createUser = async (name: string, email: string, hashedPassword: string) => {
    const result = await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    return result.rows[0];
};
