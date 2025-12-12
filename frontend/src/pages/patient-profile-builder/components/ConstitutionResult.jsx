import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConstitutionResult = ({ result, onStartDietGeneration, onRetakeAssessment }) => {
  const { primaryDosha, secondaryDosha, constitution, characteristics, recommendations } = result;

  const doshaColors = {
    vata: 'text-blue-600 bg-blue-50 border-blue-200',
    pitta: 'text-red-600 bg-red-50 border-red-200',
    kapha: 'text-green-600 bg-green-50 border-green-200'
  };

  const doshaIcons = {
    vata: 'Wind',
    pitta: 'Flame',
    kapha: 'Droplets'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center bg-brand-gradient rounded-lg p-8 text-white">
        <Icon name="Award" size={48} className="mx-auto mb-4" />
        <h2 className="font-heading font-bold text-2xl mb-2">
          Your Prakriti Assessment Complete!
        </h2>
        <p className="text-white/90">
          Discover your unique Ayurvedic constitution and personalized wellness path
        </p>
      </div>
      {/* Constitution Type */}
      <div className="bg-card rounded-lg shadow-organic border border-border p-6">
        <h3 className="font-heading font-semibold text-xl text-text-primary mb-4">
          Your Constitution Type
        </h3>
        
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className={`px-6 py-3 rounded-lg border-2 ${doshaColors?.[primaryDosha?.toLowerCase()]}`}>
            <div className="flex items-center space-x-2">
              <Icon name={doshaIcons?.[primaryDosha?.toLowerCase()]} size={20} />
              <span className="font-semibold text-lg">{primaryDosha}</span>
              <span className="text-sm">(Primary)</span>
            </div>
          </div>
          
          {secondaryDosha && (
            <>
              <Icon name="Plus" size={16} className="text-text-secondary" />
              <div className={`px-4 py-2 rounded-lg border ${doshaColors?.[secondaryDosha?.toLowerCase()]}`}>
                <div className="flex items-center space-x-2">
                  <Icon name={doshaIcons?.[secondaryDosha?.toLowerCase()]} size={16} />
                  <span className="font-medium">{secondaryDosha}</span>
                  <span className="text-xs">(Secondary)</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-surface rounded-lg p-4 border-l-4 border-accent">
          <h4 className="font-accent font-semibold text-accent mb-2">
            Constitution Type: {constitution}
          </h4>
          <p className="text-text-secondary text-sm leading-relaxed">
            {constitution === "Vata-Pitta" && `You have a dynamic constitution combining the creative, energetic qualities of Vata with the focused, determined nature of Pitta. This makes you naturally innovative and goal-oriented.`}
            {constitution === "Pitta-Kapha" && `Your constitution blends Pitta's intensity and focus with Kapha's stability and endurance. You have natural leadership abilities combined with steady persistence.`}
            {constitution === "Vata-Kapha" && `You combine Vata's creativity and flexibility with Kapha's grounding and stability. This gives you both innovative thinking and practical implementation skills.`}
            {constitution === "Vata" && `You have a predominantly Vata constitution, characterized by creativity, quick thinking, and natural enthusiasm. You thrive on variety and new experiences.`}
            {constitution === "Pitta" && `Your Pitta constitution gives you natural leadership, sharp intellect, and strong determination. You excel at organizing and achieving goals.`}
            {constitution === "Kapha" && `With a Kapha constitution, you possess natural stability, patience, and nurturing qualities. You provide grounding and support to others.`}
          </p>
        </div>
      </div>
      {/* Recommendations */}
      <div className="bg-card rounded-lg shadow-organic border border-border p-6">
        <h3 className="font-heading font-semibold text-xl text-text-primary mb-4">
          Personalized Recommendations
        </h3>
        
        <div className="space-y-4">
          {recommendations?.map((rec, index) => (
            <div key={index} className="border-l-4 border-accent pl-4 py-2">
              <div className="flex items-start space-x-3">
                <Icon name={rec?.icon} size={18} className="text-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-text-primary mb-1">
                    {rec?.category}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {rec?.advice}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Characteristics */}
      <div className="bg-card rounded-lg shadow-organic border border-border p-6">
        <h3 className="font-heading font-semibold text-xl text-text-primary mb-4">
          Your Key Characteristics
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {characteristics?.map((characteristic, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-surface rounded-lg">
              <Icon name="CheckCircle" size={16} className="text-success mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-text-primary text-sm">
                  {characteristic?.trait}
                </p>
                <p className="text-xs text-text-secondary">
                  {characteristic?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          variant="default"
          onClick={onStartDietGeneration}
          iconName="Brain"
          iconPosition="left"
          className="flex-1"
        >
          Generate My Personalized Diet Plan
        </Button>
        
        <Button
          variant="outline"
          onClick={onRetakeAssessment}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Retake Assessment
        </Button>
      </div>
    </div>
  );
};

export default ConstitutionResult;