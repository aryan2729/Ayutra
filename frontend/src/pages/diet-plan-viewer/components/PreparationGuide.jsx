import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const PreparationGuide = ({ guide, onToggleStep, onWatchVideo }) => {
  const [activeTab, setActiveTab] = useState('preparation');
  const [expandedStep, setExpandedStep] = useState(null);

  const tabs = [
    { id: 'preparation', label: 'Preparation', icon: 'ChefHat' },
    { id: 'cooking', label: 'Cooking', icon: 'Flame' },
    { id: 'tips', label: 'Tips & Tricks', icon: 'Lightbulb' }
  ];

  const getStepIcon = (type) => {
    const icons = {
      'prep': 'Scissors',
      'cook': 'Flame',
      'mix': 'RotateCcw',
      'wait': 'Clock',
      'serve': 'Utensils'
    };
    return icons?.[type] || 'Circle';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-success bg-success/10';
      case 'Medium': return 'text-warning bg-warning/10';
      case 'Hard': return 'text-error bg-error/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const currentSteps = guide?.steps?.filter(step => step?.category === activeTab);
  const completedSteps = currentSteps?.filter(step => step?.completed)?.length;
  const progress = currentSteps?.length > 0 ? (completedSteps / currentSteps?.length) * 100 : 0;

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-semibold text-xl text-text-primary mb-1">
            Preparation Guide
          </h2>
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>Total: {guide?.totalTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{guide?.servings} servings</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide?.difficulty)}`}>
              {guide?.difficulty}
            </span>
          </div>
        </div>
        
        {guide?.videoUrl && (
          <Button
            variant="outline"
            onClick={() => onWatchVideo(guide?.videoUrl)}
            iconName="Play"
            iconPosition="left"
          >
            Watch Video
          </Button>
        )}
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">
            {activeTab?.charAt(0)?.toUpperCase() + activeTab?.slice(1)} Progress
          </span>
          <span className="text-sm text-text-secondary">
            {completedSteps}/{currentSteps?.length} steps
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
              activeTab === tab?.id
                ? 'bg-background text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Steps */}
      <div className="space-y-4">
        {currentSteps?.map((step, index) => (
          <div 
            key={step?.id}
            className={`border rounded-lg transition-smooth ${
              step?.completed 
                ? 'bg-success/5 border-success/20' :'bg-background border-border hover:border-primary/30'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-smooth ${
                    step?.completed
                      ? 'bg-success text-success-foreground'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {step?.completed ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-medium ${
                      step?.completed ? 'text-text-secondary line-through' : 'text-text-primary'
                    }`}>
                      {step?.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {step?.duration && (
                        <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
                          {step?.duration}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleStep(step?.id)}
                        iconName={step?.completed ? "RotateCcw" : "Check"}
                      />
                    </div>
                  </div>

                  <p className={`text-sm mb-3 ${
                    step?.completed ? 'text-text-secondary' : 'text-text-secondary'
                  }`}>
                    {step?.description}
                  </p>

                  {step?.image && (
                    <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                      <Image 
                        src={step?.image} 
                        alt={step?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {step?.tips && step?.tips?.length > 0 && (
                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon name="Lightbulb" size={14} className="text-accent" />
                        <span className="text-sm font-medium text-accent">Pro Tips</span>
                      </div>
                      <ul className="space-y-1">
                        {step?.tips?.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-sm text-text-secondary flex items-start">
                            <Icon name="Dot" size={12} className="mr-1 mt-1 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step?.ingredients && step?.ingredients?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {step?.ingredients?.map((ingredient, ingredientIndex) => (
                        <span 
                          key={ingredientIndex}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {currentSteps?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="ChefHat" size={48} className="text-text-secondary mx-auto mb-3" />
          <p className="text-text-secondary">
            No {activeTab} steps available
          </p>
        </div>
      )}
    </div>
  );
};

export default PreparationGuide;