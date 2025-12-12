import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecentlyViewed = ({ recentFoods, onViewDetails, onClearHistory }) => {
  if (!recentFoods || recentFoods?.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface border-b border-border p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={20} className="text-brand-primary" />
            <h3 className="font-heading font-semibold text-lg text-text-primary">
              Recently Viewed
            </h3>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="text-text-secondary hover:text-text-primary"
          >
            <Icon name="X" size={16} />
            Clear History
          </Button>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-2">
          {recentFoods?.slice(0, 8)?.map((food) => (
            <div
              key={food?.id}
              className="flex-shrink-0 w-48 bg-background rounded-lg border border-border p-3 cursor-pointer transition-smooth hover:shadow-organic"
              onClick={() => onViewDetails(food)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <Image
                    src={food?.image}
                    alt={food?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-text-primary text-sm truncate">
                    {food?.name}
                  </h4>
                  <p className="text-xs text-text-secondary truncate">
                    {food?.category}
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={10} className="text-accent" />
                      <span className="text-xs text-text-secondary">{food?.rating}</span>
                    </div>
                    
                    <div className="w-1 h-1 bg-text-secondary rounded-full"></div>
                    
                    <span className="text-xs text-text-secondary">
                      {food?.nutrition?.calories} cal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;