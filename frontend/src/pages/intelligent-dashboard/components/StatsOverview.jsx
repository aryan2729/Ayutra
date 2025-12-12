import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsOverview = ({ userRole, stats }) => {
  const getStatsForRole = () => {
    switch (userRole) {
      case 'doctor':
      case 'practitioner':
        return [
          {
            label: 'Active Patients',
            value: stats?.activePatients || 24,
            icon: 'Users',
            trend: '+12%',
            trendUp: true,
            color: 'text-primary'
          },
          {
            label: 'Diet Plans Generated',
            value: stats?.dietPlans || 156,
            icon: 'Brain',
            trend: '+8%',
            trendUp: true,
            color: 'text-accent'
          }
        ];
      case 'patient':
        return [
          {
            label: 'Days on Plan',
            value: stats?.daysOnPlan || 45,
            icon: 'Calendar',
            trend: '+1',
            trendUp: true,
            color: 'text-primary'
          },
          {
            label: 'Compliance Rate',
            value: `${stats?.complianceRate || 92}%`,
            icon: 'CheckCircle',
            trend: '+5%',
            trendUp: true,
            color: 'text-success'
          },
          {
            label: 'Weight Progress',
            value: `${stats?.weightProgress || -3.2}kg`,
            icon: 'TrendingDown',
            trend: '-0.5kg',
            trendUp: true,
            color: 'text-accent'
          },
          {
            label: 'Energy Level',
            value: `${stats?.energyLevel || 8.5}/10`,
            icon: 'Zap',
            trend: '+0.8',
            trendUp: true,
            color: 'text-warning'
          }
        ];
      case 'admin':
        return [
          {
            label: 'Total Users',
            value: stats?.totalUsers || 1247,
            icon: 'Users',
            trend: '+15%',
            trendUp: true,
            color: 'text-primary'
          },
          {
            label: 'Active Sessions',
            value: stats?.activeSessions || 89,
            icon: 'Activity',
            trend: '+23%',
            trendUp: true,
            color: 'text-success'
          },
          {
            label: 'System Health',
            value: `${stats?.systemHealth || 98.5}%`,
            icon: 'Shield',
            trend: '+0.2%',
            trendUp: true,
            color: 'text-accent'
          },
          {
            label: 'Support Tickets',
            value: stats?.supportTickets || 12,
            icon: 'HelpCircle',
            trend: '-8',
            trendUp: false,
            color: 'text-warning'
          }
        ];
      default:
        return [];
    }
  };

  const statsData = getStatsForRole();

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${statsData?.length > 2 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-6`}>
      {statsData?.map((stat, index) => (
        <div key={index} className="card-elevated p-6 hover:shadow-organic-hover transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat?.color}`}>
              <Icon name={stat?.icon} size={24} />
            </div>
            <div className={`flex items-center text-sm ${
              stat?.trendUp ? 'text-success' : 'text-destructive'
            }`}>
              <Icon 
                name={stat?.trendUp ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className="mr-1" 
              />
              <span>{stat?.trend}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-heading font-bold text-text-primary mb-1">
              {stat?.value}
            </h3>
            <p className="text-text-secondary text-sm">
              {stat?.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;