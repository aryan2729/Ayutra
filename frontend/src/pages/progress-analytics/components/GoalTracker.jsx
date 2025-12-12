import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { motion } from 'framer-motion';

const GoalTracker = ({ goals, onAddGoal, onUpdateGoal, onDeleteGoal, onToggleComplete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetValue: '',
    currentValue: '',
    unit: '',
    category: '',
    targetDate: ''
  });


  const categoryOptions = [
    { value: 'weight', label: 'Weight Management' },
    { value: 'energy', label: 'Energy & Vitality' },
    { value: 'sleep', label: 'Sleep Quality' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'exercise', label: 'Physical Activity' },
    { value: 'wellness', label: 'Overall Wellness' }
  ];


  const unitOptions = [
    { value: 'kg', label: 'kilograms (kg)' },
    { value: 'lbs', label: 'pounds (lbs)' },
    { value: 'hours', label: 'hours' },
    { value: 'minutes', label: 'minutes' },
    { value: 'days', label: 'days' },
    { value: 'percent', label: 'percentage (%)' },
    { value: 'rating', label: 'rating (1-10)' }
  ];


  const handleAddGoal = () => {
    if (newGoal?.title && newGoal?.targetValue && newGoal?.category) {
      const goalToAdd = {
        ...newGoal,
        id: Date.now(),
        progress: 0,
        createdDate: new Date()?.toISOString()?.split('T')?.[0]
      };
      onAddGoal(goalToAdd);
      setNewGoal({
        title: '',
        description: '',
        targetValue: '',
        currentValue: '',
        unit: '',
        category: '',
        targetDate: ''
      });
      setShowAddForm(false);
    }
  };


  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal?.title,
      description: goal?.description,
      targetValue: goal?.targetValue?.toString(),
      currentValue: goal?.currentValue?.toString(),
      unit: goal?.unit,
      category: goal?.category,
      targetDate: goal?.targetDate
    });
    setShowAddForm(true);
  };


  const handleUpdateGoal = () => {
    if (editingGoal && newGoal?.title && newGoal?.targetValue && newGoal?.category) {
      const updatedGoal = {
        ...editingGoal,
        ...newGoal,
        targetValue: parseFloat(newGoal?.targetValue),
        currentValue: parseFloat(newGoal?.currentValue),
        progress: Math.round((parseFloat(newGoal?.currentValue) / parseFloat(newGoal?.targetValue)) * 100)
      };
      onUpdateGoal(updatedGoal);
      setEditingGoal(null);
      setNewGoal({
        title: '',
        description: '',
        targetValue: '',
        currentValue: '',
        unit: '',
        category: '',
        targetDate: ''
      });
      setShowAddForm(false);
    }
  };

  
  const handleCancelEdit = () => {
    setEditingGoal(null);
    setNewGoal({
      title: '',
      description: '',
      targetValue: '',
      currentValue: '',
      unit: '',
      category: '',
      targetDate: ''
    });
    setShowAddForm(false);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      weight: 'Scale',
      energy: 'Zap',
      sleep: 'Moon',
      nutrition: 'Apple',
      exercise: 'Activity',
      wellness: 'Heart'
    };
    return icons?.[category] || 'Target';
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Personal Goals</h2>
          <p className="text-text-secondary">Track your wellness objectives and celebrate achievements</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} iconName="Plus" iconPosition="left">
          Add Goal
        </Button>
      </div>
      {/* Add/Edit Goal Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-lg p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </h3>
            <Button variant="ghost" onClick={handleCancelEdit} iconName="X" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Goal Title"
              placeholder="e.g., Reach ideal weight"
              value={newGoal?.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e?.target?.value })}
              required
            />
            <Select
              label="Category"
              options={categoryOptions}
              value={newGoal?.category}
              onChange={(value) => setNewGoal({ ...newGoal, category: value })}
              placeholder="Select category"
              required
            />
          </div>

          <div className="mb-4">
            <Input
              label="Description"
              placeholder="Describe your goal in detail"
              value={newGoal?.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e?.target?.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="Target Value"
              type="number"
              placeholder="160"
              value={newGoal?.targetValue}
              onChange={(e) => setNewGoal({ ...newGoal, targetValue: e?.target?.value })}
              required
            />
            <Input
              label="Current Value"
              type="number"
              placeholder="165"
              value={newGoal?.currentValue}
              onChange={(e) => setNewGoal({ ...newGoal, currentValue: e?.target?.value })}
            />
            <Select
              label="Unit"
              options={unitOptions}
              value={newGoal?.unit}
              onChange={(value) => setNewGoal({ ...newGoal, unit: value })}
              placeholder="Select unit"
            />
          </div>

          <div className="mb-6">
            <Input
              label="Target Date"
              type="date"
              value={newGoal?.targetDate}
              onChange={(e) => setNewGoal({ ...newGoal, targetDate: e?.target?.value })}
            />
          </div>

          <div className="flex space-x-3">
            <Button onClick={editingGoal ? handleUpdateGoal : handleAddGoal}>
              {editingGoal ? 'Update Goal' : 'Add Goal'}
            </Button>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals?.map((goal) => (
          <motion.div
            key={goal?.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-card rounded-lg p-6 border transition-shadow relative ${
              goal?.completed 
                ? 'border-success/50 bg-success/5 hover:shadow-lg' 
                : 'border-border hover:shadow-lg'
            }`}
          >
            {goal?.completed && (
              <div className="absolute top-4 right-4 z-10">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="CheckCircle" size={20} className="text-white" />
                </div>
              </div>
            )}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getProgressColor(goal?.progress)}`}>
                  <Icon name={getCategoryIcon(goal?.category)} size={20} className="text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    goal?.completed ? 'text-success' : 'text-text-primary'
                  }`}>
                    {goal?.title}
                  </h3>
                  <p className="text-sm text-text-secondary capitalize">{goal?.category}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <input
                  type="checkbox"
                  checked={goal?.completed || false}
                  onChange={() => onToggleComplete && onToggleComplete(goal?.id, !goal?.completed)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-2 cursor-pointer"
                  title={goal?.completed ? "Mark as incomplete" : "Mark as complete"}
                />
                <Button variant="ghost" size="sm" onClick={() => handleEditGoal(goal)} iconName="Edit2" />
                <Button variant="ghost" size="sm" onClick={() => onDeleteGoal(goal?.id)} iconName="Trash2" />
              </div>
            </div>

            <p className={`text-sm mb-4 ${
              goal?.completed ? 'text-success line-through' : 'text-text-secondary'
            }`}>
              {goal?.description}
            </p>

            {goal?.completed && (
              <div className="mb-3 px-3 py-2 bg-success/10 rounded-lg border border-success/20">
                <p className="text-xs text-success font-medium flex items-center space-x-1">
                  <Icon name="CheckCircle" size={14} />
                  <span>Goal Completed!</span>
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-text-secondary">Progress</span>
              <span className={`font-medium ${goal?.completed ? 'text-success' : 'text-text-primary'}`}>
                {goal?.completed ? '100%' : `${goal?.progress}%`}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full ${
                  goal?.completed ? 'bg-success' : getProgressColor(goal?.progress)
                } transition-all duration-500`}
                style={{ width: `${goal?.completed ? 100 : Math.min(goal?.progress, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Current:</span>
                <div className="font-medium text-text-primary">
                  {goal?.currentValue} {goal?.unit}
                </div>
              </div>
              <div>
                <span className="text-text-secondary">Target:</span>
                <div className="font-medium text-text-primary">
                  {goal?.targetValue} {goal?.unit}
                </div>
              </div>
            </div>

            {goal?.targetDate && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Target Date:</span>
                  <span className="text-text-primary">{new Date(goal.targetDate)?.toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      {goals?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Target" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="font-medium text-text-primary mb-2">No goals yet</h3>
          <p className="text-text-secondary mb-6">
            Set your first wellness goal to start tracking your progress
          </p>
          <Button onClick={() => setShowAddForm(true)} iconName="Plus" iconPosition="left">
            Create Your First Goal
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;