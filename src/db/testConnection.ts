import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  const testClient = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await testClient.connect();
    console.log('✅ Connected to the database successfully');
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err);
  } finally {
    await testClient.end();
  }
}

testConnection();
