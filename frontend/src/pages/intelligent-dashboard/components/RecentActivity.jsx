import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivity = ({ userRole, activities }) => {
  const getActivitiesForRole = () => {
    switch (userRole) {
      case 'doctor':
      case 'practitioner':
        return activities || [
          {
            id: 1,
            type: 'diet_plan_generated',
            title: 'Diet plan generated for Sarah Johnson',
            description: 'Kapha-Pitta constitution with weight management focus',
            timestamp: '2 hours ago',
            icon: 'Brain',
            color: 'text-accent',
            status: 'pending'
          },
          {
            id: 2,
            type: 'patient_progress',
            title: 'Michael Chen logged progress update',
            description: '92% compliance rate, 2.1kg weight loss achieved',
            timestamp: '4 hours ago',
            icon: 'TrendingUp',
            color: 'text-success',
            status: 'completed'
          },
          {
            id: 3,
            type: 'consultation_scheduled',
            title: 'Consultation scheduled with Emma Davis',
            description: 'Follow-up appointment for diet plan review',
            timestamp: '6 hours ago',
            icon: 'Calendar',
            color: 'text-primary',
            status: 'scheduled'
          },
          {
            id: 4,
            type: 'plan_approved',
            title: 'Diet plan approved for Robert Wilson',
            description: 'Vata-dominant constitution with digestive support',
            timestamp: '1 day ago',
            icon: 'CheckCircle',
            color: 'text-success',
            status: 'completed'
          }
        ];
      case 'patient':
        return activities || [
          {
            id: 1,
            type: 'meal_logged',
            title: 'Breakfast logged successfully',
            description: 'Warm oatmeal with almonds and honey - Vata balancing',
            timestamp: '3 hours ago',
            icon: 'Coffee',
            color: 'text-success',
            status: 'completed'
          },
          {
            id: 2,
            type: 'weight_updated',
            title: 'Weight progress recorded',
            description: 'Lost 0.3kg this week - great progress!',
            timestamp: '1 day ago',
            icon: 'TrendingDown',
            color: 'text-accent',
            status: 'completed'
          },
          {
            id: 3,
            type: 'plan_received',
            title: 'New diet plan received from Dr. Patel',
            description: 'Updated plan with seasonal adjustments for winter',
            timestamp: '2 days ago',
            icon: 'FileText',
            color: 'text-primary',
            status: 'new'
          },
          {
            id: 4,
            type: 'reminder_set',
            title: 'Meal reminder activated',
            description: 'Daily notifications for optimal meal timing',
            timestamp: '3 days ago',
            icon: 'Bell',
            color: 'text-warning',
            status: 'active'
          }
        ];
      case 'admin':
        return activities || [
          {
            id: 1,
            type: 'user_registered',
            title: '5 new practitioners joined today',
            description: 'Platform growth continues with verified professionals',
            timestamp: '1 hour ago',
            icon: 'UserPlus',
            color: 'text-success',
            status: 'completed'
          },
          {
            id: 2,
            type: 'system_update',
            title: 'AI model performance improved',
            description: 'Diet generation accuracy increased to 94.2%',
            timestamp: '4 hours ago',
            icon: 'Zap',
            color: 'text-accent',
            status: 'completed'
          },
          {
            id: 3,
            type: 'support_ticket',
            title: '3 support tickets resolved',
            description: 'User authentication and data sync issues fixed',
            timestamp: '6 hours ago',
            icon: 'HelpCircle',
            color: 'text-primary',
            status: 'resolved'
          },
          {
            id: 4,
            type: 'backup_completed',
            title: 'Daily system backup completed',
            description: 'All user data and configurations safely stored',
            timestamp: '12 hours ago',
            icon: 'Shield',
            color: 'text-success',
            status: 'completed'
          }
        ];
      default:
        return [];
    }
  };

  const activityData = getActivitiesForRole();

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-warning/20 text-warning', label: 'Pending' },
      completed: { color: 'bg-success/20 text-success', label: 'Completed' },
      scheduled: { color: 'bg-primary/20 text-primary', label: 'Scheduled' },
      new: { color: 'bg-accent/20 text-accent', label: 'New' },
      active: { color: 'bg-secondary/20 text-secondary', label: 'Active' },
      resolved: { color: 'bg-success/20 text-success', label: 'Resolved' }
    };

    const config = statusConfig?.[status] || statusConfig?.completed;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-text-primary">
          Recent Activity
        </h2>
        <Button variant="ghost" size="sm">
          View All
          <Icon name="ArrowRight" size={16} className="ml-2" />
        </Button>
      </div>
      <div className="space-y-4">
        {activityData?.map((activity) => (
          <div key={activity?.id} className="card-elevated p-4 hover:shadow-organic-hover transition-smooth">
            <div className="flex items-start space-x-4">
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${activity?.color} flex-shrink-0`}>
                <Icon name={activity?.icon} size={18} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-text-primary leading-tight">
                    {activity?.title}
                  </h3>
                  {getStatusBadge(activity?.status)}
                </div>
                
                <p className="text-text-secondary text-sm mb-2 leading-relaxed">
                  {activity?.description}
                </p>
                
                <div className="flex items-center text-xs text-text-secondary">
                  <Icon name="Clock" size={12} className="mr-1" />
                  <span>{activity?.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;