import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DietPlanHeader = ({ plan, onDownload, onShare, onEdit }) => {
  const getDoshaColor = (dosha) => {
    switch (dosha) {
      case 'Vata': return 'bg-blue-100 text-blue-800';
      case 'Pitta': return 'bg-red-100 text-red-800';
      case 'Kapha': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card-elevated p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="font-heading font-bold text-2xl text-text-primary">
              {plan?.name}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDoshaColor(plan?.primaryDosha)}`}>
              {plan?.primaryDosha} Constitution
            </span>
          </div>
          
          <p className="text-text-secondary mb-4">
            {plan?.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Calendar" size={16} className="text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">{plan?.duration}</div>
                <div className="text-xs text-text-secondary">Duration</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Icon name="Target" size={16} className="text-secondary" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">{plan?.goal}</div>
                <div className="text-xs text-text-secondary">Goal</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="Utensils" size={16} className="text-accent" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">{plan?.mealsPerDay}</div>
                <div className="text-xs text-text-secondary">Meals/Day</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={16} className="text-success" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">{plan?.progress}%</div>
                <div className="text-xs text-text-secondary">Progress</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            onClick={onDownload}
            iconName="Download"
            iconPosition="left"
          >
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={onShare}
            iconName="Share2"
            iconPosition="left"
          >
            Share Plan
          </Button>
          <Button
            variant="default"
            onClick={onEdit}
            iconName="Edit"
            iconPosition="left"
          >
            Customize
          </Button>
        </div>
      </div>
      {plan?.lastUpdated && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} />
              <span>Last updated: {new Date(plan.lastUpdated)?.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="User" size={14} />
              <span>Created by: {plan?.createdBy}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietPlanHeader;