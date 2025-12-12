import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';

const DietPreferences = ({ preferences, onPreferencesChange }) => {
  const [activeTab, setActiveTab] = useState('diet');

  // Tab configuration - simplified to only show relevant tabs
  const tabs = [
    { id: 'diet', label: 'Diet & Nutrition', icon: 'Utensils' },
    { id: 'medical', label: 'Medical History', icon: 'FileText' },
    { id: 'labs', label: 'Lab Reports', icon: 'FileCheck' }
  ];

  // Option arrays for allowed fields only
  const mealFrequencyOptions = [
    { value: '2', label: '2 meals/day' },
    { value: '3', label: '3 meals/day' },
    { value: '4', label: '4 meals/day' },
    { value: '5', label: '5 meals/day' },
    { value: '6+', label: '6+ meals/day' }
  ];


  const dietTypeOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'non-vegetarian', label: 'Non-Vegetarian' },
    { value: 'vegan', label: 'Vegan' }
  ];

  const snackingHabitOptions = [
    { value: 'none', label: 'No Snacking' },
    { value: 'rare', label: 'Rare' },
    { value: 'occasional', label: 'Occasional' },
    { value: 'frequent', label: 'Frequent' },
    { value: 'constant', label: 'Constant' }
  ];

  const outsideFoodFreqOptions = [
    { value: '0', label: 'Never' },
    { value: '1', label: '1 time/week' },
    { value: '2', label: '2 times/week' },
    { value: '3', label: '3 times/week' },
    { value: '4', label: '4 times/week' },
    { value: '5+', label: '5+ times/week' }
  ];

  const sugarIntakeLevelOptions = [
    { value: 'none', label: 'No Sugar' },
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' }
  ];


  const handlePreferenceChange = (key, value) => {
    onPreferencesChange({
      ...preferences,
      [key]: value
    });
  };

  const renderField = (label, key, type = 'text', options = null, description = null) => {
    if (type === 'select' && options) {
      return (
        <div key={key} className="space-y-2">
          <Select
            label={label}
            description={description}
            options={options}
            value={preferences?.[key] || ''}
            onChange={(value) => handlePreferenceChange(key, value)}
            placeholder={`Select ${label.toLowerCase()}`}
          />
        </div>
      );
    }
    
    if (type === 'number') {
      return (
        <div key={key} className="space-y-2">
          <Input
            type="number"
            label={label}
            description={description}
            value={preferences?.[key] || ''}
            onChange={(e) => handlePreferenceChange(key, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        </div>
      );
    }

    return (
      <div key={key} className="space-y-2">
        <Input
          type={type}
          label={label}
          description={description}
          value={preferences?.[key] || ''}
          onChange={(e) => handlePreferenceChange(key, e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg p-4 sm:p-6 shadow-organic">
      <div className="mb-6">
        <h3 className="font-heading font-semibold text-xl sm:text-2xl text-text-primary mb-2">
          Health & Lifestyle Assessment
        </h3>
        <p className="text-sm sm:text-base text-text-secondary">
          Comprehensive health information for personalized Ayurvedic recommendations
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-t-lg transition-smooth whitespace-nowrap text-xs sm:text-sm ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-muted'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e0 transparent'
      }}>
        {/* 1. Diet & Nutrition */}
        {activeTab === 'diet' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-text-primary mb-4">Diet & Nutrition</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Meal Frequency (per day)', 'meal_frequency_per_day', 'select', mealFrequencyOptions)}
              {renderField('Water Intake', 'water_intake_liters', 'number', null, 'Liters per day')}
              {renderField('Diet Type', 'diet_type', 'select', dietTypeOptions)}
              {renderField('Snacking Habit', 'snacking_habit', 'select', snackingHabitOptions)}
              {renderField('Outside Food Frequency', 'outside_food_freq_per_week', 'select', outsideFoodFreqOptions, 'Times per week')}
              {renderField('Sugar Intake Level', 'sugar_intake_level', 'select', sugarIntakeLevelOptions)}
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-text-primary mb-3 block">Dietary Preferences</label>
              <CheckboxGroup>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Checkbox
                    label="Vegetarian"
                    checked={preferences?.vegetarian || false}
                    onChange={(e) => handlePreferenceChange('vegetarian', e.target.checked)}
                  />
                  <Checkbox
                    label="Vegan"
                    checked={preferences?.vegan || false}
                    onChange={(e) => handlePreferenceChange('vegan', e.target.checked)}
                  />
                  <Checkbox
                    label="Gluten Free"
                    checked={preferences?.gluten_free || false}
                    onChange={(e) => handlePreferenceChange('gluten_free', e.target.checked)}
                  />
                  <Checkbox
                    label="Nut Free"
                    checked={preferences?.nut_free || false}
                    onChange={(e) => handlePreferenceChange('nut_free', e.target.checked)}
                  />
                  <Checkbox
                    label="Diabetic Friendly"
                    checked={preferences?.diabetic_friendly || false}
                    onChange={(e) => handlePreferenceChange('diabetic_friendly', e.target.checked)}
                  />
                  <Checkbox
                    label="Dairy Free"
                    checked={preferences?.dairy_free || false}
                    onChange={(e) => handlePreferenceChange('dairy_free', e.target.checked)}
                  />
                  <Checkbox
                    label="Low Sodium"
                    checked={preferences?.low_sodium || false}
                    onChange={(e) => handlePreferenceChange('low_sodium', e.target.checked)}
                  />
                  <Checkbox
                    label="Ketogenic"
                    checked={preferences?.ketogenic || false}
                    onChange={(e) => handlePreferenceChange('ketogenic', e.target.checked)}
                  />
                </div>
              </CheckboxGroup>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-text-primary mb-3 block">
                Exclude Ingredients
              </label>
              <Input
                type="text"
                value={preferences?.exclude_ingredients || ''}
                onChange={(e) => {
                  // Convert comma-separated string to array
                  const value = e.target.value;
                  const ingredients = value ? value.split(',').map(item => item.trim()).filter(item => item) : [];
                  handlePreferenceChange('exclude_ingredients', ingredients);
                }}
                placeholder="Enter ingredients to exclude (comma-separated, e.g., peanuts, shellfish, dairy)"
                description="Separate multiple ingredients with commas"
              />
            </div>
          </div>
        )}

        {/* 2. Medical History */}
        {activeTab === 'medical' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-text-primary mb-4">Medical History</h4>
            
            <div className="mt-4">
              <label className="text-sm font-medium text-text-primary mb-3 block">Chronic Conditions</label>
              <CheckboxGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Checkbox
                    label="Diabetes"
                    checked={preferences?.has_diabetes || false}
                    onChange={(e) => handlePreferenceChange('has_diabetes', e.target.checked)}
                  />
                  <Checkbox
                    label="Hypertension"
                    checked={preferences?.has_hypertension || false}
                    onChange={(e) => handlePreferenceChange('has_hypertension', e.target.checked)}
                  />
                  <Checkbox
                    label="Obesity"
                    checked={preferences?.has_obesity || false}
                    onChange={(e) => handlePreferenceChange('has_obesity', e.target.checked)}
                  />
                  <Checkbox
                    label="Dyslipidemia"
                    checked={preferences?.has_dyslipidemia || false}
                    onChange={(e) => handlePreferenceChange('has_dyslipidemia', e.target.checked)}
                  />
                  <Checkbox
                    label="Chronic Kidney Disease (CKD)"
                    checked={preferences?.has_ckd || false}
                    onChange={(e) => handlePreferenceChange('has_ckd', e.target.checked)}
                  />
                  <Checkbox
                    label="Celiac Disease"
                    checked={preferences?.has_celiac || false}
                    onChange={(e) => handlePreferenceChange('has_celiac', e.target.checked)}
                  />
                  <Checkbox
                    label="IBS / IBD"
                    checked={preferences?.has_ibs_ibd || false}
                    onChange={(e) => handlePreferenceChange('has_ibs_ibd', e.target.checked)}
                  />
                  <Checkbox
                    label="NAFLD (Non-alcoholic Fatty Liver Disease)"
                    checked={preferences?.has_nafld || false}
                    onChange={(e) => handlePreferenceChange('has_nafld', e.target.checked)}
                  />
                  <Checkbox
                    label="Thyroid"
                    checked={preferences?.has_thyroid || false}
                    onChange={(e) => handlePreferenceChange('has_thyroid', e.target.checked)}
                  />
                  <Checkbox
                    label="PCOS / PCOD"
                    checked={preferences?.has_pcod_pcos || false}
                    onChange={(e) => handlePreferenceChange('has_pcod_pcos', e.target.checked)}
                  />
                </div>
              </CheckboxGroup>
            </div>
          </div>
        )}

        {/* 3. Lab Reports */}
        {activeTab === 'labs' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-text-primary mb-4">Lab Reports (Optional but recommended)</h4>
            <p className="text-sm text-text-secondary mb-4">
              Enter lab test values if available. Leave blank if not tested.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Fasting Blood Sugar (mg/dL)', 'fasting_blood_sugar_mg_dl', 'number', null, 'Enter value in mg/dL')}
              {renderField('Systolic BP', 'systolic_bp', 'number', null, 'Enter systolic blood pressure')}
              {renderField('Diastolic BP', 'diastolic_bp', 'number', null, 'Enter diastolic blood pressure')}
              {renderField('Waist Circumference (cm)', 'waist_circumference_cm', 'number', null, 'Enter waist circumference in cm')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietPreferences;
