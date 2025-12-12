import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = ({ userRole, notifications }) => {
  const [filter, setFilter] = useState('all');

  const getNotificationsForRole = () => {
    switch (userRole) {
      case 'doctor':
      case 'practitioner':
        return notifications || [
          {
            id: 1,
            type: 'urgent',
            title: 'Patient requires immediate attention',
            message: 'Sarah Johnson reported severe digestive discomfort after following the new diet plan.',
            timestamp: '5 minutes ago',
            icon: 'AlertTriangle',
            read: false,
            priority: 'high'
          },
          {
            id: 2,
            type: 'approval',
            title: 'Diet plan pending approval',
            message: 'AI-generated plan for Michael Chen is ready for your review and approval.',
            timestamp: '2 hours ago',
            icon: 'Clock',
            read: false,
            priority: 'medium'
          },
          {
            id: 3,
            type: 'success',
            title: 'Patient milestone achieved',
            message: 'Emma Davis has successfully completed 30 days on her personalized diet plan.',
            timestamp: '4 hours ago',
            icon: 'Trophy',
            read: true,
            priority: 'low'
          },
          {
            id: 4,
            type: 'info',
            title: 'New research article available',
            message: 'Latest study on Ayurvedic nutrition and metabolic health has been added to your library.',
            timestamp: '1 day ago',
            icon: 'BookOpen',
            read: true,
            priority: 'low'
          }
        ];
      case 'patient':
        return notifications || [
          {
            id: 1,
            type: 'reminder',
            title: 'Time for your afternoon meal',
            message: 'Your Pitta-balancing lunch should be consumed between 12-1 PM for optimal digestion.',
            timestamp: '30 minutes ago',
            icon: 'Clock',
            read: false,
            priority: 'medium'
          },
          {
            id: 2,
            type: 'success',
            title: 'Weekly goal achieved!',
            message: 'Congratulations! You\'ve maintained 95% compliance with your diet plan this week.',
            timestamp: '2 hours ago',
            icon: 'CheckCircle',
            read: false,
            priority: 'high'
          },
          {
            id: 3,
            type: 'update',
            title: 'Diet plan updated by Dr. Patel',
            message: 'Your practitioner has made seasonal adjustments to your meal plan for better winter balance.',
            timestamp: '1 day ago',
            icon: 'FileText',
            read: true,
            priority: 'medium'
          },
          {
            id: 4,
            type: 'tip',
            title: 'Daily wellness tip',
            message: 'Start your day with warm water and lemon to kindle your digestive fire (Agni).',
            timestamp: '2 days ago',
            icon: 'Lightbulb',
            read: true,
            priority: 'low'
          }
        ];
      case 'admin':
        return notifications || [
          {
            id: 1,
            type: 'alert',
            title: 'System performance alert',
            message: 'API response times have increased by 15% in the last hour. Investigation required.',
            timestamp: '15 minutes ago',
            icon: 'AlertCircle',
            read: false,
            priority: 'high'
          },
          {
            id: 2,
            type: 'security',
            title: 'Security scan completed',
            message: 'Weekly security audit completed successfully. No vulnerabilities detected.',
            timestamp: '3 hours ago',
            icon: 'Shield',
            read: false,
            priority: 'medium'
          },
          {
            id: 3,
            type: 'update',
            title: 'New practitioner registrations',
            message: '12 new verified practitioners have joined the platform in the last 24 hours.',
            timestamp: '6 hours ago',
            icon: 'UserPlus',
            read: true,
            priority: 'low'
          },
          {
            id: 4,
            type: 'backup',
            title: 'Daily backup completed',
            message: 'All system data has been successfully backed up to secure cloud storage.',
            timestamp: '12 hours ago',
            icon: 'Database',
            read: true,
            priority: 'low'
          }
        ];
      default:
        return [];
    }
  };

  const notificationData = getNotificationsForRole();
  
  const filteredNotifications = filter === 'all' 
    ? notificationData 
    : notificationData?.filter(n => !n?.read);

  const getNotificationIcon = (type) => {
    const iconMap = {
      urgent: 'AlertTriangle',
      approval: 'Clock',
      success: 'CheckCircle',
      info: 'Info',
      reminder: 'Bell',
      update: 'FileText',
      tip: 'Lightbulb',
      alert: 'AlertCircle',
      security: 'Shield',
      backup: 'Database'
    };
    return iconMap?.[type] || 'Bell';
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: 'text-destructive',
      medium: 'text-warning',
      low: 'text-text-secondary'
    };
    return colorMap?.[priority] || 'text-text-secondary';
  };

  const getPriorityBg = (priority) => {
    const bgMap = {
      high: 'bg-destructive/10',
      medium: 'bg-warning/10',
      low: 'bg-muted'
    };
    return bgMap?.[priority] || 'bg-muted';
  };

  const markAsRead = (id) => {
    // In a real app, this would update the notification status
    console.log(`Marking notification ${id} as read`);
  };

  const unreadCount = notificationData?.filter(n => !n?.read)?.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-heading font-semibold text-text-primary">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread
          </Button>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Bell" size={48} className="text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </p>
          </div>
        ) : (
          filteredNotifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`card-elevated p-4 hover:shadow-organic-hover transition-smooth cursor-pointer ${
                !notification?.read ? 'border-l-4 border-l-primary' : ''
              }`}
              onClick={() => markAsRead(notification?.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg ${getPriorityBg(notification?.priority)} flex items-center justify-center flex-shrink-0`}>
                  <Icon 
                    name={getNotificationIcon(notification?.type)} 
                    size={18} 
                    className={getPriorityColor(notification?.priority)}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-medium leading-tight ${
                      !notification?.read ? 'text-text-primary' : 'text-text-secondary'
                    }`}>
                      {notification?.title}
                    </h3>
                    {!notification?.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                  
                  <p className="text-text-secondary text-sm mb-2 leading-relaxed">
                    {notification?.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-text-secondary">
                      <Icon name="Clock" size={12} className="mr-1" />
                      <span>{notification?.timestamp}</span>
                    </div>
                    
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      notification?.priority === 'high' ? 'bg-destructive/20 text-destructive' :
                      notification?.priority === 'medium'? 'bg-warning/20 text-warning' : 'bg-muted text-text-secondary'
                    }`}>
                      {notification?.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {filteredNotifications?.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm">
            View All Notifications
            <Icon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;