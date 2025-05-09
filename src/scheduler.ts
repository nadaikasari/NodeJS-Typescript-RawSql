import cron from 'node-cron';
import { updateExpiredProducts } from './repositories/product.repository'; 

const dailyTask = async () => {
  console.log('Running daily task at 00:01');
  
  await updateExpiredProducts();
};

cron.schedule('01 00 * * *', async () => {  
  await dailyTask(); 
}, {
  scheduled: true,
  timezone: "Asia/Jakarta"
});

console.log('Scheduler is running...');
