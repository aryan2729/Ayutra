import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FoodCard = ({ food, onFavorite, onViewDetails, isFavorite = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDoshaColor = (dosha) => {
    const colors = {
      'vata-balancing': 'text-blue-600 bg-blue-50',
      'pitta-balancing': 'text-red-600 bg-red-50',
      'kapha-balancing': 'text-green-600 bg-green-50',
      'tridoshic': 'text-purple-600 bg-purple-50'
    };
    return colors?.[dosha] || 'text-gray-600 bg-gray-50';
  };

  const getTasteColor = (taste) => {
    const colors = {
      'sweet': 'bg-pink-100 text-pink-700',
      'sour': 'bg-yellow-100 text-yellow-700',
      'salty': 'bg-blue-100 text-blue-700',
      'pungent': 'bg-red-100 text-red-700',
      'bitter': 'bg-green-100 text-green-700',
      'astringent': 'bg-purple-100 text-purple-700'
    };
    return colors?.[taste] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div 
      className="card-elevated p-0 overflow-hidden transition-smooth hover:shadow-organic-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={food?.image}
          alt={food?.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Overlay Actions */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewDetails(food)}
            >
              <Icon name="Eye" size={16} />
              View Details
            </Button>
            <Button
              variant={isFavorite ? "destructive" : "outline"}
              size="sm"
              onClick={() => onFavorite(food?.id)}
            >
              <Icon name={isFavorite ? "Heart" : "Heart"} size={16} />
            </Button>
          </div>
        </div>

        {/* Seasonal Badge */}
        {food?.seasonal && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
              <Icon name="Calendar" size={12} className="inline mr-1" />
              Seasonal
            </span>
          </div>
        )}

        {/* Availability Badge */}
        {food?.availability === 'local' && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-success text-success-foreground text-xs font-medium rounded-full">
              <Icon name="MapPin" size={12} className="inline mr-1" />
              Local
            </span>
          </div>
        )}
      </div>
      {/* Content Section */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">
            {food?.name}
          </h3>
          <p className="text-sm text-text-secondary">
            {food?.scientificName}
          </p>
          <p className="text-xs text-text-secondary mt-1">
            {food?.category} • {food?.origin}
          </p>
        </div>

        {/* Ayurvedic Properties */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDoshaColor(food?.doshaEffect)}`}>
              {food?.doshaEffect?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
            </span>
            {food?.tastes?.slice(0, 2)?.map((taste, index) => (
              <span key={index} className={`px-2 py-1 text-xs font-medium rounded-full ${getTasteColor(taste)}`}>
                {taste?.charAt(0)?.toUpperCase() + taste?.slice(1)}
              </span>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name={food?.potency === 'heating' ? 'Flame' : 'Snowflake'} size={12} />
              <span>{food?.potency?.charAt(0)?.toUpperCase() + food?.potency?.slice(1)}</span>
            </div>
            {food?.bestSeason && (
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={12} />
                <span>{food?.bestSeason?.charAt(0)?.toUpperCase() + food?.bestSeason?.slice(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;