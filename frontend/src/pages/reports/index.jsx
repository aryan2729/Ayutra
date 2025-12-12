import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ExportReports from '../progress-analytics/components/ExportReports';
import DietReport from '../progress-analytics/components/DietReport';
import Select from '../../components/ui/Select';
import { useSession } from '../../contexts/AuthContext';
import { patientAPI } from '../../services/api';

const Reports = () => {
  const { data } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('reports');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [patientProfile, setPatientProfile] = useState(null);
  const [loadingPatientProfile, setLoadingPatientProfile] = useState(false);

  // Fetch patients list for practitioner
  useEffect(() => {
    const fetchPatients = async () => {
      if (data?.user?.role !== 'practitioner' && data?.user?.role !== 'admin') {
        return;
      }

      setLoadingPatients(true);
      try {
        // Fetch all patients created via Patient Profile Builder
        const response = await patientAPI.getAll();
        let fetchedPatients = [];
        
        if (response?.data?.success && response?.data?.data) {
          fetchedPatients = Array.isArray(response.data.data) 
            ? response.data.data 
            : (response.data.data.patients || []);
        }

        // Add comprehensive random/dummy patients for demonstration
        const dummyPatients = [
          {
            _id: 'dummy-1',
            isActive: true,
            age: 34,
            gender: 'Female',
            prakriti: 'Vata-Pitta',
            vata_state: 'Moderate',
            pitta_state: 'Moderate',
            kapha_state: 'Low',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            user: {
              _id: 'dummy-user-1',
              name: 'Sarah Johnson',
              email: 'sarah.johnson@example.com'
            }
          },
          {
            _id: 'dummy-2',
            isActive: true,
            age: 42,
            gender: 'Male',
            prakriti: 'Pitta-Kapha',
            vata_state: 'Low',
            pitta_state: 'Moderate',
            kapha_state: 'Moderate',
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            user: {
              _id: 'dummy-user-2',
              name: 'Michael Chen',
              email: 'michael.chen@example.com'
            }
          },
          {
            _id: 'dummy-3',
            isActive: true,
            age: 28,
            gender: 'Female',
            prakriti: 'Kapha-Vata',
            vata_state: 'Moderate',
            pitta_state: 'Low',
            kapha_state: 'Moderate',
            createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
            user: {
              _id: 'dummy-user-3',
              name: 'Priya Sharma',
              email: 'priya.sharma@example.com'
            }
          },
          {
            _id: 'dummy-4',
            isActive: true,
            age: 55,
            gender: 'Male',
            prakriti: 'Vata',
            vata_state: 'High',
            pitta_state: 'Low',
            kapha_state: 'Low',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            user: {
              _id: 'dummy-user-4',
              name: 'David Rodriguez',
              email: 'david.rodriguez@example.com'
            }
          },
          {
            _id: 'dummy-5',
            isActive: true,
            age: 31,
            gender: 'Female',
            prakriti: 'Pitta',
            vata_state: 'Low',
            pitta_state: 'High',
            kapha_state: 'Low',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            user: {
              _id: 'dummy-user-5',
              name: 'Emily Watson',
              email: 'emily.watson@example.com'
            }
          },
          {
            _id: 'dummy-6',
            isActive: true,
            age: 48,
            gender: 'Male',
            prakriti: 'Kapha',
            vata_state: 'Low',
            pitta_state: 'Low',
            kapha_state: 'High',
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            user: {
              _id: 'dummy-user-6',
              name: 'Rajesh Kumar',
              email: 'rajesh.kumar@example.com'
            }
          },
          {
            _id: 'dummy-7',
            isActive: true,
            age: 29,
            gender: 'Female',
            prakriti: 'Vata-Kapha',
            vata_state: 'Moderate',
            pitta_state: 'Low',
            kapha_state: 'Moderate',
            createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
            user: {
              _id: 'dummy-user-7',
              name: 'Lisa Anderson',
              email: 'lisa.anderson@example.com'
            }
          },
          {
            _id: 'dummy-8',
            isActive: true,
            age: 37,
            gender: 'Male',
            prakriti: 'Pitta-Vata',
            vata_state: 'Moderate',
            pitta_state: 'Moderate',
            kapha_state: 'Low',
            createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            user: {
              _id: 'dummy-user-8',
              name: 'James Wilson',
              email: 'james.wilson@example.com'
            }
          },
          {
            _id: 'dummy-9',
            isActive: true,
            age: 45,
            gender: 'Female',
            prakriti: 'Kapha-Pitta',
            vata_state: 'Low',
            pitta_state: 'Moderate',
            kapha_state: 'Moderate',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            user: {
              _id: 'dummy-user-9',
              name: 'Maria Garcia',
              email: 'maria.garcia@example.com'
            }
          },
          {
            _id: 'dummy-10',
            isActive: true,
            age: 52,
            gender: 'Male',
            prakriti: 'Vata-Pitta-Kapha',
            vata_state: 'Moderate',
            pitta_state: 'Moderate',
            kapha_state: 'Moderate',
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            user: {
              _id: 'dummy-user-10',
              name: 'Robert Brown',
              email: 'robert.brown@example.com'
            }
          }
        ];

        // Combine fetched patients with dummy patients
        const allPatients = [...fetchedPatients, ...dummyPatients];
        setPatients(allPatients);
        
        // Auto-select first patient if none selected, so reports show immediately
        if (allPatients.length > 0 && !selectedPatientId) {
          const firstPatient = allPatients[0];
          // Handle different patient data structures
          const firstPatientId = firstPatient.user?._id || 
                                (typeof firstPatient.user === 'string' ? firstPatient.user : null) ||
                                firstPatient._id;
          setSelectedPatientId(firstPatientId);
          
          // Also set patient profile immediately for dummy patients
          if (firstPatient._id?.startsWith('dummy-')) {
            setPatientProfile(firstPatient);
          }
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        // Use dummy data if API fails
        const dummyPatients = [
          {
            _id: 'dummy-1',
            isActive: true,
            age: 34,
            gender: 'Female',
            prakriti: 'Vata-Pitta',
            user: { _id: 'dummy-user-1', name: 'Sarah Johnson', email: 'sarah@example.com' }
          },
          {
            _id: 'dummy-2',
            isActive: true,
            age: 42,
            gender: 'Male',
            prakriti: 'Pitta-Kapha',
            user: { _id: 'dummy-user-2', name: 'Michael Chen', email: 'michael@example.com' }
          }
        ];
        setPatients(dummyPatients);
        if (dummyPatients.length > 0 && !selectedPatientId) {
          setSelectedPatientId(dummyPatients[0].user?._id || dummyPatients[0]._id);
        }
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [data?.user?.role]);

  // Fetch patient profile when patient is selected
  useEffect(() => {
    const fetchPatientProfile = async () => {
      if (!selectedPatientId) return;

      setLoadingPatientProfile(true);
      try {
        // Check if it's a dummy patient
        const selectedPatient = patients.find(p => {
          const pid = p.user?._id || (typeof p.user === 'string' ? p.user : null) || p._id;
          return pid === selectedPatientId;
        });

        // If it's a dummy patient, use its data directly
        if (selectedPatient?._id?.startsWith('dummy-')) {
          setPatientProfile(selectedPatient);
          setLoadingPatientProfile(false);
          return;
        }

        // Otherwise, fetch from API
        const response = await patientAPI.getById(selectedPatientId);
        if (response?.data?.success && response?.data?.data?.patient) {
          setPatientProfile(response.data.data.patient);
        } else if (selectedPatient) {
          // Use patient data from list if API fails
          setPatientProfile(selectedPatient);
        }
      } catch (error) {
        console.error('Error fetching patient profile:', error);
        // Use patient data from list if available
        const selectedPatient = patients.find(p => {
          const pid = p.user?._id || (typeof p.user === 'string' ? p.user : null) || p._id;
          return pid === selectedPatientId;
        });
        if (selectedPatient) {
          setPatientProfile(selectedPatient);
        } else {
          // Use default mock data
          setPatientProfile({
            prakriti: 'Vata-Pitta',
            vata_state: 'Moderate',
            pitta_state: 'Moderate',
            kapha_state: 'Low'
          });
        }
      } finally {
        setLoadingPatientProfile(false);
      }
    };

    if (patients.length > 0) {
      fetchPatientProfile();
    }
  }, [selectedPatientId, patients]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const tabs = [
    { id: 'reports', label: 'Export Reports', icon: 'Download' },
    { id: 'diet-report', label: 'Diet Report', icon: 'FileText' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Top Menu (Always Visible) */}
      <Header />

      <div className="flex">
        {/* Sidebar - Left Navigation (Always Visible) */}
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        } p-6 space-y-8`}>
          
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Reports</h1>
              <p className="text-text-secondary">
                View and download patient reports and analytics
              </p>
            </div>
          </div>

          {/* Patient Selection */}
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-text-primary whitespace-nowrap">
                Select Patient:
              </label>
              <Select
                value={selectedPatientId || ''}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="flex-1"
                disabled={loadingPatients}
              >
                <option value="">-- Select a patient --</option>
                {patients.map((patient, index) => {
                  const patientId = patient.user?._id || patient.user || patient._id;
                  const patientName = patient.user?.name || patient.name || `Patient ${patientId}`;
                  const patientEmail = patient.user?.email || '';
                  const isDummy = patient._id?.startsWith('dummy-');
                  const displayName = `${patientName}${patientEmail ? ` (${patientEmail})` : ''}${isDummy ? ' [Demo]' : ''}`;
                  return (
                    <option key={`${patientId}-${index}`} value={patientId}>
                      {displayName}
                    </option>
                  );
                })}
              </Select>
              {loadingPatients && (
                <Icon name="Loader" size={20} className="animate-spin text-primary" />
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {!selectedPatientId ? (
            <div className="bg-card rounded-lg p-12 border border-border text-center">
              <Icon name="FileText" size={64} className="mx-auto mb-4 text-text-secondary" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No Patient Selected
              </h3>
              <p className="text-text-secondary">
                Please select a patient from the dropdown above to view their reports.
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-4 border border-border mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="User" size={20} className="text-primary" />
                      <span className="font-semibold text-text-primary">
                        Patient: {patients.find(p => {
                          const pid = p.user?._id || p.user || p._id;
                          return pid === selectedPatientId;
                        })?.user?.name || 'Selected Patient'}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Export comprehensive reports for the selected patient
                    </p>
                  </div>
                  <ExportReports 
                    onExport={() => {
                      const selectedPatient = patients.find(p => {
                        const pid = p.user?._id || p.user || p._id;
                        return pid === selectedPatientId;
                      });
                      console.log('Report exported for patient:', selectedPatient?.user?.name);
                    }} 
                  />
                </div>
              )}

              {activeTab === 'diet-report' && (
                <div className="space-y-6">
                  {loadingPatientProfile ? (
                    <div className="bg-card rounded-lg p-12 border border-border text-center">
                      <Icon name="Loader" size={48} className="mx-auto mb-4 text-primary animate-spin" />
                      <p className="text-text-secondary">Loading patient profile...</p>
                    </div>
                  ) : (
                    <div>
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
                          fullName: patients.find(p => {
                            const pid = p.user?._id || p.user || p._id;
                            return pid === selectedPatientId;
                          })?.user?.name || 
                          patients.find(p => {
                            const pid = p.user?._id || p.user || p._id;
                            return pid === selectedPatientId;
                          })?.name || 
                          'Patient',
                          age: patientProfile?.age || patients.find(p => {
                            const pid = p.user?._id || p.user || p._id;
                            return pid === selectedPatientId;
                          })?.age || 30,
                          gender: patientProfile?.gender || patients.find(p => {
                            const pid = p.user?._id || p.user || p._id;
                            return pid === selectedPatientId;
                          })?.gender || 'prefer-not-to-say',
                          id: selectedPatientId,
                          prakriti: patientProfile?.prakriti || patients.find(p => {
                            const pid = p.user?._id || p.user || p._id;
                            return pid === selectedPatientId;
                          })?.prakriti,
                          vataState: patientProfile?.vata_state || patients.find(p => {
                            const pid = p.user?._id || p.user || p._id;
                            return pid === selectedPatientId;
                          })?.vata_state,
                          pittaState: patientProfile?.pitta_state || patients.find(p => {
                            const pid = p.user?._id || p.user || p._id;
                            return pid === selectedPatientId;
                          })?.pitta_state,
                          kaphaState: patientProfile?.kapha_state || patients.find(p => {
                            const pid = p.user?._id || p.user || p._id;
                            return pid === selectedPatientId;
                          })?.kapha_state
                        }}
                        dietPlan={{
                          totalCalories: 1800,
                          proteinTarget: 75,
                          carbTarget: 240
                        }}
                        metrics={[]}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reports;
