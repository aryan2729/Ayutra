import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ userRole }) => {
  const getActionsForRole = () => {
    switch (userRole) {
      case 'doctor':
      case 'practitioner':
        return [
          {
            title: 'Create Patient Profile',
            description: 'Add a new patient and conduct Prakriti assessment',
            icon: 'UserPlus',
            link: '/patient-profile-builder',
            color: 'bg-primary',
            urgent: false
          },
          {
            title: 'Generate AI Diet Plan',
            description: 'Create personalized diet recommendations',
            icon: 'Brain',
            link: '/ai-diet-generator',
            color: 'bg-accent',
            urgent: true
          },
          {
            title: 'Review Diet Plans',
            description: 'Approve and customize pending diet plans',
            icon: 'FileText',
            link: '/diet-plan-viewer',
            color: 'bg-secondary',
            urgent: false
          },
          {
            title: 'Explore Food Database',
            description: 'Research foods and their Ayurvedic properties',
            icon: 'Search',
            link: '/food-explorer',
            color: 'bg-success',
            urgent: false
          }
        ];
      case 'patient':
        return [
          {
            title: 'View My Diet Plan',
            description: 'Access your current personalized meal plan',
            icon: 'FileText',
            link: '/diet-plan-viewer',
            color: 'bg-primary',
            urgent: true
          },
          {
            title: 'Update My Profile',
            description: 'Modify health information and preferences',
            icon: 'User',
            link: '/patient-profile-builder',
            color: 'bg-secondary',
            urgent: false
          },
          {
            title: 'Track My Progress',
            description: 'Log meals, weight, and wellness metrics',
            icon: 'BarChart3',
            link: '/progress-analytics',
            color: 'bg-success',
            urgent: false
          },
          {
            title: 'Discover Foods',
            description: 'Learn about foods suitable for your constitution',
            icon: 'Search',
            link: '/food-explorer',
            color: 'bg-accent',
            urgent: false
          }
        ];
      case 'admin':
        return [
          {
            title: 'User Management',
            description: 'Manage practitioners, patients, and permissions',
            icon: 'Users',
            link: '/intelligent-dashboard',
            color: 'bg-primary',
            urgent: false
          },
          {
            title: 'System Analytics',
            description: 'Monitor platform performance and usage',
            icon: 'BarChart3',
            link: '/progress-analytics',
            color: 'bg-accent',
            urgent: false
          },
          {
            title: 'Content Management',
            description: 'Update food database and educational content',
            icon: 'FileText',
            link: '/food-explorer',
            color: 'bg-secondary',
            urgent: false
          },
          {
            title: 'Support Center',
            description: 'Handle user queries and technical issues',
            icon: 'HelpCircle',
            link: '/intelligent-dashboard',
            color: 'bg-warning',
            urgent: true
          }
        ];
      default:
        return [];
    }
  };

  const actions = getActionsForRole();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-text-primary">
          Quick Actions
        </h2>
        <Button variant="ghost" size="sm">
          <Icon name="MoreHorizontal" size={16} />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions?.map((action, index) => (
          <Link
            key={index}
            to={action?.link}
            className="group card-elevated p-6 hover:shadow-organic-hover transition-smooth relative overflow-hidden"
          >
            {action?.urgent && (
              <div className="absolute top-3 right-3">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              </div>
            )}
            
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 ${action?.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                <Icon name={action?.icon} size={24} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                  {action?.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {action?.description}
                </p>
              </div>
              
              <Icon 
                name="ArrowRight" 
                size={16} 
                className="text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" 
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;