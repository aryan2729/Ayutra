import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useSession } from '../../contexts/AuthContext';
import { patientAPI, dietPlanAPI } from '../../services/api';

const PastDiets = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patient');
  const { data } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [patient, setPatient] = useState(null);
  const [pastDiets, setPastDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiet, setSelectedDiet] = useState(null);

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        setLoading(false);
        return;
      }

      try {
        const response = await patientAPI.getById(patientId);
        if (response?.data?.success) {
          setPatient(response.data.data?.patient);
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Fetch past diet plans for this patient
  useEffect(() => {
    const fetchPastDiets = async () => {
      if (!patientId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await dietPlanAPI.getAll({ patientId, status: 'completed' });
        if (response?.data?.success) {
          setPastDiets(response.data.data?.dietPlans || []);
        } else {
          // Fallback to mock data for now
          setPastDiets(getMockPastDiets());
        }
      } catch (error) {
        console.error('Error fetching past diets:', error);
        // Fallback to mock data
        setPastDiets(getMockPastDiets());
      } finally {
        setLoading(false);
      }
    };

    fetchPastDiets();
  }, [patientId]);

  // Mock past diets data
  const getMockPastDiets = () => {
    return [
      {
        id: 'diet_1',
        name: 'Vata Balancing Diet - Winter 2024',
        duration: '4 weeks',
        startDate: '2024-10-01',
        endDate: '2024-10-29',
        status: 'completed',
        totalCalories: 1800,
        createdAt: '2024-09-28T10:00:00Z'
      },
      {
        id: 'diet_2',
        name: 'Pitta Cooling Diet - Summer 2024',
        duration: '6 weeks',
        startDate: '2024-07-15',
        endDate: '2024-08-26',
        status: 'completed',
        totalCalories: 2000,
        createdAt: '2024-07-10T14:30:00Z'
      },
      {
        id: 'diet_3',
        name: 'Kapha Energizing Diet - Spring 2024',
        duration: '4 weeks',
        startDate: '2024-04-01',
        endDate: '2024-04-29',
        status: 'completed',
        totalCalories: 1900,
        createdAt: '2024-03-25T09:15:00Z'
      }
    ];
  };

  const handleViewDiet = (diet) => {
    navigate(`/diet-plan-viewer?diet=${diet.id}&patient=${patientId}`);
  };

  if (!patientId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-text-secondary mx-auto mb-4" />
            <h3 className="font-medium text-text-primary mb-2">No Patient Selected</h3>
            <p className="text-text-secondary mb-4">
              Please select a patient from Patient Records to view their past diets.
            </p>
            <Button
              variant="default"
              onClick={() => navigate('/patient-records')}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back to Patient Records
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const user = patient?.user || {};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="font-heading font-bold text-3xl text-text-primary mb-2">
                    Past Diet Plans
                  </h1>
                  {patient && (
                    <div className="flex items-center space-x-4 mt-2">
                      <p className="text-text-secondary">
                        Patient: <span className="font-medium text-text-primary">{user.name || 'Unknown'}</span>
                      </p>
                      <span className="text-text-secondary">•</span>
                      <p className="text-text-secondary">
                        {user.email || 'No email'}
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/patient-records')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to Records
                </Button>
              </div>
            </div>

            {/* Past Diets List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-text-secondary">Loading past diets...</p>
              </div>
            ) : pastDiets.length === 0 ? (
              <div className="text-center py-12">
                <Icon 
                  name="FileText" 
                  size={48} 
                  className="text-text-secondary mx-auto mb-4" 
                />
                <h3 className="font-medium text-text-primary mb-2">
                  No Past Diet Plans Found
                </h3>
                <p className="text-text-secondary mb-4">
                  This patient doesn't have any completed diet plans yet.
                </p>
                <Button
                  variant="default"
                  onClick={() => navigate(`/ai-diet-generator?patient=${patientId}`)}
                  iconName="Plus"
                >
                  Create New Diet Plan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {pastDiets.map((diet) => (
                  <div
                    key={diet.id}
                    className="bg-card rounded-lg border border-border shadow-organic p-6 hover:shadow-organic-hover transition-smooth"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Icon name="FileText" size={24} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-text-primary text-lg">
                              {diet.name}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-text-secondary">
                              <span className="flex items-center space-x-1">
                                <Icon name="Calendar" size={14} />
                                <span>
                                  {diet.startDate && new Date(diet.startDate).toLocaleDateString()} - {diet.endDate && new Date(diet.endDate).toLocaleDateString()}
                                </span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Icon name="Clock" size={14} />
                                <span>{diet.duration}</span>
                              </span>
                              {diet.totalCalories && (
                                <span className="flex items-center space-x-1">
                                  <Icon name="Zap" size={14} />
                                  <span>{diet.totalCalories} cal/day</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-success/10 text-success text-xs rounded-full font-medium">
                            Completed
                          </span>
                          {diet.createdAt && (
                            <span className="text-xs text-text-secondary">
                              Created: {new Date(diet.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="default"
                        onClick={() => handleViewDiet(diet)}
                        iconName="Eye"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create New Diet Button */}
            {pastDiets.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button
                  variant="default"
                  onClick={() => navigate(`/ai-diet-generator?patient=${patientId}`)}
                  iconName="Plus"
                >
                  Create New Diet Plan
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PastDiets;
