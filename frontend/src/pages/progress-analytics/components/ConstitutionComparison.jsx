import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const ConstitutionComparison = ({ userConstitution, comparisonData, similarUsersData }) => {
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
    <div className="space-y-6">
      {/* Constitution Profile Comparison */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">Constitution Profile Analysis</h3>
            <p className="text-sm text-text-secondary">Your Prakriti compared to similar constitution types</p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 bg-accent/10 text-accent rounded-full">
            <Icon name="Users" size={16} />
            <span className="text-sm font-medium">{userConstitution} Dominant</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={comparisonData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis 
                  dataKey="aspect" 
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }}
                />
                <Radar
                  name="Your Profile"
                  dataKey="user"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Similar Users"
                  dataKey="average"
                  stroke="var(--color-secondary)"
                  fill="var(--color-secondary)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-text-primary">Key Insights</h4>
            {comparisonData?.map((item, index) => (
              <div key={item?.aspect} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item?.user > item?.average ? 'bg-success/20 text-success' : 
                    item?.user < item?.average ? 'bg-warning/20 text-warning': 'bg-muted text-text-secondary'
                  }`}>
                    <Icon 
                      name={item?.user > item?.average ? 'TrendingUp' : 
                            item?.user < item?.average ? 'TrendingDown' : 'Minus'} 
                      size={14} 
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{item?.aspect}</div>
                    <div className="text-xs text-text-secondary">
                      You: {item?.user}% | Average: {item?.average}%
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  item?.user > item?.average ? 'text-success' : 
                  item?.user < item?.average ? 'text-warning': 'text-text-secondary'
                }`}>
                  {item?.user > item?.average ? '+' : ''}{item?.user - item?.average}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Progress Comparison with Similar Users */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">Progress Comparison</h3>
            <p className="text-sm text-text-secondary">How your progress compares to similar constitution types</p>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Award" size={16} className="text-accent" />
            <span className="text-sm text-accent font-medium">Top 25% Performer</span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={similarUsersData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="metric" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="you" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                name="Your Progress"
              />
              <Bar 
                dataKey="average" 
                fill="var(--color-secondary)"
                radius={[4, 4, 0, 0]}
                name="Average Progress"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
            <Icon name="Trophy" size={24} className="text-success mx-auto mb-2" />
            <div className="text-lg font-bold text-success">Rank #47</div>
            <div className="text-xs text-text-secondary">Out of 200 similar users</div>
          </div>
          
          <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/20">
            <Icon name="Target" size={24} className="text-accent mx-auto mb-2" />
            <div className="text-lg font-bold text-accent">85%</div>
            <div className="text-xs text-text-secondary">Goal achievement rate</div>
          </div>
          
          <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
            <Icon name="TrendingUp" size={24} className="text-primary mx-auto mb-2" />
            <div className="text-lg font-bold text-primary">+12%</div>
            <div className="text-xs text-text-secondary">Above average progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstitutionComparison;