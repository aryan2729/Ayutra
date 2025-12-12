import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const ComplianceTracker = ({ 
  complianceData, 
  weeklyData, 
  loading = false, 
  overallPercentage = 87,
  goalsCompliance,
  metricsCompliance,
  milestonesCompliance,
  goals = [],
  metrics = [],
  milestones = []
}) => {
  const COLORS = ['var(--color-success)', 'var(--color-warning)', 'var(--color-error)', 'var(--color-muted)'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-organic">
          <p className="text-sm font-medium text-text-primary mb-1">{label}</p>
          <p className="text-sm text-text-secondary">
            Compliance: <span className="font-medium text-text-primary">{payload?.[0]?.value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated p-6">
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
        <div className="card-elevated p-6">
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overall Compliance */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">Diet Plan Compliance</h3>
            <p className="text-sm text-text-secondary">Overall adherence to your plan</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-success">{overallPercentage}%</div>
            <div className="text-xs text-text-secondary">This month</div>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={complianceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {complianceData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {complianceData?.map((item, index) => (
            <div key={item?.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-text-primary">{item?.name}</div>
                <div className="text-xs text-text-secondary">{item?.value}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Weekly Compliance Trend */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">Weekly Compliance Trend</h3>
            <p className="text-sm text-text-secondary">Track your consistency over time</p>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm text-success font-medium">+5% vs last week</span>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="day" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="compliance" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-text-primary">6</div>
              <div className="text-xs text-text-secondary">Streak Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-text-primary">92%</div>
              <div className="text-xs text-text-secondary">Best Week</div>
            </div>
          </div>
          
          <button className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-smooth">
            <Icon name="Target" size={12} className="inline mr-1" />
            Set Goal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceTracker;