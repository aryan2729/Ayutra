import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FoodDetailModal = ({ food, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !food) return null;

  const getDoshaColor = (dosha) => {
    const colors = {
      'vata-balancing': 'text-blue-600 bg-blue-50 border-blue-200',
      'pitta-balancing': 'text-red-600 bg-red-50 border-red-200',
      'kapha-balancing': 'text-green-600 bg-green-50 border-green-200',
      'tridoshic': 'text-purple-600 bg-purple-50 border-purple-200'
    };
    return colors?.[dosha] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getTasteColor = (taste) => {
    const colors = {
      'sweet': 'bg-pink-100 text-pink-700 border-pink-200',
      'sour': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'salty': 'bg-blue-100 text-blue-700 border-blue-200',
      'pungent': 'bg-red-100 text-red-700 border-red-200',
      'bitter': 'bg-green-100 text-green-700 border-green-200',
      'astringent': 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors?.[taste] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'nutrition', label: 'Nutrition', icon: 'BarChart3' },
    { id: 'ayurvedic', label: 'Ayurvedic Properties', icon: 'Leaf' },
    { id: 'usage', label: 'Usage & Preparation', icon: 'ChefHat' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="font-heading font-semibold text-lg text-text-primary mb-3">
          About {food?.name}
        </h3>
        <p className="text-text-secondary leading-relaxed mb-4">
          {food?.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Scientific Name:</span>
              <span className="font-medium text-text-primary">{food?.scientificName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Category:</span>
              <span className="font-medium text-text-primary">{food?.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Origin:</span>
              <span className="font-medium text-text-primary">{food?.origin}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Best Season:</span>
              <span className="font-medium text-text-primary capitalize">{food?.bestSeason}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Availability:</span>
              <span className="font-medium text-text-primary capitalize">{food?.availability}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Rating:</span>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} className="text-accent" />
                <span className="font-medium text-text-primary">{food?.rating}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      {food?.keyBenefits && (
        <div>
          <h4 className="font-medium text-text-primary mb-3">Key Health Benefits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {food?.keyBenefits?.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-success/5 rounded-lg">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-sm text-text-primary">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dietary Information */}
      {food?.dietaryTags && (
        <div>
          <h4 className="font-medium text-text-primary mb-3">Dietary Information</h4>
          <div className="flex flex-wrap gap-2">
            {food?.dietaryTags?.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-success/10 text-success text-sm font-medium rounded-full border border-success/20">
                <Icon name="Check" size={12} className="inline mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderNutrition = () => (
    <div className="space-y-6">
      <h3 className="font-heading font-semibold text-lg text-text-primary">
        Nutritional Information (per 100g)
      </h3>
      
      {/* Macronutrients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-muted rounded-lg text-center">
          <div className="text-2xl font-bold text-brand-primary">{food?.nutrition?.calories}</div>
          <div className="text-sm text-text-secondary">Calories</div>
        </div>
        <div className="p-4 bg-muted rounded-lg text-center">
          <div className="text-2xl font-bold text-brand-primary">{food?.nutrition?.protein}g</div>
          <div className="text-sm text-text-secondary">Protein</div>
        </div>
        <div className="p-4 bg-muted rounded-lg text-center">
          <div className="text-2xl font-bold text-brand-primary">{food?.nutrition?.carbs}g</div>
          <div className="text-sm text-text-secondary">Carbohydrates</div>
        </div>
        <div className="p-4 bg-muted rounded-lg text-center">
          <div className="text-2xl font-bold text-brand-primary">{food?.nutrition?.fat}g</div>
          <div className="text-sm text-text-secondary">Fat</div>
        </div>
      </div>

      {/* Detailed Nutrition */}
      {food?.nutrition?.detailed && (
        <div>
          <h4 className="font-medium text-text-primary mb-3">Detailed Nutritional Profile</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(food?.nutrition?.detailed)?.map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-surface rounded-lg">
                <span className="text-text-secondary capitalize">{key?.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-medium text-text-primary">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nutritional Benefits */}
      {food?.nutritionalBenefits && (
        <div>
          <h4 className="font-medium text-text-primary mb-3">Nutritional Benefits</h4>
          <div className="space-y-2">
            {food?.nutritionalBenefits?.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 bg-surface rounded-lg">
                <Icon name="Zap" size={16} className="text-accent mt-0.5" />
                <span className="text-sm text-text-primary">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAyurvedic = () => (
    <div className="space-y-6">
      <h3 className="font-heading font-semibold text-lg text-text-primary">
        Ayurvedic Properties & Effects
      </h3>

      {/* Dosha Effect */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Dosha Effect</h4>
        <div className={`p-4 rounded-lg border ${getDoshaColor(food?.doshaEffect)}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Circle" size={16} />
            <span className="font-medium capitalize">
              {food?.doshaEffect?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
            </span>
          </div>
          <p className="text-sm">
            {food?.doshaDescription || `This food has a ${food?.doshaEffect} effect on the body's constitution.`}
          </p>
        </div>
      </div>

      {/* Six Tastes */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Rasa (Six Tastes)</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {food?.tastes?.map((taste, index) => (
            <div key={index} className={`p-3 rounded-lg border text-center ${getTasteColor(taste)}`}>
              <div className="font-medium capitalize">{taste}</div>
              <div className="text-xs mt-1">
                {taste === 'sweet' && 'Madhura'}
                {taste === 'sour' && 'Amla'}
                {taste === 'salty' && 'Lavana'}
                {taste === 'pungent' && 'Katu'}
                {taste === 'bitter' && 'Tikta'}
                {taste === 'astringent' && 'Kashaya'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Virya (Potency) */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Virya (Potency)</h4>
        <div className="flex items-center space-x-4 p-4 bg-surface rounded-lg">
          <Icon 
            name={food?.potency === 'heating' ? 'Flame' : 'Snowflake'} 
            size={24} 
            className={food?.potency === 'heating' ? 'text-red-500' : 'text-blue-500'} 
          />
          <div>
            <div className="font-medium text-text-primary capitalize">{food?.potency}</div>
            <div className="text-sm text-text-secondary">
              {food?.potency === 'heating' ? 'Ushna - Increases body heat and metabolism' : 'Shita - Cooling and calming effect'}
            </div>
          </div>
        </div>
      </div>

      {/* Prabhava (Special Effect) */}
      {food?.prabhava && (
        <div>
          <h4 className="font-medium text-text-primary mb-3">Prabhava (Special Effect)</h4>
          <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <p className="text-text-primary">{food?.prabhava}</p>
          </div>
        </div>
      )}

      {/* Ayurvedic Uses */}
      {food?.ayurvedicUses && (
        <div>
          <h4 className="font-medium text-text-primary mb-3">Traditional Ayurvedic Uses</h4>
          <div className="space-y-2">
            {food?.ayurvedicUses?.map((use, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 bg-surface rounded-lg">
                <Icon name="Leaf" size={16} className="text-brand-primary mt-0.5" />
                <span className="text-sm text-text-primary">{use}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderUsage = () => (
    <div className="space-y-6">
      <h3 className="font-heading font-semibold text-lg text-text-primary">
        Usage & Preparation Guidelines
      </h3>

      {/* Preparation Methods */}
      {food?.preparationMethods && (
        <div>
          <h4 className="font-medium text-text-primary mb-3">Preparation Methods</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {food?.preparationMethods?.map((method, index) => (
              <div key={index} className="p-4 bg-surface rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="ChefHat" size={16} className="text-brand-primary" />
                  <span className="font-medium text-text-primary">{method?.name}</span>
                </div>
                <p className="text-sm text-text-secondary">{method?.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Serving Suggestions */}
      {food?.servingSuggestions && (
        <div>
          <h4 className="font-medium text-text-primary mb-3">Serving Suggestions</h4>
          <div className="space-y-2">
            {food?.servingSuggestions?.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 bg-surface rounded-lg">
                <Icon name="Utensils" size={16} className="text-accent mt-0.5" />
                <span className="text-sm text-text-primary">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Storage Instructions */}
      {food?.storage && (
        <div>
          <h4 className="font-medium text-text-primary mb-3">Storage Instructions</h4>
          <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Package" size={16} className="text-warning mt-0.5" />
              <p className="text-sm text-text-primary">{food?.storage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contraindications */}
      {food?.contraindications && (
        <div>
          <h4 className="font-medium text-text-primary mb-3">Precautions & Contraindications</h4>
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-destructive mt-0.5" />
              <div className="space-y-1">
                {food?.contraindications?.map((item, index) => (
                  <p key={index} className="text-sm text-text-primary">{item}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-organic max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={food?.image}
                alt={food?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-text-primary">
                {food?.name}
              </h2>
              <p className="text-text-secondary">{food?.scientificName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-0 p-6 pb-0">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab?.id
                    ? 'border-brand-primary text-brand-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'nutrition' && renderNutrition()}
          {activeTab === 'ayurvedic' && renderAyurvedic()}
          {activeTab === 'usage' && renderUsage()}
        </div>
      </div>
    </div>
  );
};

export default FoodDetailModal;