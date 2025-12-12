import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StepIndicator from './components/StepIndicator';
import PatientSelector from './components/PatientSelector';
import DietPreferences from './components/DietPreferences';
import AIGenerationEngine from './components/AIGenerationEngine';
import PlanPreview from './components/PlanPreview';
import { patientAPI } from '../../services/api';

const AIDietGenerator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get('patient');
  const { data, status, loading } = useSession();
  const userRole = data?.user?.role;
  
  // All hooks must be called before any conditional returns
  // Check for recently created patient from localStorage (for auto-selection)
  const getRecentlyCreatedPatient = () => {
    if (patientIdFromUrl) return null; // URL param takes precedence
    
    try {
      const recentlyCreated = localStorage.getItem('recently_created_patient');
      if (recentlyCreated) {
        const patientData = JSON.parse(recentlyCreated);
        // Check if patient was created within last 5 minutes (to avoid stale data)
        const createdTime = new Date(patientData.timestamp);
        const now = new Date();
        const minutesDiff = (now - createdTime) / (1000 * 60);
        
        if (minutesDiff < 5) {
          return {
            id: `temp-${Date.now()}`, // Temporary ID for newly created patient
            name: patientData.name,
            email: patientData.email,
            age: patientData.age,
            gender: patientData.gender,
            constitution: patientData.constitution || patientData.prakriti
          };
        } else {
          // Stale data, remove it
          localStorage.removeItem('recently_created_patient');
        }
      }
    } catch (error) {
      console.error('Error parsing recently created patient:', error);
      localStorage.removeItem('recently_created_patient');
    }
    return null;
  };
  
  const recentlyCreatedPatient = getRecentlyCreatedPatient();
  
  // If patient ID is in URL, start at step 2 (skip patient selection)
  // If recently created patient exists, also start at step 2
  const [currentStep, setCurrentStep] = useState(
    patientIdFromUrl || recentlyCreatedPatient ? 2 : 1
  );
  const [selectedPatient, setSelectedPatient] = useState(recentlyCreatedPatient || null);
  const [loadingPatient, setLoadingPatient] = useState(!!patientIdFromUrl);
  
  // Check for recently created patient on mount and auto-select
  useEffect(() => {
    if (recentlyCreatedPatient && !patientIdFromUrl) {
      // Auto-select this patient and skip to step 2
      setSelectedPatient(recentlyCreatedPatient);
      setCurrentStep(2);
      // Clear the flag so it doesn't auto-select again
      localStorage.removeItem('recently_created_patient');
    }
  }, []); // Only run on mount
  // Allowed fields only - matching exact backend key names
  const [preferences, setPreferences] = useState({
    // Basic Info (from patient profile)
    gender: '',
    age: '',
    height_cm: '',
    weight_kg: '',
    bmi: '',
    patient_continent: '',
    patient_country: '',
    patient_region: '',
    
    // Diet & Nutrition
    meal_frequency_per_day: '',
    water_intake_liters: '',
    diet_type: '',
    snacking_habit: '',
    outside_food_freq_per_week: '',
    sugar_intake_level: '',
    vegetarian: false,
    vegan: false,
    gluten_free: false,
    nut_free: false,
    diabetic_friendly: false,
    dairy_free: false,
    low_sodium: false,
    ketogenic: false,
    exclude_ingredients: [],
    
    // Digestion
    bowel_pattern: '',
    bowel_movements_per_day: '',
    has_acidity_reflux: false,
    
    // Sleep & Mental
    sleep_hours: '',
    stress_level: '',
    
    // Lifestyle
    physical_activity_minutes: '',
    activity_level: '',
    season: '',
    therapeutic_goal: '',
    daily_calories: '',
    
    // Medical History
    has_diabetes: false,
    has_hypertension: false,
    has_obesity: false,
    has_dyslipidemia: false,
    has_ckd: false,
    has_celiac: false,
    has_ibs_ibd: false,
    has_nafld: false,
    has_thyroid: false,
    has_pcod_pcos: false,
    
    // Lab Reports
    fasting_blood_sugar_mg_dl: '',
    systolic_bp: '',
    diastolic_bp: '',
    waist_circumference_cm: '',
    
    // Prakriti (from assessment)
    prakriti: '',
    vata_state: '',
    pitta_state: '',
    kapha_state: ''
  });
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch patient data if patient ID is provided in URL
  useEffect(() => {
    const fetchPatientFromUrl = async () => {
      if (!patientIdFromUrl) return;

      setLoadingPatient(true);
      try {
        const response = await patientAPI.getById(patientIdFromUrl);
        if (response?.data?.success) {
          const patient = response.data.data?.patient;
          setSelectedPatient({
            id: patient._id || patient.id,
            name: patient.user?.name || 'Unknown Patient',
            email: patient.user?.email || '',
            age: patient.age,
            gender: patient.gender,
            constitution: patient.prakriti || patient.constitution
          });
          // Auto-advance to step 2 (Diet Preferences)
          setCurrentStep(2);
        } else {
          console.error('Failed to fetch patient');
          // If patient not found, go back to step 1
          setCurrentStep(1);
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
        // If error, go back to step 1
        setCurrentStep(1);
      } finally {
        setLoadingPatient(false);
      }
    };

    fetchPatientFromUrl();
  }, [patientIdFromUrl]);

  // Show loading state while checking authentication or loading patient
  if (loading || status === 'loading' || loadingPatient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">
            {loadingPatient ? 'Loading patient data...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === 'unauthenticated' || !data?.session) {
    navigate('/login');
    return null;
  }

  // Check if user is a Patient - show restricted access
  if (userRole === 'Patient') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Icon name="Lock" size={40} className="text-text-secondary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Access Restricted
          </h1>
          <p className="text-lg text-text-secondary mb-8">
            This page is only available for practitioners and administrators.
          </p>
          <Button
            variant="default"
            onClick={() => navigate('/intelligent-dashboard')}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Steps configuration - if patient is pre-selected, skip step 1
  const allSteps = [
    {
      id: 1,
      title: "Select Patient",
      description: "Choose the patient for whom you want to generate a diet plan"
    },
    {
      id: 2,
      title: "Health & Lifestyle Assessment",
      description: "Configure dietary restrictions, allergies, and food preferences"
    },
    {
      id: 3,
      title: "AI Generation",
      description: "Let our AI create a personalized Ayurvedic diet plan"
    },
    {
      id: 4,
      title: "Review & Approve",
      description: "Review the generated plan and make any necessary adjustments"
    }
  ];

  // If patient is pre-selected (from URL or recently created), skip step 1
  const steps = selectedPatient && (patientIdFromUrl || recentlyCreatedPatient)
    ? allSteps.filter(step => step.id !== 1).map((step, index) => ({ ...step, displayNumber: index + 1 }))
    : allSteps;

  const handleNextStep = () => {
    // If patient is pre-selected, step 2 is actually step 2, step 3 is step 3, etc.
    // But if not pre-selected, step 1 -> step 2, step 2 -> step 3, etc.
    const maxStep = selectedPatient && patientIdFromUrl ? 4 : 4; // Both have 4 total steps
    if (currentStep < maxStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    // If patient is pre-selected (from URL or recently created), can't go back to step 1 (it doesn't exist)
    const minStep = selectedPatient && (patientIdFromUrl || recentlyCreatedPatient) ? 2 : 1;
    if (currentStep > minStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handlePreferencesChange = (newPreferences) => {
    setPreferences(newPreferences);
  };

  // Sanitizer function to ensure only allowed fields are sent to backend
  const sanitizePreferences = (prefs) => {
    const allowedKeys = [
      'gender', 'age', 'height_cm', 'weight_kg', 'bmi', 'patient_continent', 'patient_country', 'patient_region',
      'meal_frequency_per_day', 'water_intake_liters', 'bowel_pattern', 'bowel_movements_per_day',
      'sleep_hours', 'stress_level', 'physical_activity_minutes', 'diet_type', 'snacking_habit',
      'outside_food_freq_per_week', 'sugar_intake_level', 'prakriti', 'vata_state', 'pitta_state', 'kapha_state',
      'has_diabetes', 'has_hypertension', 'has_obesity', 'has_dyslipidemia', 'has_acidity_reflux', 'has_ckd',
      'has_celiac', 'has_ibs_ibd', 'has_nafld', 'has_thyroid', 'has_pcod_pcos',
      'fasting_blood_sugar_mg_dl', 'systolic_bp', 'diastolic_bp', 'waist_circumference_cm',
      'activity_level', 'season', 'therapeutic_goal', 'daily_calories',
      'vegetarian', 'vegan', 'gluten_free', 'nut_free', 'diabetic_friendly', 'dairy_free', 'low_sodium', 'ketogenic',
      'exclude_ingredients'
    ];

    const sanitized = {};
    allowedKeys.forEach(key => {
      if (prefs.hasOwnProperty(key)) {
        sanitized[key] = prefs[key];
      }
    });

    return sanitized;
  };

  const handleGenerationComplete = (plan) => {
    setGeneratedPlan(plan);
    setCurrentStep(4);
  };

  const handleApprovePlan = () => {
    // Navigate to diet plan viewer with the generated plan
    navigate('/diet-plan-viewer', { state: { plan: generatedPlan } });
  };

  const handleModifyPreferences = () => {
    setCurrentStep(2);
  };

  const handleRegeneratePlan = () => {
    setGeneratedPlan(null);
    setCurrentStep(3);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedPatient !== null;
      case 2:
        return true; // Preferences are optional
      case 3:
        return generatedPlan !== null;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/intelligent-dashboard')}
                iconName="ArrowLeft"
              >
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <div>
                <h1 className="font-heading font-bold text-2xl text-text-primary">
                  AI Diet Generator
                </h1>
                <p className="text-text-secondary">
                  Create personalized Ayurvedic diet plans with AI-powered intelligence
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Brain" size={16} className="text-primary" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Leaf" size={16} className="text-success" />
                <span>Ayurvedic Principles</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Shield" size={16} className="text-accent" />
                <span>Clinically Validated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <StepIndicator 
          currentStep={currentStep} 
          totalSteps={steps?.length} 
          steps={steps} 
        />

        {/* Main Content */}
        <div className="space-y-8">
          {currentStep === 1 && (
            <PatientSelector
              onPatientSelect={handlePatientSelect}
              selectedPatient={selectedPatient}
            />
          )}

          {currentStep === 2 && (
            <DietPreferences
              preferences={preferences}
              onPreferencesChange={handlePreferencesChange}
            />
          )}

          {currentStep === 3 && (
            <AIGenerationEngine
              patient={selectedPatient}
              preferences={sanitizePreferences(preferences)}
              onGenerationComplete={handleGenerationComplete}
            />
          )}

          {currentStep === 4 && generatedPlan && (
            <PlanPreview
              plan={generatedPlan}
              onApprove={handleApprovePlan}
              onModify={handleModifyPreferences}
              onRegenerate={handleRegeneratePlan}
            />
          )}

          {/* Navigation Controls */}
          {currentStep !== 3 && (
            <div className="flex justify-between items-center pt-6 border-t border-border">
              <div>
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    iconName="ChevronLeft"
                    iconPosition="left"
                  >
                    Previous Step
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {currentStep < 3 && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/intelligent-dashboard')}
                    >
                      Save & Exit
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleNextStep}
                      disabled={!canProceedToNext()}
                      iconName="ChevronRight"
                      iconPosition="right"
                    >
                      {currentStep === 2 ? 'Generate Plan' : 'Next Step'}
                    </Button>
                  </>
                )}
                
                {currentStep === 4 && (
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/intelligent-dashboard')}
                    >
                      Return to Dashboard
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleApprovePlan}
                      iconName="CheckCircle"
                    >
                      Save & View Plan
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help & Support */}
        <div className="mt-12 bg-muted rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="HelpCircle" size={20} color="white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-text-primary mb-2">
                Need Help with Diet Generation?
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                Our AI diet generator uses advanced algorithms combined with traditional Ayurvedic principles 
                to create personalized meal plans. Each recommendation is based on your patient's unique 
                constitution, health conditions, and dietary preferences.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" iconName="Book">
                  View Guide
                </Button>
                <Button variant="outline" size="sm" iconName="MessageCircle">
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" iconName="Video">
                  Watch Tutorial
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-text-secondary">
          <p>
            Powered by Ayutra AI Engine • Confidence scoring based on 10,000+ validated meal plans
          </p>
          <p className="mt-1">
            All recommendations should be reviewed by qualified practitioners before implementation
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIDietGenerator;