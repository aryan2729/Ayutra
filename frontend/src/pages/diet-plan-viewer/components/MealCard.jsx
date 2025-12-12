import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MealCard = ({ meal, onExpand, isExpanded }) => {
  const [showNutrition, setShowNutrition] = useState(false);

  const getDoshaColor = (dosha) => {
    switch (dosha) {
      case 'Vata': return 'text-blue-600 bg-blue-50';
      case 'Pitta': return 'text-red-600 bg-red-50';
      case 'Kapha': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="card-elevated p-6 transition-smooth hover:shadow-organic-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-heading font-semibold text-lg text-text-primary">
              {meal?.name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDoshaColor(meal?.primaryDosha)}`}>
              {meal?.primaryDosha} Balancing
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{meal?.prepTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{meal?.servings} servings</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Flame" size={14} />
              <span>{meal?.calories} cal</span>
            </div>
          </div>
        </div>
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ml-4">
          <Image 
            src={meal?.image} 
            alt={meal?.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNutrition(!showNutrition)}
            iconName="BarChart3"
            iconPosition="left"
          >
            Nutrition
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExpand(meal?.id)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="left"
          >
            {isExpanded ? 'Less' : 'More'}
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" iconName="Share2" />
        </div>
      </div>
      {showNutrition && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-text-primary mb-3">Nutritional Information</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">{meal?.nutrition?.protein}g</div>
              <div className="text-xs text-text-secondary">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-secondary">{meal?.nutrition?.carbs}g</div>
              <div className="text-xs text-text-secondary">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-accent">{meal?.nutrition?.fat}g</div>
              <div className="text-xs text-text-secondary">Fat</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-success">{meal?.nutrition?.fiber}g</div>
              <div className="text-xs text-text-secondary">Fiber</div>
            </div>
          </div>
        </div>
      )}
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-surface rounded-lg">
            <h4 className="font-medium text-text-primary mb-2 flex items-center">
              <Icon name="Lightbulb" size={16} className="mr-2 text-accent" />
              Ayurvedic Benefits
            </h4>
            <p className="text-sm text-text-secondary">
              {meal?.ayurvedicBenefits}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-surface rounded-lg">
              <h4 className="font-medium text-text-primary mb-3 flex items-center">
                <Icon name="ShoppingCart" size={16} className="mr-2 text-primary" />
                Ingredients ({meal?.ingredients?.length})
              </h4>
              <ul className="space-y-1">
                {meal?.ingredients?.slice(0, 5)?.map((ingredient, index) => (
                  <li key={index} className="text-sm text-text-secondary flex items-center">
                    <Icon name="Dot" size={12} className="mr-1" />
                    {ingredient}
                  </li>
                ))}
                {meal?.ingredients?.length > 5 && (
                  <li className="text-sm text-accent">
                    +{meal?.ingredients?.length - 5} more ingredients
                  </li>
                )}
              </ul>
            </div>

            <div className="p-4 bg-surface rounded-lg">
              <h4 className="font-medium text-text-primary mb-3 flex items-center">
                <Icon name="ChefHat" size={16} className="mr-2 text-secondary" />
                Quick Steps
              </h4>
              <ol className="space-y-1">
                {meal?.quickSteps?.map((step, index) => (
                  <li key={index} className="text-sm text-text-secondary flex items-start">
                    <span className="w-4 h-4 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealCard;