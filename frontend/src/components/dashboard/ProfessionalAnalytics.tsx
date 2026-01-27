import React, { useState, useEffect } from 'react';
import { ProfessionalIcons } from '../ui/IconSystem';
import { ProButton } from '../ui/ProButton';
import { ProCard } from '../ui/ProCard';
import { ProInput } from '../ui/ProInput';
import toast from 'react-hot-toast';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalDownloads: number;
    avgTimeSpent: number;
    conversionRate: number;
  };
  viewsOverTime: Array<{
    date: string;
    views: number;
    downloads: number;
  }>;
  topTemplates: Array<{
    id: string;
    name: string;
    views: number;
    downloads: number;
    conversionRate: number;
  }>;
  userDemographics: {
    byCountry: Array<{ country: string; users: number; percentage: number }>;
    byDevice: Array<{ device: string; users: number; percentage: number }>;
    byBrowser: Array<{ browser: string; users: number; percentage: number }>;
  };
  performance: {
    pageLoadTime: number;
    bounceRate: number;
    avgSessionDuration: number;
    returningUsers: number;
  };
}

export const ProfessionalAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('views');

  const timeRanges = [
    { id: '24h', label: 'Last 24 Hours', icon: ProfessionalIcons.ClockIcon },
    { id: '7d', label: 'Last 7 Days', icon: ProfessionalIcons.CalendarIcon },
    { id: '30d', label: 'Last 30 Days', icon: ProfessionalIcons.CalendarIcon },
    { id: '90d', label: 'Last 3 Months', icon: ProfessionalIcons.CalendarIcon },
    { id: '1y', label: 'Last Year', icon: ProfessionalIcons.CalendarIcon }
  ];

  const metrics = [
    { id: 'views', label: 'Views', icon: ProfessionalIcons.EyeIcon, color: 'text-blue-600' },
    { id: 'downloads', label: 'Downloads', icon: ProfessionalIcons.DownloadIcon, color: 'text-green-600' },
    { id: 'conversion', label: 'Conversion Rate', icon: ProfessionalIcons.TrendingUpIcon, color: 'text-purple-600' },
    { id: 'time', label: 'Time Spent', icon: ProfessionalIcons.ClockIcon, color: 'text-orange-600' }
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        overview: {
          totalViews: 15420,
          totalDownloads: 3420,
          avgTimeSpent: 4.5,
          conversionRate: 22.2
        },
        viewsOverTime: [
          { date: '2024-01-22', views: 1250, downloads: 280 },
          { date: '2024-01-21', views: 1180, downloads: 265 },
          { date: '2024-01-20', views: 1320, downloads: 310 },
          { date: '2024-01-19', views: 1080, downloads: 240 },
          { date: '2024-01-18', views: 950, downloads: 200 },
          { date: '2024-01-17', views: 890, downloads: 185 },
          { date: '2024-01-16', views: 1020, downloads: 220 }
        ],
        topTemplates: [
          { id: '1', name: 'Modern Professional', views: 3200, downloads: 450, conversionRate: 14.1 },
          { id: '2', name: 'Technical Developer', views: 2800, downloads: 380, conversionRate: 13.6 },
          { id: '3', name: 'Executive Elite', views: 2200, downloads: 310, conversionRate: 14.1 },
          { id: '4', name: 'Minimal Clean', views: 1900, downloads: 420, conversionRate: 22.1 },
          { id: '5', name: 'Creative Designer', views: 1800, downloads: 290, conversionRate: 16.1 }
        ],
        userDemographics: {
          byCountry: [
            { country: 'United States', users: 4500, percentage: 45.0 },
            { country: 'United Kingdom', users: 2200, percentage: 22.0 },
            { country: 'Canada', users: 1200, percentage: 12.0 },
            { country: 'Germany', users: 800, percentage: 8.0 },
            { country: 'Australia', users: 600, percentage: 6.0 },
            { country: 'Others', users: 700, percentage: 7.0 }
          ],
          byDevice: [
            { device: 'Desktop', users: 6500, percentage: 65.0 },
            { device: 'Mobile', users: 2800, percentage: 28.0 },
            { device: 'Tablet', users: 700, percentage: 7.0 }
          ],
          byBrowser: [
            { browser: 'Chrome', users: 5200, percentage: 52.0 },
            { browser: 'Safari', users: 2100, percentage: 21.0 },
            { browser: 'Firefox', users: 1500, percentage: 15.0 },
            { browser: 'Edge', users: 1200, percentage: 12.0 }
          ]
        },
        performance: {
          pageLoadTime: 2.3,
          bounceRate: 32.5,
          avgSessionDuration: 5.8,
          returningUsers: 68.0
        }
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return num.toFixed(1) + '%';
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getMetricValue = (metric: string): number => {
    if (!analyticsData) return 0;
    
    switch (metric) {
      case 'views':
        return analyticsData.overview.totalViews;
      case 'downloads':
        return analyticsData.overview.totalDownloads;
      case 'conversion':
        return analyticsData.overview.conversionRate;
      case 'time':
        return analyticsData.overview.avgTimeSpent;
      default:
        return 0;
    }
  };

  const getMetricColor = (metric: string): string => {
    switch (metric) {
      case 'views':
        return 'text-blue-600';
      case 'downloads':
        return 'text-green-600';
      case 'conversion':
        return 'text-purple-600';
      case 'time':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getMetricIcon = (metric: string) => {
    const metricConfig = metrics.find(m => m.id === metric);
    return metricConfig?.icon || ProfessionalIcons.InfoIcon;
  };

  const getMetricLabel = (metric: string): string => {
    const metricConfig = metrics.find(m => m.id === metric);
    return metricConfig?.label || metric;
  };

  const getMetricSuffix = (metric: string): string => {
    switch (metric) {
      case 'conversion':
        return '%';
      case 'time':
        return ' min';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ProfessionalIcons.LoadingIcon size="3xl" />
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.ChartIcon size="md" color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">Track your CV performance and user engagement</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Time Range:</span>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timeRanges.map(range => (
                    <option key={range.id} value={range.id}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatNumber(analyticsData?.overview.totalViews || 0)}
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <ProfessionalIcons.TrendingUpIcon size="sm" />
                  <span className="ml-1">+12% from last month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.EyeIcon size="lg" />
              </div>
            </div>
          </ProCard>

          <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Downloads</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatNumber(analyticsData?.overview.totalDownloads || 0)}
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <ProfessionalIcons.TrendingUpIcon size="sm" />
                  <span className="ml-1">+8% from last month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.DownloadIcon size="lg" />
              </div>
            </div>
          </ProCard>

          <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPercentage(analyticsData?.overview.conversionRate || 0)}
                </p>
                <p className="text-sm text-purple-600 mt-2 flex items-center">
                  <ProfessionalIcons.TrendingUpIcon size="sm" />
                  <span className="ml-1">+3% from last month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.TargetIcon size="lg" />
              </div>
            </div>
          </ProCard>

          <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time Spent</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatTime(analyticsData?.overview.avgTimeSpent || 0)}
                </p>
                <p className="text-sm text-orange-600 mt-2 flex items-center">
                  <ProfessionalIcons.ClockIcon size="sm" />
                  <span className="ml-1">-30s from last month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ProfessionalIcons.ClockIcon size="lg" />
              </div>
            </div>
          </ProCard>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Views Over Time Chart */}
          <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Views Over Time</h3>
            <div className="h-64 flex items-end space-x-2">
              {analyticsData?.viewsOverTime.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-end">
                  <div className="text-sm text-gray-600 text-right mb-1">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="flex items-end space-x-2">
                    <div className="text-sm font-medium text-gray-900">
                      {formatNumber(item.views)}
                    </div>
                    <div className="text-xs text-gray-500">
                      ({formatNumber(item.downloads)} downloads)
                    </div>
                  </div>
                  <div className="w-full h-32 bg-gray-100 rounded-lg relative">
                    <div
                      className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-lg transition-all duration-300"
                      style={{ height: `${(item.views / Math.max(...analyticsData.viewsOverTime.map(v => v.views)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </ProCard>

          {/* Top Templates */}
          <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Templates</h3>
            <div className="space-y-4">
              {analyticsData?.topTemplates.map((template, index) => (
                <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{template.name}</p>
                      <p className="text-xs text-gray-500">Template #{template.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatNumber(template.views)}</p>
                      <p className="text-xs text-gray-500">views</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{formatNumber(template.downloads)}</p>
                      <p className="text-xs text-gray-500">downloads</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-purple-600">{formatPercentage(template.conversionRate)}</p>
                      <p className="text-xs text-gray-500">conversion</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ProCard>
        </div>

        {/* User Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* By Country */}
          <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Users by Country</h3>
            <div className="space-y-3">
              {analyticsData?.userDemographics.byCountry.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <ProfessionalIcons.LocationIcon size="sm" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{country.country}</p>
                      <p className="text-xs text-gray-500">{country.users} users</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{country.percentage}%</span>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </ProCard>

          {/* By Device */}
          <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Users by Device</h3>
            <div className="space-y-3">
              {analyticsData?.userDemographics.byDevice.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      device.device === 'Desktop' ? 'bg-blue-100' : device.device === 'Mobile' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {device.device === 'Desktop' && <ProfessionalIcons.MonitorIcon size="sm" />}
                      {device.device === 'Mobile' && <ProfessionalIcons.SmartphoneIcon size="sm" />}
                      {device.device === 'Tablet' && <ProfessionalIcons.TabletIcon size="sm" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{device.device}</p>
                      <p className="text-xs text-gray-500">{device.users} users</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{device.percentage}%</span>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        device.device === 'Desktop' ? 'bg-blue-500' : device.device === 'Mobile' ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </ProCard>

          {/* By Browser */}
          <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Users by Browser</h3>
            <div className="space-y-3">
              {analyticsData?.userDemographics.byBrowser.map((browser, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      {browser.browser === 'Chrome' && <ProfessionalIcons.GlobeIcon size="sm" color="text-blue-600" />}
                      {browser.browser === 'Safari' && <ProfessionalIcons.GlobeIcon size="sm" color="text-blue-400" />}
                      {browser.browser === 'Firefox' && <ProfessionalIcons.GlobeIcon size="sm" color="text-orange-500" />}
                      {browser.browser === 'Edge' && <ProfessionalIcons.GlobeIcon size="sm" color="text-blue-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{browser.browser}</p>
                      <p className="text-xs text-gray-500">{browser.users} users</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{browser.percentage}%</span>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${browser.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </ProCard>
        </div>

        {/* Performance Metrics */}
        <ProCard variant="elevated" className="p-6 border-0 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ProfessionalIcons.ZapIcon size="lg" />
              </div>
              <p className="text-sm font-medium text-gray-900">Page Load Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.performance.pageLoadTime}s
              </p>
              <p className="text-sm text-green-600">Excellent</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ProfessionalIcons.AlertTriangleIcon size="lg" />
              </div>
              <p className="text-sm font-medium text-gray-900">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(analyticsData?.performance.bounceRate)}
              </p>
              <p className="text-sm text-orange-600">Needs improvement</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ProfessionalIcons.ClockIcon size="lg" />
              </div>
              <p className="text-sm font-medium text-gray-900">Avg. Session</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(analyticsData?.performance.avgSessionDuration)}
              </p>
              <p className="text-sm text-green-600">Good</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ProfessionalIcons.UserCheckIcon size="lg" />
              </div>
              <p className="text-sm font-medium text-gray-900">Returning Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(analyticsData?.performance.returningUsers)}
              </p>
              <p className="text-sm text-purple-600">Excellent</p>
            </div>
          </div>
        </ProCard>
      </div>
    </div>
  );
};

export default ProfessionalAnalytics;
