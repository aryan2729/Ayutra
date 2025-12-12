import React from 'react';
import FoodCard from './FoodCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FoodGrid = ({ 
  foods, 
  loading, 
  onFavorite, 
  onViewDetails, 
  favorites = [], 
  viewMode = 'grid',
  sortBy,
  onSortChange 
}) => {
  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'rating', label: 'Rating (High to Low)' },
    { value: 'calories', label: 'Calories (Low to High)' },
    { value: 'protein', label: 'Protein (High to Low)' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'seasonal', label: 'Seasonal First' }
  ];

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)]?.map((_, index) => (
            <div key={index} className="card-elevated p-0 overflow-hidden animate-pulse">
              <div className="h-48 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-muted rounded"></div>
                  <div className="h-2 bg-muted rounded w-5/6"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-muted rounded-full w-16"></div>
                  <div className="h-6 bg-muted rounded-full w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!foods || foods?.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Search" size={32} className="text-text-secondary" />
          </div>
          <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">
            No Foods Found
          </h3>
          <p className="text-text-secondary mb-6">
            We couldn't find any foods matching your current filters. Try adjusting your search criteria or clearing some filters.
          </p>
          <Button variant="outline">
            <Icon name="RotateCcw" size={16} />
            Reset Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Results Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-4">
          <h2 className="font-heading font-semibold text-lg text-text-primary">
            Food Explorer Results
          </h2>
          <span className="text-text-secondary">
            {foods?.length} food{foods?.length !== 1 ? 's' : ''} found
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <Icon name="ArrowUpDown" size={16} className="text-text-secondary" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e?.target?.value)}
              className="bg-background border border-border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              {sortOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => {}} // View mode toggle would be handled by parent
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ?'bg-background text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="Grid3X3" size={16} />
            </button>
            <button
              onClick={() => {}} // View mode toggle would be handled by parent
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ?'bg-background text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="List" size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Food Grid */}
      <div className="p-6">
        <div className={`grid gap-6 ${
          viewMode === 'grid' ?'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :'grid-cols-1'
        }`}>
          {foods?.map((food) => (
            <FoodCard
              key={food?.id}
              food={food}
              onFavorite={onFavorite}
              onViewDetails={onViewDetails}
              isFavorite={favorites?.includes(food?.id)}
            />
          ))}
        </div>
      </div>
      {/* Load More Button */}
      {foods?.length >= 20 && (
        <div className="flex justify-center p-6 border-t border-border">
          <Button variant="outline" size="lg">
            <Icon name="ChevronDown" size={16} />
            Load More Foods
          </Button>
        </div>
      )}
    </div>
  );
};

export default FoodGrid;