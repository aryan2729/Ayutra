import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportReports = ({ onExport }) => {
  const [selectedReports, setSelectedReports] = useState([]);
  const [dateRange, setDateRange] = useState('last30days');
  const [format, setFormat] = useState('pdf');

  const reportTypes = [
    {
      id: 'progress-overview',
      title: 'Progress Overview',
      description: 'Complete wellness journey summary with key metrics',
      icon: 'TrendingUp'
    },
    {
      id: 'nutrition-analysis',
      title: 'Nutrition Analysis',
      description: 'Detailed dietary compliance and nutrition tracking',
      icon: 'Apple'
    },
    {
      id: 'goal-tracking',
      title: 'Goal Tracking',
      description: 'Personal goals progress and achievement report',
      icon: 'Target'
    },
    {
      id: 'health-metrics',
      title: 'Health Metrics',
      description: 'Weight, energy, sleep and other health indicators',
      icon: 'Activity'
    },
    {
      id: 'compliance-report',
      title: 'Compliance Report',
      description: 'Diet plan adherence and consistency analysis',
      icon: 'CheckCircle'
    },
    {
      id: 'milestone-summary',
      title: 'Milestone Summary',
      description: 'Achievements and milestones reached during period',
      icon: 'Trophy'
    }
  ];

  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'alltime', label: 'All Time' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'csv', label: 'CSV Spreadsheet' },
    { value: 'json', label: 'JSON Data' }
  ];

  const handleReportToggle = (reportId) => {
    setSelectedReports(prev => 
      prev?.includes(reportId) 
        ? prev?.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReports?.length === reportTypes?.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reportTypes?.map(report => report?.id));
    }
  };

  const generateMockData = () => {
    return {
      'progress-overview': {
        weightProgress: '75 kg → 73 kg (Goal: 70 kg)',
        energyLevel: '8.2/10 (↑15% from last month)',
        sleepQuality: '7.5 hours average',
        complianceRate: '87%'
      },
      'nutrition-analysis': {
        avgCalories: '1,750 kcal/day',
        proteinIntake: '95g/day average',
        mealCompliance: '89%',
        favoriteМeals: ['Kitchari', 'Quinoa Porridge', 'Mung Dal Soup']
      },
      'goal-tracking': {
        totalGoals: 3,
        completed: 1,
        inProgress: 2,
        achievements: ['Lost first 2.3 kg', '30-day streak']
      },
      'health-metrics': [
        { date: '2025-09-01', weight: 77, energy: 7.5, sleep: 7.2 },
        { date: '2025-09-15', weight: 76, energy: 8.0, sleep: 7.5 },
        { date: '2025-09-28', weight: 75, energy: 8.2, sleep: 7.5 }
      ],
      'compliance-report': {
        weeklyAverage: '87%',
        bestWeek: '95% (Sept 15-21)',
        improvementAreas: ['Weekend consistency', 'Snack adherence']
      },
      'milestone-summary': [
        { title: 'First 2.3 kg Lost', date: '2025-02-15', category: 'Weight' },
        { title: '30-Day Compliance Streak', date: '2025-03-01', category: 'Diet' }
      ]
    };
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const data = generateMockData();
    let yPosition = 20;

    // Header
    doc?.setFontSize(20);
    doc?.text('Ayutra - Wellness Report', 20, yPosition);
    yPosition += 15;

    doc?.setFontSize(12);
    doc?.text(`Generated: ${new Date()?.toLocaleDateString()}`, 20, yPosition);
    doc?.text(`Period: ${dateRangeOptions?.find(opt => opt?.value === dateRange)?.label}`, 120, yPosition);
    yPosition += 20;

    selectedReports?.forEach(reportId => {
      const report = reportTypes?.find(r => r?.id === reportId);
      if (!report) return;

      // Report title
      doc?.setFontSize(16);
      doc?.text(report?.title, 20, yPosition);
      yPosition += 10;

      doc?.setFontSize(10);
      doc?.text(report?.description, 20, yPosition);
      yPosition += 15;

      // Report content
      doc?.setFontSize(11);
      const reportData = data?.[reportId];
      
      if (typeof reportData === 'object' && !Array.isArray(reportData)) {
        Object.entries(reportData)?.forEach(([key, value]) => {
          doc?.text(`${key}: ${value}`, 25, yPosition);
          yPosition += 8;
        });
      } else if (Array.isArray(reportData)) {
        reportData?.forEach((item, index) => {
          const text = typeof item === 'object' 
            ? Object.entries(item)?.map(([k, v]) => `${k}: ${v}`)?.join(', ')
            : item?.toString();
          doc?.text(`${index + 1}. ${text}`, 25, yPosition);
          yPosition += 8;
        });
      }

      yPosition += 10;

      if (yPosition > 250) {
        doc?.addPage();
        yPosition = 20;
      }
    });

    doc?.save(`Ayutra_Report_${new Date()?.toISOString()?.split('T')?.[0]}.pdf`);
  };

  const generateCSVReport = () => {
    const data = generateMockData();
    let csvContent = "data:text/csv;charset=utf-8,";
    
    csvContent += "Report Type,Key,Value\n";
    
    selectedReports?.forEach(reportId => {
      const report = reportTypes?.find(r => r?.id === reportId);
      const reportData = data?.[reportId];
      
      if (typeof reportData === 'object' && !Array.isArray(reportData)) {
        Object.entries(reportData)?.forEach(([key, value]) => {
          csvContent += `${report?.title},${key},"${value}"\n`;
        });
      }
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link?.setAttribute("href", encodedUri);
    link?.setAttribute("download", `Ayutra_Report_${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const generateJSONReport = () => {
    const data = generateMockData();
    const selectedData = {};
    
    selectedReports?.forEach(reportId => {
      selectedData[reportId] = data?.[reportId];
    });

    const reportData = {
      metadata: {
        generatedDate: new Date()?.toISOString(),
        dateRange: dateRange,
        format: 'json'
      },
      reports: selectedData
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const link = document.createElement("a");
    link?.setAttribute("href", dataStr);
    link?.setAttribute("download", `Ayutra_Report_${new Date()?.toISOString()?.split('T')?.[0]}.json`);
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handleExport = () => {
    if (selectedReports?.length === 0) {
      alert('Please select at least one report type to export.');
      return;
    }

    switch (format) {
      case 'pdf':
        generatePDFReport();
        break;
      case 'csv':
        generateCSVReport();
        break;
      case 'json':
        generateJSONReport();
        break;
      default:
        generatePDFReport();
    }

    onExport?.({
      reports: selectedReports,
      dateRange,
      format,
      timestamp: new Date()?.toISOString()
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Export Reports</h2>
        <p className="text-text-secondary">
          Generate comprehensive reports of your wellness journey and progress
        </p>
      </div>
      {/* Export Configuration */}
      <div className="bg-surface rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Export Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={dateRange}
            onChange={setDateRange}
          />
          
          <Select
            label="Export Format"
            options={formatOptions}
            value={format}
            onChange={setFormat}
          />
        </div>
      </div>
      {/* Report Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Select Reports</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {selectedReports?.length === reportTypes?.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes?.map((report) => (
            <motion.div
              key={report?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedReports?.includes(report?.id)
                  ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
              }`}
              onClick={() => handleReportToggle(report?.id)}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={selectedReports?.includes(report?.id)}
                  onChange={() => handleReportToggle(report?.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name={report?.icon} size={20} className="text-primary" />
                    <h4 className="font-medium text-text-primary">{report?.title}</h4>
                  </div>
                  <p className="text-sm text-text-secondary">{report?.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Export Summary */}
      {selectedReports?.length > 0 && (
        <div className="bg-surface rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Export Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedReports?.length}</div>
              <div className="text-sm text-text-secondary">Reports Selected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {dateRangeOptions?.find(opt => opt?.value === dateRange)?.label}
              </div>
              <div className="text-sm text-text-secondary">Time Period</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{format?.toUpperCase()}</div>
              <div className="text-sm text-text-secondary">Export Format</div>
            </div>
          </div>
          
          <Button
            onClick={handleExport}
            size="lg"
            className="w-full"
            iconName="Download"
            iconPosition="left"
          >
            Export Reports
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExportReports;