import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuestionCard = ({ question, selectedAnswer, onAnswerSelect, onNext, onPrevious, isFirst, isLast, canProceed }) => {
  return (
    <div className="bg-card rounded-lg shadow-organic border border-border p-8 mb-6">
      <div className="mb-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Icon name={question?.icon} size={16} color="var(--color-accent-foreground)" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-xl text-text-primary mb-2">
              {question?.title}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {question?.description}
            </p>
          </div>
        </div>
        
        {question?.sanskritTerm && (
          <div className="bg-surface rounded-lg p-4 border-l-4 border-accent">
            <p className="font-accent text-sm text-text-secondary">
              <span className="font-semibold text-accent">Sanskrit:</span> {question?.sanskritTerm}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {question?.sanskritMeaning}
            </p>
          </div>
        )}
      </div>
      <div className="space-y-3 mb-8">
        {question?.options?.map((option) => (
          <div
            key={option?.id}
            onClick={() => onAnswerSelect(option?.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-smooth ${
              selectedAnswer === option?.id
                ? 'border-primary bg-primary/5 shadow-organic'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                selectedAnswer === option?.id
                  ? 'border-primary bg-primary' :'border-border'
              }`}>
                {selectedAnswer === option?.id && (
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary mb-1">
                  {option?.text}
                </p>
                <p className="text-sm text-text-secondary">
                  {option?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirst}
          iconName="ChevronLeft"
          iconPosition="left"
        >
          Previous
        </Button>
        
        <div className="text-sm text-text-secondary">
          {selectedAnswer ? 'Answer selected' : 'Please select an answer'}
        </div>
        
        <Button
          variant="default"
          onClick={onNext}
          disabled={!canProceed}
          iconName={isLast ? "Check" : "ChevronRight"}
          iconPosition="right"
        >
          {isLast ? 'Complete Assessment' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default QuestionCard;