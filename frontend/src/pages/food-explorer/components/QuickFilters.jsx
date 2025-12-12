import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickFilters = ({ activeFilters, onFilterChange, onClearAll }) => {
  const quickFilterOptions = [
    {
      id: 'vegetarian',
      label: 'Vegetarian',
      icon: 'Leaf',
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: 'vegan',
      label: 'Vegan',
      icon: 'Sprout',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    {
      id: 'gluten-free',
      label: 'Gluten Free',
      icon: 'Shield',
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      id: 'dairy-free',
      label: 'Dairy Free',
      icon: 'Milk',
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    {
      id: 'low-sodium',
      label: 'Low Sodium',
      icon: 'Heart',
      color: 'bg-red-100 text-red-700 border-red-200'
    },
    {
      id: 'organic',
      label: 'Organic',
      icon: 'Flower',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    },
    {
      id: 'seasonal',
      label: 'Seasonal',
      icon: 'Calendar',
      color: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    {
      id: 'local',
      label: 'Local',
      icon: 'MapPin',
      color: 'bg-teal-100 text-teal-700 border-teal-200'
    }
  ];

  const doshaFilters = [
    {
      id: 'vata-balancing',
      label: 'Vata Balancing',
      icon: 'Wind',
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      id: 'pitta-balancing',
      label: 'Pitta Balancing',
      icon: 'Flame',
      color: 'bg-red-100 text-red-700 border-red-200'
    },
    {
      id: 'kapha-balancing',
      label: 'Kapha Balancing',
      icon: 'Mountain',
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: 'tridoshic',
      label: 'Tridoshic',
      icon: 'Circle',
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    }
  ];

  const tasteFilters = [
    {
      id: 'sweet',
      label: 'Sweet',
      icon: 'Heart',
      color: 'bg-pink-100 text-pink-700 border-pink-200'
    },
    {
      id: 'sour',
      label: 'Sour',
      icon: 'Zap',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    },
    {
      id: 'salty',
      label: 'Salty',
      icon: 'Waves',
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      id: 'pungent',
      label: 'Pungent',
      icon: 'Flame',
      color: 'bg-red-100 text-red-700 border-red-200'
    },
    {
      id: 'bitter',
      label: 'Bitter',
      icon: 'Leaf',
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: 'astringent',
      label: 'Astringent',
      icon: 'Minus',
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    }
  ];

  const isFilterActive = (filterId) => {
    return activeFilters?.includes(filterId);
  };

  const handleFilterToggle = (filterId) => {
    const newFilters = isFilterActive(filterId)
      ? activeFilters?.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    onFilterChange(newFilters);
  };

  const getActiveFiltersCount = () => activeFilters?.length;

  return (
    <div className="bg-surface border-b border-border p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Filter" size={20} className="text-brand-primary" />
            <h3 className="font-heading font-semibold text-lg text-text-primary">
              Quick Filters
            </h3>
            {getActiveFiltersCount() > 0 && (
              <span className="px-2 py-1 bg-brand-primary text-primary-foreground text-xs font-medium rounded-full">
                {getActiveFiltersCount()} active
              </span>
            )}
          </div>
          
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-text-secondary hover:text-text-primary"
            >
              <Icon name="X" size={16} />
              Clear All
            </Button>
          )}
        </div>

        {/* Dietary Preferences */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Dietary Preferences</h4>
          <div className="flex flex-wrap gap-2">
            {quickFilterOptions?.map((filter) => (
              <button
                key={filter?.id}
                onClick={() => handleFilterToggle(filter?.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-full border transition-smooth ${
                  isFilterActive(filter?.id)
                    ? 'bg-brand-primary text-primary-foreground border-brand-primary shadow-organic'
                    : `${filter?.color} hover:shadow-organic`
                }`}
              >
                <Icon name={filter?.icon} size={14} />
                <span>{filter?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dosha Effects */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Dosha Effects</h4>
          <div className="flex flex-wrap gap-2">
            {doshaFilters?.map((filter) => (
              <button
                key={filter?.id}
                onClick={() => handleFilterToggle(filter?.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-full border transition-smooth ${
                  isFilterActive(filter?.id)
                    ? 'bg-brand-primary text-primary-foreground border-brand-primary shadow-organic'
                    : `${filter?.color} hover:shadow-organic`
                }`}
              >
                <Icon name={filter?.icon} size={14} />
                <span>{filter?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Six Tastes */}
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">Six Tastes (Rasa)</h4>
          <div className="flex flex-wrap gap-2">
            {tasteFilters?.map((filter) => (
              <button
                key={filter?.id}
                onClick={() => handleFilterToggle(filter?.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-full border transition-smooth ${
                  isFilterActive(filter?.id)
                    ? 'bg-brand-primary text-primary-foreground border-brand-primary shadow-organic'
                    : `${filter?.color} hover:shadow-organic`
                }`}
              >
                <Icon name={filter?.icon} size={14} />
                <span>{filter?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickFilters;