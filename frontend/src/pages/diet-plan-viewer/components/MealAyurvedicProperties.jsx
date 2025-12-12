import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const MealAyurvedicProperties = ({ meal }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get Ayurvedic properties for the meal (from meal data or calculate based on meal name)
  const getAyurvedicProperties = (mealName) => {
    if (!mealName) return null;

    const name = mealName.toLowerCase();
    
    // Default properties - in production, these would come from the meal database
    const defaultProperties = {
      rasa: {
        sweet: name.includes('milk') || name.includes('porridge') || name.includes('pudding') || name.includes('smoothie'),
        sour: name.includes('lemon') || name.includes('yogurt') || name.includes('curd') || name.includes('tamarind'),
        salty: name.includes('soup') || name.includes('curry') || name.includes('dal') || name.includes('sambar'),
        pungent: name.includes('spiced') || name.includes('chili') || name.includes('pepper') || name.includes('ginger'),
        bitter: name.includes('green') || name.includes('leafy') || name.includes('spinach') || name.includes('kale'),
        astringent: name.includes('lentil') || name.includes('dal') || name.includes('legume') || name.includes('bean')
      },
      virya: name.includes('spiced') || name.includes('ginger') || name.includes('pepper') ? 'heating' : 
             name.includes('milk') || name.includes('smoothie') || name.includes('salad') ? 'cooling' : 'neutral',
      vipaka: 'sweet', // Most meals have sweet vipaka
      guna: {
        heavy: name.includes('paneer') || name.includes('cheese') || name.includes('milk'),
        light: name.includes('salad') || name.includes('soup') || name.includes('sprouted'),
        oily: name.includes('fried') || name.includes('curry') || name.includes('tadka'),
        dry: name.includes('roasted') || name.includes('grilled') || name.includes('baked'),
        hot: name.includes('spiced') || name.includes('hot'),
        cold: name.includes('smoothie') || name.includes('salad') || name.includes('cold'),
        smooth: name.includes('soup') || name.includes('porridge') || name.includes('pudding'),
        rough: name.includes('salad') || name.includes('raw'),
        dense: name.includes('bread') || name.includes('roti') || name.includes('rice'),
        liquid: name.includes('soup') || name.includes('smoothie') || name.includes('drink'),
        soft: name.includes('porridge') || name.includes('pudding') || name.includes('soup'),
        hard: name.includes('nuts') || name.includes('seeds'),
        stable: name.includes('rice') || name.includes('bread'),
        mobile: name.includes('liquid') || name.includes('drink'),
        gross: name.includes('heavy') || name.includes('dense'),
        subtle: name.includes('light') || name.includes('soup'),
        clear: name.includes('clear') || name.includes('broth'),
        sticky: name.includes('sticky') || name.includes('gluey')
      },
      doshaEffect: {
        vata: name.includes('warm') || name.includes('spiced') || name.includes('soup') ? 'Balancing' : 'Neutral',
        pitta: name.includes('cooling') || name.includes('sweet') || name.includes('milk') ? 'Balancing' : 'Neutral',
        kapha: name.includes('light') || name.includes('spicy') || name.includes('warm') ? 'Balancing' : 'Neutral'
      },
      prabhava: 'Supports digestive health and overall wellness'
    };

    // Override with meal-specific properties if available
    if (meal?.ayurvedicProperties) {
      return meal.ayurvedicProperties;
    }

    return defaultProperties;
  };

  const properties = getAyurvedicProperties(meal?.name);

  if (!properties) return null;

  const rasaNames = {
    sweet: 'Madhura',
    sour: 'Amla',
    salty: 'Lavana',
    pungent: 'Katu',
    bitter: 'Tikta',
    astringent: 'Kashaya'
  };

  const activeRasas = Object.entries(properties.rasa).filter(([_, present]) => present);

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-smooth"
      >
        <div className="flex items-center space-x-2">
          <Icon name="Leaf" size={16} className="text-success" />
          <span className="text-xs font-medium text-text-primary">Ayurvedic Properties</span>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={14} 
          className="text-text-secondary" 
        />
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-3 text-xs">
          {/* Rasa (Tastes) */}
          {activeRasas.length > 0 && (
            <div>
              <div className="font-medium text-text-primary mb-1.5">Rasa (Tastes)</div>
              <div className="flex flex-wrap gap-1.5">
                {activeRasas.map(([taste, _]) => (
                  <span 
                    key={taste}
                    className="px-2 py-0.5 bg-success/10 text-success rounded border border-success/20 text-xs"
                  >
                    {taste} ({rasaNames[taste]})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Virya (Potency) */}
          <div>
            <div className="font-medium text-text-primary mb-1.5">Virya (Potency)</div>
            <div className="flex items-center space-x-2">
              <Icon 
                name={properties.virya === 'heating' ? 'Flame' : properties.virya === 'cooling' ? 'Snowflake' : 'Circle'} 
                size={14} 
                className={properties.virya === 'heating' ? 'text-error' : properties.virya === 'cooling' ? 'text-primary' : 'text-text-secondary'} 
              />
              <span className="text-text-secondary capitalize">
                {properties.virya === 'heating' ? 'Ushna (Heating)' : 
                 properties.virya === 'cooling' ? 'Shita (Cooling)' : 
                 'Sama (Neutral)'}
              </span>
            </div>
          </div>

          {/* Vipaka */}
          <div>
            <div className="font-medium text-text-primary mb-1.5">Vipaka (Post-digestive)</div>
            <span className="text-text-secondary capitalize">
              {properties.vipaka === 'sweet' ? 'Madhura Vipaka' : 
               properties.vipaka === 'sour' ? 'Amla Vipaka' : 
               'Katu Vipaka'}
            </span>
          </div>

          {/* Guna (Qualities) */}
          <div>
            <div className="font-medium text-text-primary mb-1.5">Guna (Qualities)</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
              {Object.entries(properties.guna)
                .filter(([_, present]) => present)
                .map(([quality, _]) => (
                  <span 
                    key={quality}
                    className="px-2 py-1 bg-success/10 text-success rounded border border-success/20 text-xs text-center"
                  >
                    {quality}
                  </span>
                ))}
            </div>
            {Object.entries(properties.guna).filter(([_, present]) => present).length === 0 && (
              <p className="text-xs text-text-secondary italic">No specific qualities identified</p>
            )}
          </div>

          {/* Dosha Effects */}
          <div>
            <div className="font-medium text-text-primary mb-1.5">Dosha Effects</div>
            <div className="grid grid-cols-3 gap-2">
              <div className={`text-center p-2 rounded border ${
                properties.doshaEffect.vata === 'Balancing' 
                  ? 'bg-success/10 border-success/20' 
                  : properties.doshaEffect.vata === 'Aggravating'
                  ? 'bg-error/10 border-error/20'
                  : 'bg-surface border-border'
              }`}>
                <div className="text-xs font-medium text-text-primary mb-1">Vata</div>
                <div className={`text-xs capitalize ${
                  properties.doshaEffect.vata === 'Balancing' ? 'text-success' :
                  properties.doshaEffect.vata === 'Aggravating' ? 'text-error' :
                  'text-text-secondary'
                }`}>
                  {properties.doshaEffect.vata}
                </div>
              </div>
              <div className={`text-center p-2 rounded border ${
                properties.doshaEffect.pitta === 'Balancing' 
                  ? 'bg-success/10 border-success/20' 
                  : properties.doshaEffect.pitta === 'Aggravating'
                  ? 'bg-error/10 border-error/20'
                  : 'bg-surface border-border'
              }`}>
                <div className="text-xs font-medium text-text-primary mb-1">Pitta</div>
                <div className={`text-xs capitalize ${
                  properties.doshaEffect.pitta === 'Balancing' ? 'text-success' :
                  properties.doshaEffect.pitta === 'Aggravating' ? 'text-error' :
                  'text-text-secondary'
                }`}>
                  {properties.doshaEffect.pitta}
                </div>
              </div>
              <div className={`text-center p-2 rounded border ${
                properties.doshaEffect.kapha === 'Balancing' 
                  ? 'bg-success/10 border-success/20' 
                  : properties.doshaEffect.kapha === 'Aggravating'
                  ? 'bg-error/10 border-error/20'
                  : 'bg-surface border-border'
              }`}>
                <div className="text-xs font-medium text-text-primary mb-1">Kapha</div>
                <div className={`text-xs capitalize ${
                  properties.doshaEffect.kapha === 'Balancing' ? 'text-success' :
                  properties.doshaEffect.kapha === 'Aggravating' ? 'text-error' :
                  'text-text-secondary'
                }`}>
                  {properties.doshaEffect.kapha}
                </div>
              </div>
            </div>
          </div>

          {/* Prabhava (Special Effect) */}
          {properties.prabhava && (
            <div>
              <div className="font-medium text-text-primary mb-1.5">Prabhava (Special Effect)</div>
              <div className="p-2 bg-accent/5 border border-accent/20 rounded-lg">
                <p className="text-xs text-text-primary">{properties.prabhava}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealAyurvedicProperties;
