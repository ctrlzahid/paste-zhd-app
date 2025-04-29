'use client';

import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type AnalyticsDataProps = {
  data: {
    eventCounts: {
      create: number;
      view: number;
      delete: number;
    };
    topSyntaxes: Array<{
      syntax: string;
      count: number;
    }>;
    rateLimitedIPs: Array<{
      ip: string;
      count: number;
    }>;
    hourlyData: Array<{
      hour: number;
      event: string;
      count: number;
    }>;
    dailyData: Array<{
      date: string;
      event: string;
      count: number;
    }>;
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsDashboard({ data }: AnalyticsDataProps) {
  // Format hourly data for the chart
  const formatHourlyData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const formattedData = hours.map((hour) => {
      const hourData = {
        hour: `${hour}:00`,
        create: 0,
        view: 0,
        delete: 0,
      };

      data.hourlyData.forEach((item) => {
        if (item.hour === hour) {
          if (
            item.event === 'create' ||
            item.event === 'view' ||
            item.event === 'delete'
          ) {
            hourData[item.event] = item.count;
          }
        }
      });

      return hourData;
    });

    return formattedData;
  };

  // Format daily data for the chart
  const formatDailyData = () => {
    // Get unique dates
    const dates = [...new Set(data.dailyData.map((item) => item.date))];

    return dates.map((date) => {
      const dayData = {
        date,
        create: 0,
        view: 0,
        delete: 0,
      };

      data.dailyData.forEach((item) => {
        if (item.date === date) {
          if (
            item.event === 'create' ||
            item.event === 'view' ||
            item.event === 'delete'
          ) {
            dayData[item.event] = item.count;
          }
        }
      });

      return dayData;
    });
  };

  // Prepare event counts for pie chart
  const eventCountsData = [
    { name: 'Created', value: data.eventCounts.create },
    { name: 'Viewed', value: data.eventCounts.view },
    { name: 'Deleted', value: data.eventCounts.delete },
  ];

  return (
    <Tabs.Root className='flex flex-col w-full' defaultValue='overview'>
      <Tabs.List className='flex border-b mb-4'>
        <Tabs.Trigger
          className='px-4 py-2 text-sm font-medium hover:bg-muted/50 data-[state=active]:border-b-2 data-[state=active]:border-primary'
          value='overview'
        >
          Overview
        </Tabs.Trigger>
        <Tabs.Trigger
          className='px-4 py-2 text-sm font-medium hover:bg-muted/50 data-[state=active]:border-b-2 data-[state=active]:border-primary'
          value='hourly'
        >
          Hourly Activity
        </Tabs.Trigger>
        <Tabs.Trigger
          className='px-4 py-2 text-sm font-medium hover:bg-muted/50 data-[state=active]:border-b-2 data-[state=active]:border-primary'
          value='daily'
        >
          Daily Activity
        </Tabs.Trigger>
        <Tabs.Trigger
          className='px-4 py-2 text-sm font-medium hover:bg-muted/50 data-[state=active]:border-b-2 data-[state=active]:border-primary'
          value='syntax'
        >
          Popular Syntaxes
        </Tabs.Trigger>
        <Tabs.Trigger
          className='px-4 py-2 text-sm font-medium hover:bg-muted/50 data-[state=active]:border-b-2 data-[state=active]:border-primary'
          value='ratelimits'
        >
          Rate Limits
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value='overview' className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-card p-4 rounded-lg shadow'>
            <h3 className='text-lg font-semibold mb-2'>Event Distribution</h3>
            <div className='h-[250px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={eventCountsData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {eventCountsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className='bg-card p-4 rounded-lg shadow'>
            <h3 className='text-lg font-semibold mb-2'>Top Syntaxes</h3>
            <div className='h-[250px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={data.topSyntaxes}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='syntax' />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='count' fill='#8884d8' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className='bg-card p-4 rounded-lg shadow'>
            <h3 className='text-lg font-semibold mb-2'>Summary</h3>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span>Total Creates:</span>
                <span className='font-semibold'>{data.eventCounts.create}</span>
              </div>
              <div className='flex justify-between'>
                <span>Total Views:</span>
                <span className='font-semibold'>{data.eventCounts.view}</span>
              </div>
              <div className='flex justify-between'>
                <span>Total Deletes:</span>
                <span className='font-semibold'>{data.eventCounts.delete}</span>
              </div>
              <div className='pt-2 mt-2 border-t'>
                <span className='font-semibold'>Top Syntax: </span>
                <span>
                  {data.topSyntaxes.length > 0
                    ? `${data.topSyntaxes[0].syntax} (${data.topSyntaxes[0].count} uses)`
                    : 'No data'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Tabs.Content>

      <Tabs.Content value='hourly' className='space-y-4'>
        <div className='bg-card p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>
            Hourly Activity (Last 24 Hours)
          </h3>
          <div className='h-[400px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={formatHourlyData()}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='hour' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='create'
                  stroke='#0088FE'
                  activeDot={{ r: 8 }}
                />
                <Line type='monotone' dataKey='view' stroke='#00C49F' />
                <Line type='monotone' dataKey='delete' stroke='#FF8042' />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Tabs.Content>

      <Tabs.Content value='daily' className='space-y-4'>
        <div className='bg-card p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>
            Daily Activity (Last 7 Days)
          </h3>
          <div className='h-[400px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={formatDailyData()}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='create' fill='#0088FE' />
                <Bar dataKey='view' fill='#00C49F' />
                <Bar dataKey='delete' fill='#FF8042' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Tabs.Content>

      <Tabs.Content value='syntax' className='space-y-4'>
        <div className='bg-card p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>
            Popular Syntax Highlighting Options
          </h3>
          <div className='h-[400px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={data.topSyntaxes}
                layout='vertical'
                margin={{ left: 80 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' />
                <YAxis type='category' dataKey='syntax' />
                <Tooltip />
                <Legend />
                <Bar dataKey='count' fill='#8884d8' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Tabs.Content>

      <Tabs.Content value='ratelimits' className='space-y-4'>
        <div className='bg-card p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>
            IPs Approaching Rate Limits
          </h3>
          {data.rateLimitedIPs.length > 0 ? (
            <div className='overflow-auto max-h-[400px]'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-muted/50'>
                    <th className='px-4 py-2 text-left'>IP Address</th>
                    <th className='px-4 py-2 text-left'>Usage Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rateLimitedIPs.map((ip, index) => (
                    <tr key={index} className='border-t'>
                      <td className='px-4 py-2'>{ip.ip}</td>
                      <td className='px-4 py-2'>{ip.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-muted-foreground'>
              No IPs approaching rate limits
            </p>
          )}
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
