import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const OnboardingTutorial = ({ userRole, onComplete, userEmail }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('OnboardingTutorial mounted with role:', userRole, 'email:', userEmail);
  }, [userRole, userEmail]);

  // Practitioner tutorial steps
  const practitionerSteps = [
    {
      id: 1,
      title: 'Welcome to Ayutra!',
      description: 'Let\'s walk you through the key features to get started.',
      icon: 'Sparkles',
      route: '/intelligent-dashboard',
      action: 'View Dashboard'
    },
    {
      id: 2,
      title: 'Create Patient Profile',
      description: 'Start by creating a patient profile using the Patient Profile Builder. This captures essential health information and Ayurvedic constitution.',
      icon: 'UserPlus',
      route: '/patient-profile-builder',
      action: 'Go to Patient Profile Builder'
    },
    {
      id: 3,
      title: 'Generate Diet Plan',
      description: 'Use the AI Diet Generator to create personalized diet plans based on the patient\'s profile and Ayurvedic principles.',
      icon: 'Brain',
      route: '/ai-diet-generator',
      action: 'Go to AI Diet Generator'
    },
    {
      id: 4,
      title: 'Review Diet Plan',
      description: 'View and manage the generated diet plan in the Diet Plan Viewer. You can edit meals, add serving sizes, and track patient compliance.',
      icon: 'FileText',
      route: '/diet-plan-viewer',
      action: 'Go to Diet Plan Viewer'
    },
    {
      id: 5,
      title: 'Manage Patient Records',
      description: 'Access all your patient records - both active and archived patients. View profiles, diet plans, and patient history.',
      icon: 'Users',
      route: '/patient-records',
      action: 'Go to Patient Records'
    },
    {
      id: 6,
      title: 'Explore Foods & Nutrients',
      description: 'Use the Food Explorer to discover foods, their Ayurvedic properties, and nutritional information.',
      icon: 'Search',
      route: '/food-explorer',
      action: 'Go to Food Explorer'
    },
    {
      id: 7,
      title: 'Track Patient Progress',
      description: 'Monitor patient progress, compliance, and health metrics through Progress Analytics.',
      icon: 'BarChart3',
      route: '/progress-analytics',
      action: 'Go to Progress Analytics'
    },
    {
      id: 8,
      title: 'Tutorial Complete!',
      description: 'You\'re all set! You can always access these features from the sidebar. Start by creating your first patient profile.',
      icon: 'CheckCircle',
      route: '/intelligent-dashboard',
      action: 'Go to Dashboard'
    }
  ];

  // Patient tutorial steps
  const patientSteps = [
    {
      id: 1,
      title: 'Welcome to Ayutra!',
      description: 'Let\'s help you get started with your health journey.',
      icon: 'Sparkles',
      route: '/intelligent-dashboard',
      action: 'View Dashboard'
    },
    {
      id: 2,
      title: 'Complete Your Profile',
      description: 'Fill out your patient profile with your health information. This helps your practitioner create a personalized plan for you.',
      icon: 'UserPlus',
      route: '/patient-profile-builder',
      action: 'Go to Profile Builder'
    },
    {
      id: 3,
      title: 'View Your Diet Plan',
      description: 'Check your personalized diet plan created by your practitioner. You can see meals, serving sizes, and mark your compliance.',
      icon: 'FileText',
      route: '/diet-plan-viewer',
      action: 'Go to Diet Plan Viewer'
    },
    {
      id: 4,
      title: 'Track Your Progress',
      description: 'Monitor your health progress, compliance with your diet plan, and see your journey through charts and analytics.',
      icon: 'BarChart3',
      route: '/progress-analytics',
      action: 'Go to Progress Analytics'
    },
    {
      id: 5,
      title: 'Explore Foods',
      description: 'Discover foods, their Ayurvedic properties, and nutritional information to make informed dietary choices.',
      icon: 'Search',
      route: '/food-explorer',
      action: 'Go to Food Explorer'
    },
    {
      id: 6,
      title: 'Tutorial Complete!',
      description: 'You\'re all set! Your dashboard is your home base. Check your diet plan regularly and log your progress.',
      icon: 'CheckCircle',
      route: '/intelligent-dashboard',
      action: 'Go to Dashboard'
    }
  ];

  // Normalize role for comparison
  const normalizedRole = userRole ? String(userRole).toLowerCase().trim() : '';
  const isPatient = normalizedRole === 'patient';
  const steps = isPatient ? patientSteps : practitionerSteps;
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Debug logging
  useEffect(() => {
    console.log('OnboardingTutorial - Role check:', {
      userRole,
      normalizedRole,
      isPatient,
      stepsCount: steps.length
    });
  }, [userRole, normalizedRole, isPatient, steps.length]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleNavigate = () => {
    const step = steps[currentStep];
    if (step.route) {
      navigate(step.route);
    }
  };

  const handleComplete = () => {
    // Mark tutorial as completed in localStorage - use email if available for per-user tracking
    if (userEmail) {
      localStorage.setItem(`tutorial_completed_${userEmail}`, 'true');
      console.log('Tutorial marked as completed for user:', userEmail);
    } else {
      // Fallback to role-based if no email
      const roleKey = normalizedRole || 'patient';
      localStorage.setItem(`tutorial_completed_${roleKey}`, 'true');
      console.log('Tutorial marked as completed for role:', roleKey);
    }
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  };

  if (!isVisible) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-organic border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-brand-gradient rounded-full flex items-center justify-center">
                <Icon name={currentStepData.icon} size={24} color="white" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl text-text-primary">
                  {currentStepData.title}
                </h2>
                <p className="text-sm text-text-secondary">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-text-secondary leading-relaxed mb-6">
            {currentStepData.description}
          </p>

          {/* Step Indicators */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-primary w-8'
                    : index < currentStep
                    ? 'bg-success'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {currentStepData.route && !isLastStep && (
                <Button
                  variant="outline"
                  onClick={handleNavigate}
                  iconName="ExternalLink"
                >
                  {currentStepData.action}
                </Button>
              )}
              <Button
                variant="default"
                onClick={handleNext}
                iconName={isLastStep ? 'CheckCircle' : 'ChevronRight'}
                iconPosition="right"
              >
                {isLastStep ? 'Get Started' : 'Next'}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Tips */}
        {!isLastStep && (
          <div className="p-4 bg-muted/50 border-t border-border">
            <div className="flex items-start space-x-2">
              <Icon name="Lightbulb" size={16} className="text-accent mt-0.5 flex-shrink-0" />
              <p className="text-xs text-text-secondary">
                <span className="font-medium">Tip:</span> You can skip this tutorial anytime and access it later from the help menu.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingTutorial;
