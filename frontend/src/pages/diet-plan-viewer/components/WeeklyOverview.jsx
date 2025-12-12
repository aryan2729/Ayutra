import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WeeklyOverview = ({ weekData, currentWeek, onWeekChange, onDaySelect }) => {
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const getDayStatus = (day) => {
    const today = new Date()?.getDay();
    const dayIndex = days?.indexOf(day);
    const adjustedToday = today === 0 ? 6 : today - 1; // Convert Sunday=0 to Sunday=6
    
    if (dayIndex < adjustedToday) return 'completed';
    if (dayIndex === adjustedToday) return 'current';
    return 'upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/10 border-success/20 text-success';
      case 'current': return 'bg-primary/10 border-primary/20 text-primary';
      case 'upcoming': return 'bg-muted border-border text-text-secondary';
      default: return 'bg-muted border-border text-text-secondary';
    }
  };

  const getMealTypeIcon = (type) => {
    const icons = {
      'breakfast': 'Sunrise',
      'lunch': 'Sun',
      'dinner': 'Moon',
      'snack': 'Coffee'
    };
    return icons?.[type] || 'Utensils';
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-semibold text-xl text-text-primary mb-1">
            Weekly Overview
          </h2>
          <p className="text-text-secondary text-sm">
            Week {currentWeek} • {new Date()?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange(currentWeek - 1)}
            iconName="ChevronLeft"
            disabled={currentWeek <= 1}
          />
          <span className="text-sm font-medium text-text-primary px-3">
            Week {currentWeek}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange(currentWeek + 1)}
            iconName="ChevronRight"
          />
          <div className="ml-4 flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              iconName="Grid3X3"
            />
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              iconName="List"
            />
          </div>
        </div>
      </div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          {days?.map((day) => {
            const dayData = weekData?.[day?.toLowerCase()];
            const status = getDayStatus(day);
            
            return (
              <div
                key={day}
                onClick={() => onDaySelect(day)}
                className={`p-4 rounded-lg border cursor-pointer transition-smooth hover:shadow-organic ${getStatusColor(status)}`}
              >
                <div className="text-center mb-3">
                  <div className="font-medium text-sm mb-1">
                    {day?.slice(0, 3)}
                  </div>
                  <div className="text-xs opacity-75">
                    {new Date(2024, 0, days.indexOf(day) + 1)?.toLocaleDateString('en-US', { day: 'numeric' })}
                  </div>
                </div>
                <div className="space-y-2">
                  {dayData?.meals?.slice(0, 3)?.map((meal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon 
                        name={getMealTypeIcon(meal?.type)} 
                        size={12} 
                        className="opacity-60" 
                      />
                      <span className="text-xs truncate">
                        {meal?.name}
                      </span>
                    </div>
                  ))}
                  {dayData?.meals?.length > 3 && (
                    <div className="text-xs opacity-60 text-center">
                      +{dayData?.meals?.length - 3} more
                    </div>
                  )}
                </div>
                {dayData?.calories && (
                  <div className="mt-3 pt-2 border-t border-current/10">
                    <div className="text-xs text-center">
                      {dayData?.calories} cal
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {days?.map((day) => {
            const dayData = weekData?.[day?.toLowerCase()];
            const status = getDayStatus(day);
            
            return (
              <div
                key={day}
                onClick={() => onDaySelect(day)}
                className={`p-4 rounded-lg border cursor-pointer transition-smooth hover:shadow-organic ${getStatusColor(status)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium">
                      {day}
                    </div>
                    <span className="text-sm opacity-75">
                      {new Date(2024, 0, days.indexOf(day) + 1)?.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    {dayData?.calories && (
                      <span>{dayData?.calories} cal</span>
                    )}
                    <Icon name="ChevronRight" size={16} />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {dayData?.meals?.map((meal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon 
                        name={getMealTypeIcon(meal?.type)} 
                        size={14} 
                        className="opacity-60" 
                      />
                      <div>
                        <div className="text-sm font-medium">
                          {meal?.type?.charAt(0)?.toUpperCase() + meal?.type?.slice(1)}
                        </div>
                        <div className="text-xs opacity-75 truncate">
                          {meal?.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Week Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {weekData?.summary?.totalCalories || 0}
            </div>
            <div className="text-xs text-text-secondary">Total Calories</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-secondary">
              {weekData?.summary?.mealsCompleted || 0}/{weekData?.summary?.totalMeals || 0}
            </div>
            <div className="text-xs text-text-secondary">Meals Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-accent">
              {weekData?.summary?.avgRating || 0}/5
            </div>
            <div className="text-xs text-text-secondary">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-success">
              {weekData?.summary?.compliance || 0}%
            </div>
            <div className="text-xs text-text-secondary">Compliance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyOverview;