import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ShoppingList = ({ items, onToggleItem, onExportList, onOrderOnline }) => {
  const groupedItems = items?.reduce((groups, item) => {
    const key = item?.category;
    if (!groups?.[key]) groups[key] = [];
    groups?.[key]?.push(item);
    return groups;
  }, {});

  const totalItems = items?.length;
  const checkedItems = items?.filter(item => item?.checked)?.length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  const getCategoryIcon = (category) => {
    const icons = {
      'Vegetables': 'Carrot',
      'Fruits': 'Apple',
      'Grains': 'Wheat',
      'Spices': 'Sparkles',
      'Dairy': 'Milk',
      'Proteins': 'Fish',
      'Oils': 'Droplets',
      'Herbs': 'Leaf'
    };
    return icons?.[category] || 'ShoppingCart';
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-semibold text-xl text-text-primary mb-1">
            Shopping List
          </h2>
          <p className="text-text-secondary text-sm">
            {checkedItems} of {totalItems} items collected
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportList}
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onOrderOnline}
            iconName="ShoppingBag"
            iconPosition="left"
          >
            Order Online
          </Button>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Progress</span>
          <span className="text-sm text-text-secondary">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-success h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {/* Shopping Items */}
      <div className="space-y-6">
        {Object.entries(groupedItems)?.map(([group, groupItems]) => (
          <div key={group}>
            <div className="flex items-center space-x-2 mb-3">
              <Icon 
                name={getCategoryIcon(group)} 
                size={18} 
                className="text-primary" 
              />
              <h3 className="font-medium text-text-primary">{group}</h3>
              <span className="text-sm text-text-secondary">
                ({groupItems?.length} items)
              </span>
            </div>

            <div className="space-y-2">
              {groupItems?.map((item) => (
                <div 
                  key={item?.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-smooth ${
                    item?.checked 
                      ? 'bg-success/5 border-success/20' :'bg-background border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <Checkbox
                      checked={item?.checked}
                      onChange={(e) => onToggleItem(item?.id, e?.target?.checked)}
                    />
                    <div className="flex-1">
                      <div className={`font-medium ${
                        item?.checked ? 'text-text-secondary line-through' : 'text-text-primary'
                      }`}>
                        {item?.name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {item?.quantity} • {item?.unit}
                        {item?.notes && ` • ${item?.notes}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item?.price && (
                      <span className="text-sm font-medium text-text-primary">
                        ${item?.price}
                      </span>
                    )}
                    {item?.organic && (
                      <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                        Organic
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {items?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="ShoppingCart" size={48} className="text-text-secondary mx-auto mb-3" />
          <p className="text-text-secondary">
            No items in shopping list
          </p>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;