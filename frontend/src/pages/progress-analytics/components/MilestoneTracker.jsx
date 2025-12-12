import React from 'react';
import Icon from '../../../components/AppIcon';

const MilestoneTracker = ({ milestones, onCelebrate }) => {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Achievement Milestones</h3>
          <p className="text-sm text-text-secondary">Celebrate your wellness journey victories</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Trophy" size={20} className="text-accent" />
          <span className="text-sm font-medium text-accent">
            {milestones?.filter(m => m?.completed)?.length}/{milestones?.length} Achieved
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {milestones?.map((milestone, index) => (
          <div key={milestone?.id} className="relative">
            {/* Timeline connector */}
            {index < milestones?.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
            )}
            
            <div className={`flex items-start space-x-4 p-4 rounded-lg transition-smooth ${
              milestone?.completed 
                ? 'bg-success/5 border border-success/20' 
                : milestone?.inProgress 
                ? 'bg-accent/5 border border-accent/20' :'bg-muted/50 border border-border'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                milestone?.completed 
                  ? 'bg-success text-white' 
                  : milestone?.inProgress 
                  ? 'bg-accent text-white' :'bg-muted text-text-secondary'
              }`}>
                <Icon 
                  name={milestone?.completed ? 'CheckCircle' : milestone?.inProgress ? 'Clock' : 'Circle'} 
                  size={20} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${
                    milestone?.completed ? 'text-success' : 'text-text-primary'
                  }`}>
                    {milestone?.title}
                  </h4>
                  {milestone?.completed && (
                    <button
                      onClick={() => onCelebrate(milestone?.id)}
                      className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full hover:bg-accent/20 transition-smooth"
                    >
                      <Icon name="Sparkles" size={12} className="inline mr-1" />
                      Celebrate
                    </button>
                  )}
                </div>
                
                <p className="text-sm text-text-secondary mb-3">{milestone?.description}</p>
                
                {milestone?.inProgress && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                      <span>Progress</span>
                      <span>{milestone?.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${milestone?.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <span className="text-text-secondary">
                      <Icon name="Calendar" size={12} className="inline mr-1" />
                      {milestone?.targetDate}
                    </span>
                    <span className="text-text-secondary">
                      <Icon name="Target" size={12} className="inline mr-1" />
                      {milestone?.category}
                    </span>
                  </div>
                  
                  {milestone?.completed && (
                    <span className="text-success font-medium">
                      Completed {milestone?.completedDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Next milestone in {milestones?.find(m => m?.inProgress)?.daysRemaining || 0} days
          </div>
          <button className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth">
            View All Achievements
            <Icon name="ArrowRight" size={14} className="inline ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneTracker;