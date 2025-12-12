import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WelcomeCard = ({ userRole, userName, currentTime }) => {
  const navigate = useNavigate();

  const getGreeting = () => {
    // Role-based greeting as per user login
    switch (userRole) {
      case 'doctor':
        return 'Hello Doctor';
      case 'practitioner':
        return 'Hello Practitioner';
      case 'patient':
        return `Hello ${userName || 'Patient'}`;
      default:
        return `Hello ${userName || 'User'}`;
    }
  };

  const getRoleSpecificMessage = () => {
    switch (userRole) {
      case 'doctor':
      case 'practitioner':
        return 'Ready to help your patients achieve optimal wellness today?';
      case 'patient':
        return 'Your personalized wellness journey continues today.';
      case 'admin':
        return 'Monitor and manage the platform for optimal performance.';
      default:
        return 'Welcome to your personalized Ayurvedic wellness platform.';
    }
  };

  const getQuickActions = () => {
    switch (userRole) {
      case 'doctor':
      case 'practitioner':
        return [
          { 
            label: 'Review Patients', 
            icon: 'Users', 
            action: () => navigate('/diet-plan-viewer'),
            color: 'bg-blue-500 hover:bg-blue-600'
          },
          { 
            label: 'Generate Diet Plan', 
            icon: 'Brain', 
            action: () => navigate('/ai-diet-generator'),
            color: 'bg-green-500 hover:bg-green-600'
          }
        ];
      case 'patient':
        return [
          { 
            label: 'View My Plan', 
            icon: 'FileText', 
            action: () => navigate('/diet-plan-viewer'),
            color: 'bg-purple-500 hover:bg-purple-600'
          },
          { 
            label: 'Log Progress', 
            icon: 'TrendingUp', 
            action: () => navigate('/progress-analytics'),
            color: 'bg-orange-500 hover:bg-orange-600'
          }
        ];
      case 'admin':
        return [
          { 
            label: 'System Overview', 
            icon: 'BarChart3', 
            action: () => navigate('/admin-dashboard'),
            color: 'bg-red-500 hover:bg-red-600'
          },
          { 
            label: 'User Management', 
            icon: 'Settings', 
            action: () => navigate('/user-management'),
            color: 'bg-indigo-500 hover:bg-indigo-600'
          }
        ];
      default:
        return [];
    }
  };

  // Mock patient data for profile image
  const getProfileImage = () => {
    const images = {
      'Dr. Priya Sharma': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      'Rajesh Kumar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      'Admin User': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'Sarah Johnson': 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
    };
    return images?.[userName] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
  };

  return (
    <div className="card-elevated p-6 bg-brand-gradient text-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-bold mb-2">
            {getGreeting()}!
          </h1>
          <p className="text-white/90 text-lg mb-4">
            {getRoleSpecificMessage()}
          </p>
          <div className="flex items-center text-white/80 text-sm">
            <Icon name="Clock" size={16} className="mr-2" />
            <span>Last updated: {currentTime}</span>
          </div>
        </div>
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ml-4">
          <img 
            src={getProfileImage()} 
            alt={userName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
            }}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {getQuickActions()?.map((action, index) => (
          <Button
            key={index}
            variant="secondary"
            size="sm"
            className={`text-white border-white/30 transition-colors ${action?.color}`}
            onClick={action?.action}
          >
            <Icon name={action?.icon} size={16} className="mr-2" />
            {action?.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeCard;