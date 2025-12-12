import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const PersonalInfoForm = ({ formData, onFormDataChange, onNext, errors }) => {
  const ageOptions = Array.from({ length: 83 }, (_, i) => ({
    value: (i + 18)?.toString(),
    label: `${i + 18} years`
  }));

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const healthGoalOptions = [
    { value: 'weight-loss', label: 'Weight Loss' },
    { value: 'weight-gain', label: 'Weight Gain' },
    { value: 'maintain-weight', label: 'Maintain Weight' },
    { value: 'improve-digestion', label: 'Improve Digestion' },
    { value: 'increase-energy', label: 'Increase Energy' },
    { value: 'better-sleep', label: 'Better Sleep' },
    { value: 'stress-management', label: 'Stress Management' },
    { value: 'overall-wellness', label: 'Overall Wellness' }
  ];

  const handleInputChange = (field, value) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  const canProceed = formData?.fullName && formData?.email && formData?.age && 
                    formData?.gender && formData?.healthGoals?.length > 0 && 
                    formData?.termsAccepted;

  return (
    <div className="bg-card rounded-lg shadow-organic border border-border p-8">
      <div className="mb-6">
        <h3 className="font-heading font-semibold text-xl text-text-primary mb-2">
          Personal Information
        </h3>
        <p className="text-text-secondary">
          Help us understand your basic profile to create a personalized Ayurvedic assessment
        </p>
      </div>
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData?.fullName}
            onChange={(e) => handleInputChange('fullName', e?.target?.value)}
            error={errors?.fullName}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            description="We'll send your results here"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Age"
            placeholder="Select your age"
            options={ageOptions}
            value={formData?.age}
            onChange={(value) => handleInputChange('age', value)}
            error={errors?.age}
            required
            searchable
          />
          
          <Select
            label="Gender"
            placeholder="Select gender"
            options={genderOptions}
            value={formData?.gender}
            onChange={(value) => handleInputChange('gender', value)}
            error={errors?.gender}
            required
          />
        </div>

        {/* Physical Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Height (cm)"
            type="number"
            placeholder="170"
            value={formData?.height}
            onChange={(e) => handleInputChange('height', e?.target?.value)}
            error={errors?.height}
            min="100"
            max="250"
          />
          
          <Input
            label="Weight (kg)"
            type="number"
            placeholder="70"
            value={formData?.weight}
            onChange={(e) => handleInputChange('weight', e?.target?.value)}
            error={errors?.weight}
            min="30"
            max="200"
          />
        </div>

        {/* Health Goals */}
        <Select
          label="Health Goals"
          placeholder="Select your health goals"
          options={healthGoalOptions}
          value={formData?.healthGoals}
          onChange={(value) => handleInputChange('healthGoals', value)}
          error={errors?.healthGoals}
          description="You can select multiple goals"
          multiple
          required
        />

        {/* Terms and Conditions */}
        <div className="bg-surface rounded-lg p-4">
          <Checkbox
            label="I agree to the Terms of Service and Privacy Policy"
            description="By proceeding, you consent to the collection and use of your health information for personalized recommendations"
            checked={formData?.termsAccepted}
            onChange={(e) => handleInputChange('termsAccepted', e?.target?.checked)}
            error={errors?.termsAccepted}
            required
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <Button
            variant="default"
            onClick={onNext}
            disabled={!canProceed}
            iconName="ChevronRight"
            iconPosition="right"
          >
            Start Prakriti Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;