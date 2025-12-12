import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricsOverview from './components/MetricsOverview';
import HealthJourneyChart from './components/HealthJourneyChart';
import MilestoneTracker from './components/MilestoneTracker';
import ComplianceTracker from './components/ComplianceTracker';
import GoalTracker from './components/GoalTracker';
import ExportReports from './components/ExportReports';
import DietReport from './components/DietReport';
import Input from '../../components/ui/Input';
import { useSession } from '../../contexts/AuthContext';
import { complianceAPI, patientAPI } from '../../services/api';

const ProgressAnalytics = () => {
  const { data } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [activeTab, setActiveTab] = useState('overview');
  const [goals, setGoals] = useState([]);
  const [complianceData, setComplianceData] = useState([
    { name: 'Excellent', value: 45 },
    { name: 'Good', value: 35 },
    { name: 'Fair', value: 15 },
    { name: 'Poor', value: 5 }
  ]);
  const [weeklyComplianceData, setWeeklyComplianceData] = useState([
    { day: 'Mon', compliance: 92 },
    { day: 'Tue', compliance: 88 },
    { day: 'Wed', compliance: 95 },
    { day: 'Thu', compliance: 87 },
    { day: 'Fri', compliance: 90 },
    { day: 'Sat', compliance: 85 },
    { day: 'Sun', compliance: 93 }
  ]);
  const [complianceLoading, setComplianceLoading] = useState(false);
  const [patientProfile, setPatientProfile] = useState(null);
  const [loadingPatientProfile, setLoadingPatientProfile] = useState(false);

  // Mock data for metrics overview
  const [metricsData, setMetricsData] = useState([
    {
      id: 1,
      label: "Weight Progress",
      value: "75 kg",
      change: "+2.3%",
      trend: "down",
      progress: 75,
      icon: "Scale",
      bgColor: "bg-success",
      progressColor: "bg-success",
      description: "2.3 kg from target goal",
      targetValue: 73,
      currentValue: 75,
      unit: "kg"
    },
    {
      id: 4,
      label: "Sleep Quality",
      value: "7.5 hrs",
      change: "-2%",
      trend: "down",
      progress: 68,
      icon: "Moon",
      bgColor: "bg-secondary",
      progressColor: "bg-secondary",
      description: "Room for improvement",
      targetValue: 8,
      currentValue: 7.5,
      unit: "hrs"
    }
  ]);

  // Function to randomize data
  const generateRandomizedData = () => {
    const randomize = (base, variance = 0.2) => {
      const change = (Math.random() - 0.5) * variance;
      return Math.max(0, base * (1 + change));
    };

    return [
      {
        id: 1,
        label: "Weight Progress",
        value: `${Math.round(randomize(75, 0.1))} kg`,
        change: `${(Math.random() > 0.5 ? '+' : '-')}${(Math.random() * 5)?.toFixed(1)}%`,
        trend: Math.random() > 0.5 ? "up" : "down",
        progress: Math.round(randomize(75, 0.3)),
        icon: "Scale",
        bgColor: "bg-success",
        progressColor: "bg-success",
        description: `${(randomize(2.3, 0.5)).toFixed(1)} kg from target goal`,
        targetValue: 73,
        currentValue: Math.round(randomize(75, 0.1)),
        unit: "kg"
      },
      {
        id: 4,
        label: "Sleep Quality",
        value: `${randomize(7.5, 0.15)?.toFixed(1)} hrs`,
        change: `${(Math.random() > 0.6 ? '+' : '-')}${(Math.random() * 4)?.toFixed(0)}%`,
        trend: Math.random() > 0.4 ? "up" : "down",
        progress: Math.round(randomize(68, 0.3)),
        icon: "Moon",
        bgColor: "bg-secondary",
        progressColor: "bg-secondary",
        description: Math.random() > 0.5 ? "Room for improvement" : "Improving steadily",
        targetValue: 8,
        currentValue: randomize(7.5, 0.15),
        unit: "hrs"
      }
    ];
  };

  // State for refreshed data
  const [currentMetricsData, setCurrentMetricsData] = useState(metricsData);
  
  // State for editing
  const [editingMetric, setEditingMetric] = useState(null);

  // Mock data for health journey chart
  const healthJourneyData = [
    { date: "Jan 1", value: 77, target: 73 },
    { date: "Jan 15", value: 76, target: 73 },
    { date: "Feb 1", value: 76, target: 73 },
    { date: "Feb 15", value: 75, target: 73 },
    { date: "Mar 1", value: 75, target: 73 },
    { date: "Mar 15", value: 74, target: 73 },
    { date: "Apr 1", value: 74, target: 73 }
  ];

  const availableMetrics = [
    { value: 'weight', label: 'Weight (kg)' },
    { value: 'energy', label: 'Energy Level (1-10)' },
    { value: 'sleep', label: 'Sleep Hours' },
    { value: 'stress', label: 'Stress Level (1-10)' }
  ];

  // Convert goals to milestones format
  const convertGoalsToMilestones = (goalsList) => {
    return goalsList.map(goal => {
      const categoryMap = {
        weight: 'Weight Management',
        energy: 'Energy & Vitality',
        sleep: 'Sleep Quality',
        nutrition: 'Nutrition',
        exercise: 'Physical Activity',
        wellness: 'Overall Wellness'
      };

      return {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        completed: goal.completed || false,
        completedDate: goal.completedDate || null,
        targetDate: goal.targetDate || '',
        category: categoryMap[goal.category] || goal.category,
        progress: goal.completed ? 100 : goal.progress || 0,
        inProgress: !goal.completed && (goal.progress > 0 && goal.progress < 100)
      };
    });
  };

  // Combine static milestones with goals
  const [staticMilestones] = useState([
    {
      id: 'milestone_2',
      title: "30-Day Compliance Streak",
      description: "Maintained 90%+ diet compliance for 30 consecutive days",
      completed: false,
      inProgress: true,
      targetDate: "2025-04-15",
      category: "Diet Adherence",
      progress: 73,
      daysRemaining: 8
    }
  ]);

  // Generate milestones from goals
  const goalsAsMilestones = convertGoalsToMilestones(goals);
  const milestonesData = [...goalsAsMilestones, ...staticMilestones].sort((a, b) => {
    // Sort: completed first, then in-progress, then pending
    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    if (a.inProgress && !b.inProgress) return -1;
    if (!a.inProgress && b.inProgress) return 1;
    return 0;
  });

  // Fetch compliance data
  const fetchComplianceData = async () => {
    if (!data?.user?.id) return;
    
    setComplianceLoading(true);
    try {
      // Fetch monthly compliance for breakdown
      const monthlyResponse = await complianceAPI.getMonthly();
      if (monthlyResponse.data?.success) {
        const breakdown = monthlyResponse.data.data?.breakdown || [];
        setComplianceData(breakdown);
      }

      // Fetch weekly compliance for trend
      const weeklyResponse = await complianceAPI.getWeekly();
      if (weeklyResponse.data?.success) {
        const daily = weeklyResponse.data.data?.daily || {};
        const weeklyData = [
          { day: 'Mon', compliance: daily.monday?.compliance || 0 },
          { day: 'Tue', compliance: daily.tuesday?.compliance || 0 },
          { day: 'Wed', compliance: daily.wednesday?.compliance || 0 },
          { day: 'Thu', compliance: daily.thursday?.compliance || 0 },
          { day: 'Fri', compliance: daily.friday?.compliance || 0 },
          { day: 'Sat', compliance: daily.saturday?.compliance || 0 },
          { day: 'Sun', compliance: daily.sunday?.compliance || 0 },
  ];
        setWeeklyComplianceData(weeklyData);
      }
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    } finally {
      setComplianceLoading(false);
    }
  };

  // Calculate compliance based on metrics, goals, and milestones
  const calculateComplianceFromProgress = () => {
    // Calculate compliance from goals
    const goalsCompliance = goals.length > 0
      ? goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / goals.length
      : 0;

    // Calculate compliance from metrics progress
    const metricsCompliance = currentMetricsData.length > 0
      ? currentMetricsData.reduce((sum, metric) => sum + (metric.progress || 0), 0) / currentMetricsData.length
      : 0;

    // Calculate compliance from milestones (completed milestones boost compliance)
    const completedMilestones = milestonesData.filter(m => m.completed).length;
    const totalMilestones = milestonesData.length;
    const milestonesCompliance = totalMilestones > 0
      ? (completedMilestones / totalMilestones) * 100
      : 0;

    // Weighted average: 40% goals, 40% metrics, 20% milestones
    const overallCompliance = Math.round(
      (goalsCompliance * 0.4) + (metricsCompliance * 0.4) + (milestonesCompliance * 0.2)
    );

    // Calculate compliance breakdown
    const excellent = overallCompliance >= 90 ? overallCompliance * 0.5 : 0;
    const good = overallCompliance >= 75 && overallCompliance < 90 ? overallCompliance * 0.4 : 0;
    const fair = overallCompliance >= 60 && overallCompliance < 75 ? overallCompliance * 0.3 : 0;
    const poor = overallCompliance < 60 ? overallCompliance * 0.2 : 0;

    // Normalize to percentages
    const total = excellent + good + fair + poor || 1;
    const breakdown = [
      { name: 'Excellent', value: Math.round((excellent / total) * 100) || 0 },
      { name: 'Good', value: Math.round((good / total) * 100) || 0 },
      { name: 'Fair', value: Math.round((fair / total) * 100) || 0 },
      { name: 'Poor', value: Math.round((poor / total) * 100) || 0 }
    ].filter(item => item.value > 0);

    return {
      overall: overallCompliance,
      breakdown: breakdown.length > 0 ? breakdown : [
        { name: 'Excellent', value: 0 },
        { name: 'Good', value: 0 },
        { name: 'Fair', value: 0 },
        { name: 'Poor', value: 0 }
      ],
      goalsCompliance: Math.round(goalsCompliance),
      metricsCompliance: Math.round(metricsCompliance),
      milestonesCompliance: Math.round(milestonesCompliance)
    };
  };

  // Recalculate compliance when metrics, goals, or milestones change
  const [calculatedCompliance, setCalculatedCompliance] = useState(null);

  useEffect(() => {
    const compliance = calculateComplianceFromProgress();
    setCalculatedCompliance(compliance);
    
    // Update compliance data state
    setComplianceData(compliance.breakdown);
  }, [goals, currentMetricsData, milestonesData]);

  // Fetch compliance data when component mounts or tab changes to compliance
  useEffect(() => {
    if (activeTab === 'compliance' && data?.user?.id) {
      fetchComplianceData();
    }
  }, [activeTab, data?.user?.id]);

  // Fetch patient profile data for reports
  useEffect(() => {
    const fetchPatientProfile = async () => {
      if (activeTab === 'reports' && data?.user?.id) {
        setLoadingPatientProfile(true);
        try {
          // Try to get patient profile by user ID
          const response = await patientAPI.getById(data.user.id);
          if (response.data?.success && response.data.data?.patient) {
            setPatientProfile(response.data.data.patient);
          }
        } catch (error) {
          console.error('Error fetching patient profile:', error);
          // If patient profile not found, try to get from localStorage
          try {
            const savedConstitution = localStorage.getItem('patient_constitution');
            if (savedConstitution) {
              const constitution = JSON.parse(savedConstitution);
              setPatientProfile({
                prakriti: constitution.constitution || constitution.prakriti,
                vata_state: constitution.scores?.vata,
                pitta_state: constitution.scores?.pitta,
                kapha_state: constitution.scores?.kapha
              });
            }
          } catch (e) {
            console.error('Error loading from localStorage:', e);
          }
        } finally {
          setLoadingPatientProfile(false);
        }
      }
    };

    fetchPatientProfile();
  }, [activeTab, data?.user?.id]);

  // Mock data for constitution comparison
  const constitutionComparisonData = [
    { aspect: 'Digestion', user: 85, average: 72 },
    { aspect: 'Energy', user: 78, average: 75 },
    { aspect: 'Sleep', user: 82, average: 70 },
    { aspect: 'Stress Management', user: 70, average: 68 },
    { aspect: 'Physical Activity', user: 75, average: 80 },
    { aspect: 'Mental Clarity', user: 88, average: 73 }
  ];

  const similarUsersProgressData = [
    { metric: 'Weight Loss', you: 85, average: 72 },
    { metric: 'Energy Gain', you: 78, average: 75 },
    { metric: 'Sleep Quality', you: 82, average: 70 },
    { metric: 'Compliance', you: 87, average: 68 },
    { metric: 'Goal Achievement', you: 90, average: 75 }
  ];

  // Initialize mock goals
  useEffect(() => {
    const mockGoals = [
      {
        id: 1,
        title: "Reach Target Weight",
        description: "Achieve healthy weight of 73 kg through balanced Ayurvedic diet",
        targetValue: 73,
        currentValue: 75,
        unit: "kg",
        category: "weight",
        targetDate: "2025-06-01",
        progress: 50,
        createdDate: "2025-01-01"
      },
      {
        id: 2,
        title: "Improve Sleep Quality",
        description: "Maintain consistent 8 hours of quality sleep daily",
        targetValue: 8,
        currentValue: 7.5,
        unit: "hours",
        category: "sleep",
        targetDate: "2025-05-15",
        progress: 94,
        createdDate: "2025-02-01"
      }
    ];
    setGoals(mockGoals);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'compliance', label: 'Compliance', icon: 'CheckCircle' },
    { id: 'goals', label: 'Goals', icon: 'Target' },
    { id: 'reports', label: 'Reports', icon: 'Download' }
  ];

  const handleCelebrateMilestone = (milestoneId) => {
    console.log(`Celebrating milestone ${milestoneId}`);
    // Add celebration animation or modal
  };

  const handleAddGoal = (newGoal) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const handleUpdateGoal = (updatedGoal) => {
    setGoals(prev => prev.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    ));
  };

  const handleToggleGoalComplete = (goalId, completed) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updated = {
          ...goal,
          completed: completed,
          completedDate: completed ? new Date().toISOString().split('T')[0] : null,
          progress: completed ? 100 : goal.progress
        };
        return updated;
      }
      return goal;
    }));
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(prev => prev?.filter(goal => goal?.id !== goalId));
  };

  const handleExportReports = (exportData) => {
    console.log('Exporting reports:', exportData);
    // Add export functionality
  };

  const handleUpdateMetric = (metricId, updatedData) => {
    setCurrentMetricsData(prev => prev.map(metric => {
      if (metric.id === metricId) {
        const updated = { ...metric, ...updatedData };
        // Recalculate progress and description based on new values
        if (updated.currentValue !== undefined && updated.targetValue !== undefined) {
          if (metric.label === "Weight Progress") {
            const difference = updated.currentValue - updated.targetValue;
            updated.description = `${Math.abs(difference).toFixed(1)} kg ${difference > 0 ? 'from' : 'to'} target goal`;
            updated.value = `${updated.currentValue} ${updated.unit}`;
            // Calculate progress percentage (assuming 100% when target is reached)
            const progress = Math.max(0, Math.min(100, ((updated.targetValue / updated.currentValue) * 100)));
            updated.progress = Math.round(progress);
          } else if (metric.label === "Sleep Quality") {
            const difference = updated.targetValue - updated.currentValue;
            updated.description = difference > 0 ? "Room for improvement" : "Excellent sleep quality";
            updated.value = `${updated.currentValue.toFixed(1)} ${updated.unit}`;
            // Calculate progress percentage
            const progress = Math.max(0, Math.min(100, (updated.currentValue / updated.targetValue) * 100));
            updated.progress = Math.round(progress);
          }
        }
        return updated;
      }
      return metric;
    }));
    setEditingMetric(null);
  };

  const handleCancelEdit = () => {
    setEditingMetric(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Top Menu */}
      <Header />

      <div className="flex">
        {/* Sidebar - Left Navigation */}
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-2">Progress Analytics</h1>
                  <p className="text-text-secondary">
                    Track your wellness journey with comprehensive insights and milestone celebrations
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    iconName="RefreshCw" 
                    iconPosition="left"
                    onClick={() => {
                      setCurrentMetricsData(generateRandomizedData());
                    }}
                  >
                    Refresh Data
                  </Button>
                  <Button size="sm" iconName="Share2" iconPosition="left">
                    Share Progress
                  </Button>
                </div>
              </div>
            </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-border">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <MetricsOverview 
                metrics={currentMetricsData} 
                onEdit={setEditingMetric}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <HealthJourneyChart
                  data={healthJourneyData}
                  selectedMetric={selectedMetric}
                  onMetricChange={setSelectedMetric}
                  availableMetrics={availableMetrics}
                />
                <MilestoneTracker
                  milestones={milestonesData}
                  onCelebrate={handleCelebrateMilestone}
                />
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <ComplianceTracker
              complianceData={calculatedCompliance?.breakdown || complianceData}
              weeklyData={weeklyComplianceData}
              loading={complianceLoading}
              overallPercentage={calculatedCompliance?.overall || complianceData.reduce((sum, item) => sum + item.value, 0) / complianceData.length || 87}
              goalsCompliance={calculatedCompliance?.goalsCompliance}
              metricsCompliance={calculatedCompliance?.metricsCompliance}
              milestonesCompliance={calculatedCompliance?.milestonesCompliance}
              goals={goals}
              metrics={currentMetricsData}
              milestones={milestonesData}
            />
          )}

          {activeTab === 'goals' && (
            <GoalTracker
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
              onToggleComplete={handleToggleGoalComplete}
            />
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4 no-print">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Diet Report</h2>
                  <p className="text-text-secondary">
                    Comprehensive dietary guidelines and meal plan
                  </p>
                </div>
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => {
                    // Add print-specific styles before printing
                    const style = document.createElement('style');
                    style.innerHTML = `
                      @media print {
                        @page { margin: 1cm; }
                        body * {
                          visibility: visible !important;
                        }
                        .no-print, .no-print * {
                          display: none !important;
                        }
                        body {
                          background: white !important;
                          color: #000 !important;
                        }
                        * {
                          color: #000 !important;
                        }
                        .text-text-primary,
                        .text-text-secondary {
                          color: #000 !important;
                        }
                        .bg-surface,
                        .bg-muted,
                        .bg-background {
                          background: white !important;
                        }
                        .border-border {
                          border-color: #000 !important;
                        }
                        table th,
                        table td {
                          color: #000 !important;
                          background: white !important;
                          border-color: #000 !important;
                        }
                        table tr:nth-child(even) {
                          background: #f5f5f5 !important;
                        }
                      }
                    `;
                    document.head.appendChild(style);
                    window.print();
                    // Remove style after printing
                    setTimeout(() => {
                      document.head.removeChild(style);
                    }, 1000);
                  }}
                >
                  Print Report
                </Button>
              </div>
              <DietReport
                patientData={{
                  fullName: data?.user?.name || data?.session?.user?.name,
                  age: patientProfile?.age || data?.user?.age || data?.session?.user?.age,
                  gender: patientProfile?.gender || data?.user?.gender || data?.session?.user?.gender,
                  id: data?.user?.id || data?.session?.user?.id,
                  prakriti: patientProfile?.prakriti,
                  vataState: patientProfile?.vata_state,
                  pittaState: patientProfile?.pitta_state,
                  kaphaState: patientProfile?.kapha_state
                }}
                dietPlan={{
                  totalCalories: 1800,
                  proteinTarget: 75,
                  carbTarget: 240
                }}
                metrics={currentMetricsData}
              />
            </div>
          )}
        </motion.div>

        {/* Edit Metric Modal */}
        {editingMetric && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-lg border border-border shadow-organic max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-text-primary">
                  Edit {editingMetric.label}
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 rounded-full hover:bg-muted transition-smooth"
                >
                  <Icon name="X" size={20} className="text-text-secondary" />
                </button>
              </div>
              
              <div className="space-y-4">
                <Input
                  label={`Current ${editingMetric.label === "Weight Progress" ? "Weight" : "Sleep Hours"}`}
                  type="number"
                  value={editingMetric.currentValue}
                  onChange={(e) => setEditingMetric({
                    ...editingMetric,
                    currentValue: parseFloat(e.target.value) || 0
                  })}
                  step={editingMetric.unit === "kg" ? 0.1 : 0.5}
                />
                <Input
                  label={`Target ${editingMetric.label === "Weight Progress" ? "Weight" : "Sleep Hours"}`}
                  type="number"
                  value={editingMetric.targetValue}
                  onChange={(e) => setEditingMetric({
                    ...editingMetric,
                    targetValue: parseFloat(e.target.value) || 0
                  })}
                  step={editingMetric.unit === "kg" ? 0.1 : 0.5}
                />
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="default"
                    onClick={() => handleUpdateMetric(editingMetric.id, editingMetric)}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Quick Actions Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Last updated: {new Date()?.toLocaleDateString()} at {new Date()?.toLocaleTimeString()}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" iconName="HelpCircle" iconPosition="left">
                Help & Support
              </Button>
              <Button variant="ghost" size="sm" iconName="Settings" iconPosition="left">
                Analytics Settings
              </Button>
            </div>
          </div>
        </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProgressAnalytics;