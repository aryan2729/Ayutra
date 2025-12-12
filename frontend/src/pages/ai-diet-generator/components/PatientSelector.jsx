import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PatientSelector = ({ onPatientSelect, selectedPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const mockPatients = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 34,
      gender: "Female",
      constitution: "Vata-Pitta",
      lastVisit: "2025-01-15",
      conditions: ["Digestive Issues", "Stress"],
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 42,
      gender: "Male",
      constitution: "Pitta-Kapha",
      lastVisit: "2025-01-12",
      conditions: ["High Blood Pressure", "Weight Management"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Priya Sharma",
      age: 28,
      gender: "Female",
      constitution: "Kapha-Vata",
      lastVisit: "2025-01-10",
      conditions: ["PCOS", "Fatigue"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "David Rodriguez",
      age: 55,
      gender: "Male",
      constitution: "Vata",
      lastVisit: "2025-01-08",
      conditions: ["Arthritis", "Insomnia"],
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const constitutionOptions = [
    { value: 'all', label: 'All Constitutions' },
    { value: 'vata', label: 'Vata Dominant' },
    { value: 'pitta', label: 'Pitta Dominant' },
    { value: 'kapha', label: 'Kapha Dominant' }
  ];

  const filteredPatients = mockPatients?.filter(patient => {
    const matchesSearch = patient?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         patient?.conditions?.some(condition => 
                           condition?.toLowerCase()?.includes(searchTerm?.toLowerCase())
                         );
    
    const matchesFilter = filterType === 'all' || 
                         patient?.constitution?.toLowerCase()?.includes(filterType);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-card rounded-lg p-6 shadow-organic">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading font-semibold text-xl text-text-primary mb-2">
            Select Patient
          </h3>
          <p className="text-text-secondary">
            Choose a patient to generate a personalized diet plan
          </p>
        </div>
        <Button variant="outline" iconName="UserPlus">
          New Patient
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          type="search"
          placeholder="Search patients by name or condition..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="w-full"
        />
        
        <Select
          options={constitutionOptions}
          value={filterType}
          onChange={setFilterType}
          placeholder="Filter by constitution"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredPatients?.map((patient) => (
          <div
            key={patient?.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-smooth hover:shadow-organic-hover ${
              selectedPatient?.id === patient?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => onPatientSelect(patient)}
          >
            <div className="flex items-start space-x-4">
              <img
                src={patient?.avatar}
                alt={patient?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary truncate">
                    {patient?.name}
                  </h4>
                  {selectedPatient?.id === patient?.id && (
                    <Icon name="CheckCircle" size={16} className="text-primary flex-shrink-0" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-text-secondary">
                    {patient?.age} years • {patient?.gender}
                  </p>
                  <p className="text-sm text-accent font-medium">
                    {patient?.constitution}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Last visit: {new Date(patient.lastVisit)?.toLocaleDateString()}
                  </p>
                </div>
                
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {patient?.conditions?.slice(0, 2)?.map((condition, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-md"
                      >
                        {condition}
                      </span>
                    ))}
                    {patient?.conditions?.length > 2 && (
                      <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-md">
                        +{patient?.conditions?.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredPatients?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Users" size={48} className="text-text-secondary mx-auto mb-4" />
          <h4 className="font-medium text-text-primary mb-2">No patients found</h4>
          <p className="text-text-secondary">
            Try adjusting your search criteria or add a new patient
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientSelector;