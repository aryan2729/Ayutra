import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MetricsOverview = ({ metrics, onEdit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {metrics?.map((metric) => (
        <div key={metric?.id} className="card-elevated p-6 transition-smooth hover:shadow-organic-hover relative group">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric?.bgColor}`}>
              <Icon name={metric?.icon} size={24} color="white" />
            </div>
            <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              metric?.trend === 'up' ?'bg-success/10 text-success' 
                : metric?.trend === 'down' ?'bg-error/10 text-error' :'bg-muted text-text-secondary'
            }`}>
              <Icon 
                name={metric?.trend === 'up' ? 'TrendingUp' : metric?.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                size={12} 
                className="inline mr-1" 
              />
              {metric?.change}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit && onEdit(metric)}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                title="Edit metric"
              >
                <Icon name="Edit" size={14} />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-text-primary">{metric?.value}</h3>
            <p className="text-sm text-text-secondary">{metric?.label}</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${metric?.progressColor}`}
                style={{ width: `${metric?.progress}%` }}
              />
            </div>
            <p className="text-xs text-text-secondary">{metric?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;