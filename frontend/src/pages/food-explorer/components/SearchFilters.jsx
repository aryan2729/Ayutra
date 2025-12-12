import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SearchFilters = ({ onFiltersChange, isCollapsed, onToggleCollapse }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    dosha: '',
    taste: '',
    potency: '',
    season: '',
    nutritionRange: {
      calories: [0, 500],
      protein: [0, 50],
      carbs: [0, 100],
      fat: [0, 30]
    },
    dietaryRestrictions: [],
    availability: ''
  });

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'grains', label: 'Grains & Cereals' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'legumes', label: 'Legumes & Pulses' },
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'spices', label: 'Spices & Herbs' },
    { value: 'nuts', label: 'Nuts & Seeds' },
    { value: 'oils', label: 'Oils & Fats' }
  ];

  const doshaOptions = [
    { value: '', label: 'All Doshas' },
    { value: 'vata-balancing', label: 'Vata Balancing' },
    { value: 'pitta-balancing', label: 'Pitta Balancing' },
    { value: 'kapha-balancing', label: 'Kapha Balancing' },
    { value: 'tridoshic', label: 'Tridoshic (All Doshas)' }
  ];

  const tasteOptions = [
    { value: '', label: 'All Tastes' },
    { value: 'sweet', label: 'Sweet (Madhura)' },
    { value: 'sour', label: 'Sour (Amla)' },
    { value: 'salty', label: 'Salty (Lavana)' },
    { value: 'pungent', label: 'Pungent (Katu)' },
    { value: 'bitter', label: 'Bitter (Tikta)' },
    { value: 'astringent', label: 'Astringent (Kashaya)' }
  ];

  const potencyOptions = [
    { value: '', label: 'All Potencies' },
    { value: 'heating', label: 'Heating (Ushna)' },
    { value: 'cooling', label: 'Cooling (Shita)' }
  ];

  const seasonOptions = [
    { value: '', label: 'All Seasons' },
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'monsoon', label: 'Monsoon' },
    { value: 'autumn', label: 'Autumn' },
    { value: 'winter', label: 'Winter' }
  ];

  const availabilityOptions = [
    { value: '', label: 'All Availability' },
    { value: 'local', label: 'Locally Available' },
    { value: 'seasonal', label: 'Seasonal Only' },
    { value: 'year-round', label: 'Year Round' },
    { value: 'imported', label: 'Imported' }
  ];

  const dietaryRestrictionOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten Free' },
    { value: 'dairy-free', label: 'Dairy Free' },
    { value: 'nut-free', label: 'Nut Free' },
    { value: 'low-sodium', label: 'Low Sodium' },
    { value: 'organic', label: 'Organic Only' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleNutritionRangeChange = (nutrient, values) => {
    const newFilters = {
      ...filters,
      nutritionRange: {
        ...filters?.nutritionRange,
        [nutrient]: values
      }
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDietaryRestrictionChange = (restriction, checked) => {
    const newRestrictions = checked
      ? [...filters?.dietaryRestrictions, restriction]
      : filters?.dietaryRestrictions?.filter(r => r !== restriction);
    
    const newFilters = { ...filters, dietaryRestrictions: newRestrictions };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      category: '',
      dosha: '',
      taste: '',
      potency: '',
      season: '',
      nutritionRange: {
        calories: [0, 500],
        protein: [0, 50],
        carbs: [0, 100],
        fat: [0, 30]
      },
      dietaryRestrictions: [],
      availability: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.searchTerm) count++;
    if (filters?.category) count++;
    if (filters?.dosha) count++;
    if (filters?.taste) count++;
    if (filters?.potency) count++;
    if (filters?.season) count++;
    if (filters?.availability) count++;
    if (filters?.dietaryRestrictions?.length > 0) count++;
    return count;
  };

  return (
    <div className={`bg-surface border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-0 overflow-hidden' : 'w-80'
    }`}>
      <div className="p-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} className="text-brand-primary" />
            <h3 className="font-heading font-semibold text-lg text-text-primary">
              Search Filters
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Active Filters Count */}
        {getActiveFiltersCount() > 0 && (
          <div className="mb-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search foods, ingredients..."
            value={filters?.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <Select
            label="Food Category"
            options={categoryOptions}
            value={filters?.category}
            onChange={(value) => handleFilterChange('category', value)}
          />
        </div>

        {/* Ayurvedic Properties */}
        <div className="mb-6">
          <h4 className="font-medium text-text-primary mb-3">Ayurvedic Properties</h4>
          <div className="space-y-4">
            <Select
              label="Dosha Effect"
              options={doshaOptions}
              value={filters?.dosha}
              onChange={(value) => handleFilterChange('dosha', value)}
            />
            
            <Select
              label="Taste (Rasa)"
              options={tasteOptions}
              value={filters?.taste}
              onChange={(value) => handleFilterChange('taste', value)}
            />
            
            <Select
              label="Potency (Virya)"
              options={potencyOptions}
              value={filters?.potency}
              onChange={(value) => handleFilterChange('potency', value)}
            />
          </div>
        </div>

        {/* Nutritional Ranges */}
        <div className="mb-6">
          <h4 className="font-medium text-text-primary mb-3">Nutritional Content (per 100g)</h4>
          <div className="space-y-4">
            {Object.entries(filters?.nutritionRange)?.map(([nutrient, range]) => (
              <div key={nutrient} className="space-y-2">
                <label className="text-sm font-medium text-text-secondary capitalize ">
                  {nutrient} ({nutrient === 'calories' ? 'kcal' : 'g'})
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="0"
                      max={nutrient === 'calories' ? '500' : nutrient === 'carbs' ? '100' : '50'}
                      value={range?.[1]}
                      onChange={(e) => handleNutritionRangeChange(nutrient, [range?.[0], parseInt(e?.target?.value)])}
                      className="w-full h-2 bg-muted border border-border rounded-lg appearance-none cursor-pointer slider-custom"
                      style={{
                        background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(range?.[1] / (nutrient === 'calories' ? 500 : nutrient === 'carbs' ? 100 : 50)) * 100}%, var(--color-muted) ${(range?.[1] / (nutrient === 'calories' ? 500 : nutrient === 'carbs' ? 100 : 50)) * 100}%, var(--color-muted) 100%)`
                      }}
                    />
                  </div>
                  <span className="text-xs text-text-secondary w-12">
                    0-{range?.[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="mb-6">
          <h4 className="font-medium text-text-primary mb-3">Dietary Preferences</h4>
          <div className="space-y-2">
            {dietaryRestrictionOptions?.map((option) => (
              <Checkbox
                key={option?.value}
                label={option?.label}
                checked={filters?.dietaryRestrictions?.includes(option?.value)}
                onChange={(e) => handleDietaryRestrictionChange(option?.value, e?.target?.checked)}
              />
            ))}
          </div>
        </div>

        {/* Season & Availability */}
        <div className="space-y-4">
          <Select
            label="Best Season"
            options={seasonOptions}
            value={filters?.season}
            onChange={(value) => handleFilterChange('season', value)}
          />
          
          <Select
            label="Availability"
            options={availabilityOptions}
            value={filters?.availability}
            onChange={(value) => handleFilterChange('availability', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;