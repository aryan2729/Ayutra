import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';

const HealthJourneyChart = ({ data, selectedMetric, onMetricChange, availableMetrics }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-organic">
          <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm text-text-secondary">
                {entry?.name}: <span className="font-medium text-text-primary">{entry?.value}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Health Journey Progress</h3>
          <p className="text-sm text-text-secondary">Track your wellness metrics over time</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedMetric}
            onChange={(e) => onMetricChange(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {availableMetrics?.map((metric) => (
              <option key={metric?.value} value={metric?.value}>
                {metric?.label}
              </option>
            ))}
          </select>
          
          <button className="p-2 hover:bg-muted rounded-lg transition-smooth">
            <Icon name="Download" size={16} />
          </button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrimary)"
            />
            {selectedMetric === 'weight' && (
              <Area
                type="monotone"
                dataKey="target"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={0}
                fill="url(#colorSecondary)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-text-secondary">Current Progress</span>
          </div>
          {selectedMetric === 'weight' && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-secondary border-2 border-dashed" />
              <span className="text-sm text-text-secondary">Target Goal</span>
            </div>
          )}
        </div>
        
        <div className="text-sm text-text-secondary">
          Last updated: {new Date()?.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default HealthJourneyChart;