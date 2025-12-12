import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PlanPreview = ({ plan, onApprove, onModify, onRegenerate }) => {
  const [activeTab, setActiveTab] = useState('ayurvedic');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: []
  });

  // Initialize selected meals when plan changes
  useEffect(() => {
    if (plan?.meals) {
      setSelectedMeals({
        breakfast: [],
        lunch: [],
        dinner: []
      });
    }
  }, [plan]);

  if (!plan) return null;

  const tabs = [
    { id: 'ayurvedic', label: 'Ayurvedic Balance', icon: 'Leaf' },
    { id: 'meals', label: 'Meal Plans', icon: 'Utensils' },
    { id: 'nutrition', label: 'Nutrition', icon: 'BarChart3' },
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' }
  ];

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: 'Sunrise', color: 'text-yellow-600' },
    { key: 'lunch', label: 'Lunch', icon: 'Sun', color: 'text-orange-600' },
    { key: 'dinner', label: 'Dinner', icon: 'Moon', color: 'text-blue-600' }
  ];

  const handleMealSelection = (mealType, mealId, isSelected) => {
    setSelectedMeals(prev => {
      const current = prev[mealType] || [];
      if (isSelected) {
        return {
          ...prev,
          [mealType]: [...current, mealId]
        };
      } else {
        return {
          ...prev,
          [mealType]: current.filter(id => id !== mealId)
        };
      }
    });
  };

  const handleApproveWithSelection = () => {
    const finalPlan = {
      ...plan,
      selectedMeals: selectedMeals
    };
    onApprove(finalPlan);
  };

  const MealCard = ({ meal, mealType, mealTypeKey }) => {
    const isSelected = selectedMeals[mealTypeKey]?.includes(meal?.id);
    
    return (
      <div 
        className={`bg-surface rounded-lg p-4 border-2 transition-smooth ${
          isSelected 
            ? 'border-primary bg-primary/5 shadow-organic' 
            : 'border-border hover:shadow-organic-hover hover:border-primary/50'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleMealSelection(mealTypeKey, meal?.id, !isSelected);
              }}
              className="mt-1 flex-shrink-0 cursor-pointer"
            >
              <Checkbox
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  handleMealSelection(mealTypeKey, meal?.id, e.target.checked);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div 
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => setSelectedMeal({ ...meal, type: mealType })}
            >
              <h5 className="font-medium text-text-primary">{meal?.name}</h5>
            </div>
          </div>
          <span className="text-sm text-text-secondary ml-2 flex-shrink-0">{meal?.calories} cal</span>
        </div>
        
        <div 
          className="flex items-center space-x-4 mb-3 text-sm text-text-secondary cursor-pointer flex-wrap gap-2"
          onClick={() => setSelectedMeal({ ...meal, type: mealType })}
        >
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>{meal?.prepTime}</span>
          </div>
          {meal?.servingSize && (
            <div className="flex items-center space-x-1">
              <Icon name="Ruler" size={14} />
              <span>{meal?.servingSize}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Icon name="Leaf" size={14} />
            <span>{meal?.ayurvedicProperties?.join(', ')}</span>
          </div>
        </div>
        
        <div 
          className="flex flex-wrap gap-1 cursor-pointer"
          onClick={() => setSelectedMeal({ ...meal, type: mealType })}
        >
          {meal?.ingredients?.slice(0, 4)?.map((ingredient, index) => (
            <span key={index} className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-md">
              {ingredient}
            </span>
          ))}
          {meal?.ingredients?.length > 4 && (
            <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-md">
              +{meal?.ingredients?.length - 4} more
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg shadow-organic">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-semibold text-xl text-text-primary mb-2">
              Generated Diet Plan Preview
            </h3>
            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{plan?.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="TrendingUp" size={14} />
                <span>{plan?.confidence}% Confidence</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>Generated {new Date(plan.generatedAt)?.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
            <Button variant="outline" size="sm" iconName="Share">
              Share
            </Button>
          </div>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="px-6 pt-4">
        <div className="flex space-x-1 border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-smooth ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="text-sm font-medium">{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Target" size={20} className="text-primary" />
                  <h4 className="font-medium text-text-primary">Daily Calories</h4>
                </div>
                <p className="text-2xl font-bold text-primary">{plan?.totalCalories}</p>
                <p className="text-sm text-text-secondary">Optimized for your goals</p>
              </div>
              
              <div className="bg-surface rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Utensils" size={20} className="text-accent" />
                  <h4 className="font-medium text-text-primary">Meal Options</h4>
                </div>
                <p className="text-2xl font-bold text-accent">
                  {Object.values(plan?.meals)?.flat()?.length}
                </p>
                <p className="text-sm text-text-secondary">Recipes to choose from</p>
              </div>
              
              <div className="bg-surface rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Leaf" size={20} className="text-success" />
                  <h4 className="font-medium text-text-primary">Ayurvedic Balance</h4>
                </div>
                <p className="text-2xl font-bold text-success">{plan?.confidence}%</p>
                <p className="text-sm text-text-secondary">Constitution aligned</p>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium text-text-primary mb-3">Key Recommendations</h4>
              <div className="space-y-2">
                {plan?.recommendations?.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-text-secondary">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'meals' && (
          <div className="space-y-8">
            {mealTypes?.map((mealType) => {
              const meals = plan?.meals?.[mealType?.key] || [];
              const selectedCount = selectedMeals[mealType?.key]?.length || 0;
              
              return (
                <div key={mealType?.key}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={mealType?.icon} size={20} className={mealType?.color} />
                      <h4 className="font-medium text-text-primary">{mealType?.label} Options</h4>
                      <span className="text-sm text-text-secondary">
                        ({meals.length} recipes available)
                      </span>
                    </div>
                    {selectedCount > 0 && (
                      <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
                        <Icon name="CheckCircle" size={14} />
                        <span className="text-sm font-medium">{selectedCount} selected</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2" style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e0 transparent'
                  }}>
                    {meals.map((meal, index) => (
                      <MealCard 
                        key={meal?.id || index} 
                        meal={meal} 
                        mealType={mealType?.label}
                        mealTypeKey={mealType?.key}
                      />
                    ))}
                  </div>
                  
                  {meals.length === 0 && (
                    <div className="text-center py-8 text-text-secondary">
                      <Icon name="Utensils" size={32} className="mx-auto mb-2 opacity-50" />
                      <p>No {mealType?.label.toLowerCase()} options available</p>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Selection Summary */}
            <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
              <h5 className="font-medium text-text-primary mb-3">Selection Summary</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Breakfast:</span>
                  <span className="ml-2 font-medium text-text-primary">
                    {selectedMeals.breakfast.length} selected
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Lunch:</span>
                  <span className="ml-2 font-medium text-text-primary">
                    {selectedMeals.lunch.length} selected
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Dinner:</span>
                  <span className="ml-2 font-medium text-text-primary">
                    {selectedMeals.dinner.length} selected
                  </span>
                </div>
              </div>
              {selectedMeals.breakfast.length === 0 && selectedMeals.lunch.length === 0 && selectedMeals.dinner.length === 0 && (
                <p className="text-xs text-text-secondary mt-2 italic">
                  Select meals from each category to create the final diet plan
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-3">Macronutrients</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Carbohydrates</span>
                    <span className="font-medium">{plan?.macros?.carbs}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${plan?.macros?.carbs}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Protein</span>
                    <span className="font-medium">{plan?.macros?.protein}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full" 
                      style={{ width: `${plan?.macros?.protein}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Fat</span>
                    <span className="font-medium">{plan?.macros?.fat}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full" 
                      style={{ width: `${plan?.macros?.fat}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-surface rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-3">Daily Targets</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Calories</span>
                    <span className="font-medium">{plan?.totalCalories}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Protein</span>
                    <span className="font-medium">{Math.round(plan?.totalCalories * plan?.macros?.protein / 100 / 4)}g</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Carbs</span>
                    <span className="font-medium">{Math.round(plan?.totalCalories * plan?.macros?.carbs / 100 / 4)}g</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Fat</span>
                    <span className="font-medium">{Math.round(plan?.totalCalories * plan?.macros?.fat / 100 / 9)}g</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-surface rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-3">Health Benefits</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="Heart" size={14} className="text-success" />
                    <span className="text-sm">Cardiovascular health</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Zap" size={14} className="text-success" />
                    <span className="text-sm">Energy balance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Shield" size={14} className="text-success" />
                    <span className="text-sm">Immune support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Brain" size={14} className="text-success" />
                    <span className="text-sm">Mental clarity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ayurvedic' && (
          <div className="space-y-6">
            <div className="bg-surface rounded-lg p-6">
              <h4 className="font-medium text-text-primary mb-4">Dosha Balance Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 relative">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-border"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 35}`}
                        strokeDashoffset={`${2 * Math.PI * 35 * (1 - plan?.ayurvedicBalance?.vata / 100)}`}
                        className="text-blue-500 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-500">{plan?.ayurvedicBalance?.vata}%</span>
                    </div>
                  </div>
                  <h5 className="font-medium text-text-primary">Vata</h5>
                  <p className="text-sm text-text-secondary">Air & Space</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 relative">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-border"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 35}`}
                        strokeDashoffset={`${2 * Math.PI * 35 * (1 - plan?.ayurvedicBalance?.pitta / 100)}`}
                        className="text-red-500 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-red-500">{plan?.ayurvedicBalance?.pitta}%</span>
                    </div>
                  </div>
                  <h5 className="font-medium text-text-primary">Pitta</h5>
                  <p className="text-sm text-text-secondary">Fire & Water</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 relative">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-border"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 35}`}
                        strokeDashoffset={`${2 * Math.PI * 35 * (1 - plan?.ayurvedicBalance?.kapha / 100)}`}
                        className="text-green-500 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-500">{plan?.ayurvedicBalance?.kapha}%</span>
                    </div>
                  </div>
                  <h5 className="font-medium text-text-primary">Kapha</h5>
                  <p className="text-sm text-text-secondary">Earth & Water</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted rounded-lg p-4">
                <h5 className="font-medium text-text-primary mb-3">Balancing Foods</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="Leaf" size={14} className="text-success" />
                    <span className="text-sm">Warm, cooked foods for Vata</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Snowflake" size={14} className="text-blue-500" />
                    <span className="text-sm">Cooling foods for Pitta</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Flame" size={14} className="text-red-500" />
                    <span className="text-sm">Stimulating foods for Kapha</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h5 className="font-medium text-text-primary mb-3">Seasonal Considerations</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="Sun" size={14} className="text-yellow-500" />
                    <span className="text-sm">Summer: Cooling foods emphasized</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CloudRain" size={14} className="text-blue-500" />
                    <span className="text-sm">Monsoon: Digestive support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Snowflake" size={14} className="text-gray-500" />
                    <span className="text-sm">Winter: Warming spices included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Action Buttons */}
      <div className="p-6 border-t border-border">
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="outline" onClick={onRegenerate} iconName="RotateCcw">
            Regenerate Plan
          </Button>
          <Button variant="secondary" onClick={onModify} iconName="Edit">
            Modify Preferences
          </Button>
          <Button 
            variant="default" 
            onClick={handleApproveWithSelection} 
            iconName="CheckCircle"
            disabled={selectedMeals.breakfast.length === 0 && selectedMeals.lunch.length === 0 && selectedMeals.dinner.length === 0}
          >
            Approve & Save Plan
            {(selectedMeals.breakfast.length > 0 || selectedMeals.lunch.length > 0 || selectedMeals.dinner.length > 0) && (
              <span className="ml-2 px-2 py-0.5 bg-primary-foreground/20 rounded text-xs">
                {selectedMeals.breakfast.length + selectedMeals.lunch.length + selectedMeals.dinner.length} selected
              </span>
            )}
          </Button>
        </div>
      </div>
      {/* Meal Detail Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-semibold text-lg text-text-primary">
                    {selectedMeal?.name}
                  </h4>
                  <p className="text-text-secondary">{selectedMeal?.type}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMeal(null)}
                  iconName="X"
                />
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-text-secondary">Calories</span>
                  <p className="font-medium">{selectedMeal?.calories}</p>
                </div>
                <div>
                  <span className="text-sm text-text-secondary">Prep Time</span>
                  <p className="font-medium">{selectedMeal?.prepTime}</p>
                </div>
                {selectedMeal?.servingSize && (
                  <div>
                    <span className="text-sm text-text-secondary">Serving Size</span>
                    <p className="font-medium">{selectedMeal?.servingSize}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h5 className="font-medium text-text-primary mb-2">Ayurvedic Properties</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedMeal?.ayurvedicProperties?.map((property, index) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      {property}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-text-primary mb-2">Ingredients</h5>
                <div className="grid grid-cols-2 gap-2">
                  {selectedMeal?.ingredients?.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span className="text-sm">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanPreview;