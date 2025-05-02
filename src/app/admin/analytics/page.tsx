import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/database';
import { AnalyticsEvent, UsageLimit } from '@/models/Analytics';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Feedback } from '@/models/Feedback';
import LogoutButton from '@/components/LogoutButton';

export const metadata: Metadata = {
  title: 'Admin - Analytics Dashboard',
  description: 'View usage statistics for paste.zhd.app',
};

async function getAnalyticsData() {
  try {
    await connectToDatabase();

    // Get last 7 days of data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get counts by event type
    const createEvents = await AnalyticsEvent.countDocuments({
      event: 'create',
      timestamp: { $gte: sevenDaysAgo },
    });

    const viewEvents = await AnalyticsEvent.countDocuments({
      event: 'view',
      timestamp: { $gte: sevenDaysAgo },
    });

    const deleteEvents = await AnalyticsEvent.countDocuments({
      event: 'delete',
      timestamp: { $gte: sevenDaysAgo },
    });

    // Get top syntaxes
    const topSyntaxes = await AnalyticsEvent.aggregate([
      { $match: { event: 'create', syntax: { $exists: true, $ne: null } } },
      { $group: { _id: '$syntax', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Get rate limited IPs from today
    const today = new Date().toISOString().split('T')[0];
    const rateLimitedIPs = await UsageLimit.find({
      date: today,
      count: { $gte: 40 }, // Show IPs approaching the limit
    })
      .sort({ count: -1 })
      .limit(10);

    // Get hourly data for the last 24 hours
    const hourlyData = await AnalyticsEvent.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$timestamp' },
            event: '$event',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.hour': 1 } },
    ]);

    // Get daily data for the last 7 days
    const dailyData = await AnalyticsEvent.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            event: '$event',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    // Get recent feedback
    const recentFeedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(50);

    return {
      eventCounts: {
        create: createEvents,
        view: viewEvents,
        delete: deleteEvents,
      },
      topSyntaxes: topSyntaxes.map((item) => ({
        syntax: item._id,
        count: item.count,
      })),
      rateLimitedIPs: rateLimitedIPs.map((ip) => ({
        ip: ip.ip,
        count: ip.count,
      })),
      hourlyData: hourlyData.map((item) => ({
        hour: item._id.hour,
        event: item._id.event,
        count: item.count,
      })),
      dailyData: dailyData.map((item) => ({
        date: item._id.date,
        event: item._id.event,
        count: item.count,
      })),
      feedback: recentFeedback.map((item) => ({
        id: item._id.toString(),
        message: item.message,
        email: item.email || 'Anonymous',
        createdAt: item.createdAt,
        ip: item.ip,
        userAgent: item.userAgent,
      })),
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return null;
  }
}

export default async function AdminAnalyticsPage() {
  try {
    const analyticsData = await getAnalyticsData();

    if (!analyticsData) {
      return (
        <main className='flex-1 bg-gradient-to-b from-background to-background/95'>
          <div className='container mx-auto px-4 py-12 max-w-6xl'>
            <div className='backdrop-blur-sm bg-card/50 border rounded-xl p-6 shadow-lg'>
              <h1 className='text-3xl font-bold mb-8'>Analytics Dashboard</h1>
              <div className='bg-destructive/10 border border-destructive/30 p-4 rounded-lg'>
                <h2 className='text-xl font-bold mb-2'>Configuration Error</h2>
                <p className='mb-4'>
                  MongoDB connection is not configured properly. Please set up
                  your MONGODB_URI in the .env.local file.
                </p>
                <pre className='bg-muted p-4 my-4 rounded overflow-x-auto'>
                  MONGODB_URI=mongodb://localhost:27017/paste-zhd
                </pre>
                <p>
                  Once MongoDB is configured and running, analytics data will be
                  collected and displayed here.
                </p>
              </div>
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className='flex-1 bg-gradient-to-b from-background to-background/95'>
        <div className='container mx-auto px-4 py-12 max-w-6xl'>
          <div className='backdrop-blur-sm bg-card/50 border rounded-xl p-6 shadow-lg'>
            <div className='flex justify-between items-center mb-8'>
              <h1 className='text-3xl font-bold'>Analytics Dashboard</h1>
              <LogoutButton />
            </div>
            <AnalyticsDashboard data={analyticsData} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error rendering analytics page:', error);
    return (
      <main className='flex-1 bg-gradient-to-b from-background to-background/95'>
        <div className='container mx-auto px-4 py-12 max-w-6xl'>
          <div className='backdrop-blur-sm bg-card/50 border rounded-xl p-6 shadow-lg'>
            <h1 className='text-3xl font-bold mb-8'>Analytics Dashboard</h1>
            <div className='bg-destructive/10 border border-destructive/30 p-4 rounded-lg'>
              <h2 className='text-xl font-bold mb-2'>Error</h2>
              <p>
                An error occurred while rendering the analytics dashboard.
                Please check your server logs for more details.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
