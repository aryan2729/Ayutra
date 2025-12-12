import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PrakritiAssessment = ({ 
  questions, 
  answers, 
  onAnswerSelect, 
  onNext, 
  onPrevious, 
  isFirst, 
  isLast,
  currentQuestionIndex,
  totalQuestions 
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const [subQuestionAnswers, setSubQuestionAnswers] = useState({});

  // Initialize sub-question answers from parent answers
  React.useEffect(() => {
    if (currentQuestion?.type === 'multi' && answers[currentQuestion?.id]) {
      setSubQuestionAnswers(answers[currentQuestion.id] || {});
    }
  }, [currentQuestion, answers]);

  const handleSubQuestionAnswer = (subQuestionId, optionId) => {
    if (currentQuestion?.type === 'multi') {
      const subQuestion = currentQuestion.subQuestions?.find(sq => sq.id === subQuestionId);
      const isMultipleSelect = subQuestion?.type === 'multiple_select';
      
      let newSubAnswers;
      if (isMultipleSelect) {
        // Handle multiple select - toggle option in array
        const currentAnswers = subQuestionAnswers[subQuestionId] || [];
        const isSelected = Array.isArray(currentAnswers) && currentAnswers.includes(optionId);
        
        newSubAnswers = {
          ...subQuestionAnswers,
          [subQuestionId]: isSelected
            ? currentAnswers.filter(id => id !== optionId)
            : [...currentAnswers, optionId]
        };
      } else {
        // Single select - replace with new option
        newSubAnswers = {
          ...subQuestionAnswers,
          [subQuestionId]: optionId
        };
      }
      
      setSubQuestionAnswers(newSubAnswers);
      // Update parent answers with the question ID and all sub-answers
      onAnswerSelect(currentQuestion.id, newSubAnswers);
    } else {
      // Single question type - pass question ID and option ID
      onAnswerSelect(currentQuestion.id, optionId);
    }
  };

  const isSubQuestionAnswered = (subQuestionId) => {
    if (currentQuestion?.type === 'multi') {
      const answer = subQuestionAnswers[subQuestionId];
      const subQuestion = currentQuestion.subQuestions?.find(sq => sq.id === subQuestionId);
      const isMultipleSelect = subQuestion?.type === 'multiple_select';
      
      if (isMultipleSelect) {
        // For multiple select, at least one option must be selected
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer !== undefined;
    }
    return answers[currentQuestion?.id] !== undefined;
  };

  const canProceed = () => {
    if (currentQuestion?.type === 'multi') {
      // All sub-questions must be answered
      return currentQuestion.subQuestions?.every(subQ => {
        const answer = subQuestionAnswers[subQ.id];
        const isMultipleSelect = subQ?.type === 'multiple_select';
        
        if (isMultipleSelect) {
          // For multiple select, at least one option must be selected
          return Array.isArray(answer) && answer.length > 0;
        }
        return answer !== undefined;
      });
    } else {
      // Single question must be answered
      return answers[currentQuestion?.id] !== undefined;
    }
  };

  const getSelectedAnswer = (subQuestionId, optionId) => {
    if (currentQuestion?.type === 'multi') {
      const answer = subQuestionAnswers[subQuestionId];
      const subQuestion = currentQuestion.subQuestions?.find(sq => sq.id === subQuestionId);
      const isMultipleSelect = subQuestion?.type === 'multiple_select';
      
      if (isMultipleSelect) {
        // For multiple select, check if option is in array
        return Array.isArray(answer) && answer.includes(optionId);
      }
      return answer === optionId;
    } else {
      return answers[currentQuestion?.id] === optionId;
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="bg-card rounded-lg border border-border shadow-organic p-6 md:p-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm text-text-secondary">
            {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-12 h-12 bg-brand-gradient rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name={currentQuestion.icon || 'HelpCircle'} size={24} color="white" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">
              {currentQuestion.title}
            </h2>
            {currentQuestion.sanskritTerm && (
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-accent font-medium text-sm">
                  {currentQuestion.sanskritTerm}
                </span>
                {currentQuestion.sanskritMeaning && (
                  <>
                    <span className="text-text-secondary">•</span>
                    <span className="text-text-secondary text-sm">
                      {currentQuestion.sanskritMeaning}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="space-y-4">
        {currentQuestion.type === 'multi' ? (
          // Multi-subquestion format
          <div className="space-y-6">
            {currentQuestion.subQuestions?.map((subQuestion, subIndex) => {
              const isMultipleSelect = subQuestion?.type === 'multiple_select';
              return (
                <div key={subQuestion.id} className="bg-surface rounded-lg p-5 border border-border">
                  <h3 className="font-semibold text-text-primary mb-4">
                    {subQuestion.question}
                    {isMultipleSelect && (
                      <span className="ml-2 text-xs text-text-secondary font-normal">
                        (You can select multiple options)
                      </span>
                    )}
                  </h3>
                  <div className="grid md:grid-cols-1 gap-3">
                    {subQuestion.options?.map((option) => {
                      const isSelected = getSelectedAnswer(subQuestion.id, option.id);
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleSubQuestionAnswer(subQuestion.id, option.id)}
                          className={`text-left p-4 rounded-lg border-2 transition-smooth ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50 hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-5 h-5 mt-0.5 flex items-center justify-center ${
                              isMultipleSelect 
                                ? `rounded border-2 ${isSelected ? 'border-primary bg-primary' : 'border-border'}`
                                : `rounded-full border-2 ${isSelected ? 'border-primary bg-primary' : 'border-border'}`
                            }`}>
                              {isSelected && (
                                <Icon name="Check" size={12} color="white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-text-primary mb-1">
                                {option.text}
                              </div>
                              {option.description && (
                                <div className="text-sm text-text-secondary">
                                  {option.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Single question format
          <div className="grid md:grid-cols-1 gap-3">
            {currentQuestion.options?.map((option) => {
              const isSelected = getSelectedAnswer(null, option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => handleSubQuestionAnswer(null, option.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-smooth ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}>
                      {isSelected && (
                        <Icon name="Check" size={12} color="white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary mb-1">
                        {option.text}
                      </div>
                      {option.description && (
                        <div className="text-sm text-text-secondary">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
        <div>
          {!isFirst && (
            <Button
              variant="outline"
              onClick={onPrevious}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>
          )}
        </div>
        <div>
          <Button
            variant="default"
            onClick={onNext}
            disabled={!canProceed()}
            iconName={isLast ? "CheckCircle" : "ChevronRight"}
            iconPosition="right"
          >
            {isLast ? 'Complete Assessment' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrakritiAssessment;
