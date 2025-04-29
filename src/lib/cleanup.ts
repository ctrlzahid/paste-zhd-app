import cron from 'node-cron';
import { Paste } from '@/models/Paste';
import connectToDatabase from './mongodb';

export async function cleanupExpiredPastes() {
  try {
    await connectToDatabase();

    // Find and delete all pastes that have expired
    const result = await Paste.deleteMany({
      expiresAt: {
        $lt: new Date(),
        $ne: null, // Don't delete pastes that never expire
      },
    });

    console.log(`Cleaned up ${result.deletedCount} expired pastes`);
  } catch (error) {
    console.error('Error cleaning up expired pastes:', error);
  }
}

// Schedule cleanup to run every hour
export function scheduleCleanup() {
  cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled cleanup of expired pastes...');
    await cleanupExpiredPastes();
  });
}
