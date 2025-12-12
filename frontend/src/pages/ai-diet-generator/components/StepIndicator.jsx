import React from 'react';
import Icon from '../../../components/AppIcon';

const StepIndicator = ({ currentStep, totalSteps, steps }) => {
  // Calculate display step number (if step 1 is skipped, adjust numbering)
  const getDisplayStepNumber = (index) => {
    // If steps array doesn't include step 1, adjust numbering
    const hasStep1 = steps?.some(s => s.id === 1);
    if (!hasStep1 && steps?.length > 0) {
      // Step 1 is skipped, so display numbers start from 1
      return index + 1;
    }
    // Normal numbering
    return index + 1;
  };

  // Get the actual step number for comparison (use step.id if available, otherwise index)
  const getActualStepNumber = (step, index) => {
    return step?.id || (index + 1);
  };

  return (
    <div className="w-full bg-surface rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg text-text-primary">
          Diet Generation Progress
        </h3>
        <span className="text-sm text-text-secondary">
          Step {steps?.findIndex(s => getActualStepNumber(s, steps.indexOf(s)) === currentStep) + 1 || currentStep} of {totalSteps}
        </span>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        {steps?.map((step, index) => {
          const actualStepNumber = getActualStepNumber(step, index);
          const displayStepNumber = getDisplayStepNumber(index);
          const isActive = actualStepNumber === currentStep;
          const isCompleted = actualStepNumber < currentStep;
          const isUpcoming = actualStepNumber > currentStep;
          
          return (
            <React.Fragment key={step?.id}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-smooth ${
                isCompleted 
                  ? 'bg-success border-success text-success-foreground' 
                  : isActive 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'bg-background border-border text-text-secondary'
              }`}>
                {isCompleted ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="text-sm font-medium">{displayStepNumber}</span>
                )}
              </div>
              {index < steps?.length - 1 && (
                <div className={`flex-1 h-0.5 transition-smooth ${
                  isCompleted ? 'bg-success' : 'bg-border'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="text-center">
        <h4 className="font-medium text-text-primary mb-1">
          {steps?.find(s => getActualStepNumber(s, steps.indexOf(s)) === currentStep)?.title || steps?.[0]?.title}
        </h4>
        <p className="text-sm text-text-secondary">
          {steps?.find(s => getActualStepNumber(s, steps.indexOf(s)) === currentStep)?.description || steps?.[0]?.description}
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;
