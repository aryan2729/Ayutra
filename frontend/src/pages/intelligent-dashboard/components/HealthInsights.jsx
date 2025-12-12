import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const HealthInsights = ({ userRole, insights }) => {
  const getInsightsForRole = () => {
    switch (userRole) {
      case 'doctor':
      case 'practitioner':
        return {
          title: 'Practice Insights',
          charts: [], // Removed all graphs for practitioners
          metrics: [
            { label: 'Average Plan Adherence', value: '87%', trend: '+3%', icon: 'Target' },
            { label: 'Patient Satisfaction', value: '4.8/5', trend: '+0.2', icon: 'Heart' },
            { label: 'Consultation Hours', value: '156h', trend: '+12h', icon: 'Clock' }
          ]
        };
      case 'patient':
        return {
          title: 'Your Health Journey',
          charts: [
            {
              type: 'line',
              title: 'Weight Progress (Last 8 Weeks)',
              data: [
                { week: 'W1', weight: 75.2 },
                { week: 'W2', weight: 74.8 },
                { week: 'W3', weight: 74.5 },
                { week: 'W4', weight: 74.1 },
                { week: 'W5', weight: 73.8 },
                { week: 'W6', weight: 73.4 },
                { week: 'W7', weight: 73.0 },
                { week: 'W8', weight: 72.6 }
              ]
            },
            {
              type: 'pie',
              title: 'Meal Compliance This Week',
              data: [
                { name: 'Completed', value: 85, color: '#228B22' },
                { name: 'Missed', value: 15, color: '#CD5C5C' }
              ]
            }
          ],
          metrics: [
            { label: 'Energy Level', value: '8.5/10', trend: '+1.2', icon: 'Zap' },
            { label: 'Sleep Quality', value: '7.8/10', trend: '+0.5', icon: 'Moon' },
            { label: 'Digestion Score', value: '9.1/10', trend: '+1.8', icon: 'Heart' }
          ]
        };
      case 'admin':
        return {
          title: 'Platform Analytics',
          charts: [
            {
              type: 'bar',
              title: 'Monthly Active Users',
              data: [
                { month: 'Mar', users: 1150 },
                { month: 'Apr', users: 1280 },
                { month: 'May', users: 1420 },
                { month: 'Jun', users: 1580 },
                { month: 'Jul', users: 1720 },
                { month: 'Aug', users: 1890 }
              ]
            },
            {
              type: 'line',
              title: 'System Performance (Response Time)',
              data: [
                { day: 'Mon', time: 245 },
                { day: 'Tue', time: 238 },
                { day: 'Wed', time: 251 },
                { day: 'Thu', time: 242 },
                { day: 'Fri', time: 239 },
                { day: 'Sat', time: 235 },
                { day: 'Sun', time: 241 }
              ]
            }
          ],
          metrics: [
            { label: 'Platform Uptime', value: '99.8%', trend: '+0.1%', icon: 'Shield' },
            { label: 'User Satisfaction', value: '4.7/5', trend: '+0.3', icon: 'Star' },
            { label: 'Support Resolution', value: '2.4h', trend: '-0.6h', icon: 'Clock' }
          ]
        };
      default:
        return { title: '', charts: [], metrics: [] };
    }
  };

  const data = getInsightsForRole();

  const renderChart = (chart) => {
    switch (chart?.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chart?.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="name" stroke="#666666" fontSize={12} />
              <YAxis stroke="#666666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chart?.data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color || "#2D5016"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chart?.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey={chart?.data?.[0]?.month ? 'month' : chart?.data?.[0]?.week ? 'week' : chart?.data?.[0]?.day ? 'day' : 'name'} stroke="#666666" fontSize={12} />
              <YAxis stroke="#666666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey={chart?.data?.[0]?.rate ? 'rate' : chart?.data?.[0]?.weight ? 'weight' : chart?.data?.[0]?.users ? 'users' : 'time'} 
                stroke="#2D5016" 
                strokeWidth={3}
                dot={{ fill: '#2D5016', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#DAA520' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chart?.data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chart?.data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  // Don't render anything if there are no charts and no metrics
  if (!data?.charts?.length && !data?.metrics?.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-semibold text-text-primary">
        {data?.title}
      </h2>
      {/* Key Metrics */}
      {data?.metrics?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.metrics?.map((metric, index) => (
            <div key={index} className="card-elevated p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon name={metric?.icon} size={20} className="text-primary" />
                <span className="text-success text-sm font-medium">
                  {metric?.trend}
                </span>
              </div>
              <div className="text-2xl font-heading font-bold text-text-primary mb-1">
                {metric?.value}
              </div>
              <div className="text-text-secondary text-sm">
                {metric?.label}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Charts */}
      {data?.charts?.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {data?.charts?.map((chart, index) => (
            <div key={index} className="card-elevated p-6">
              <h3 className="font-heading font-semibold text-text-primary mb-4">
                {chart?.title}
              </h3>
              <div className="w-full h-64" aria-label={chart?.title}>
                {renderChart(chart)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthInsights;