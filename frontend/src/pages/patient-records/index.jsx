import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import { useSession } from '../../contexts/AuthContext';
import { patientAPI } from '../../services/api';

const PatientRecords = () => {
  const navigate = useNavigate();
  const { data } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConstitution, setFilterConstitution] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'archived'
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockPatients = [
    {
      _id: '1',
      isActive: true,
      age: 34,
      gender: 'Female',
      prakriti: 'Vata-Pitta',
      constitution: 'Vata-Pitta',
      createdAt: '2024-11-15T10:00:00Z',
      user: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com'
      }
    },
    {
      _id: '2',
      isActive: true,
      age: 42,
      gender: 'Male',
      prakriti: 'Pitta-Kapha',
      constitution: 'Pitta-Kapha',
      createdAt: '2024-11-20T14:30:00Z',
      user: {
        name: 'Michael Chen',
        email: 'michael.chen@example.com'
      }
    },
    {
      _id: '3',
      isActive: true,
      age: 28,
      gender: 'Female',
      prakriti: 'Kapha-Vata',
      constitution: 'Kapha-Vata',
      createdAt: '2024-12-01T09:15:00Z',
      user: {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com'
      }
    },
    {
      _id: '4',
      isActive: true,
      age: 55,
      gender: 'Male',
      prakriti: 'Vata',
      constitution: 'Vata',
      createdAt: '2024-10-10T11:20:00Z',
      user: {
        name: 'David Rodriguez',
        email: 'david.rodriguez@example.com'
      }
    },
    {
      _id: '5',
      isActive: true,
      age: 31,
      gender: 'Female',
      prakriti: 'Pitta',
      constitution: 'Pitta',
      createdAt: '2024-12-05T16:45:00Z',
      user: {
        name: 'Emily Watson',
        email: 'emily.watson@example.com'
      }
    },
    {
      _id: '6',
      isActive: true,
      age: 48,
      gender: 'Male',
      prakriti: 'Kapha',
      constitution: 'Kapha',
      createdAt: '2024-11-25T13:00:00Z',
      user: {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@example.com'
      }
    },
    {
      _id: '7',
      isActive: false,
      age: 39,
      gender: 'Female',
      prakriti: 'Vata-Pitta',
      constitution: 'Vata-Pitta',
      createdAt: '2024-08-15T10:30:00Z',
      user: {
        name: 'Jennifer Martinez',
        email: 'jennifer.martinez@example.com'
      }
    },
    {
      _id: '8',
      isActive: false,
      age: 45,
      gender: 'Male',
      prakriti: 'Pitta-Kapha',
      constitution: 'Pitta-Kapha',
      createdAt: '2024-07-20T15:00:00Z',
      user: {
        name: 'Robert Anderson',
        email: 'robert.anderson@example.com'
      }
    },
    {
      _id: '9',
      isActive: true,
      age: 26,
      gender: 'Female',
      prakriti: 'Kapha',
      constitution: 'Kapha',
      createdAt: '2024-12-10T08:20:00Z',
      user: {
        name: 'Lisa Thompson',
        email: 'lisa.thompson@example.com'
      }
    },
    {
      _id: '10',
      isActive: true,
      age: 37,
      gender: 'Male',
      prakriti: 'Vata-Kapha',
      constitution: 'Vata-Kapha',
      createdAt: '2024-11-30T12:10:00Z',
      user: {
        name: 'James Wilson',
        email: 'james.wilson@example.com'
      }
    },
    {
      _id: '11',
      isActive: false,
      age: 52,
      gender: 'Female',
      prakriti: 'Pitta',
      constitution: 'Pitta',
      createdAt: '2024-06-05T09:45:00Z',
      user: {
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com'
      }
    },
    {
      _id: '12',
      isActive: true,
      age: 29,
      gender: 'Male',
      prakriti: 'Vata',
      constitution: 'Vata',
      createdAt: '2024-12-12T14:30:00Z',
      user: {
        name: 'Kevin Brown',
        email: 'kevin.brown@example.com'
      }
    }
  ];

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await patientAPI.getAll();
        if (response?.data?.success && response.data.data?.patients?.length > 0) {
          setPatients(response.data.data?.patients || []);
        } else {
          // Use mock data if API returns empty or fails
          console.log('Using mock data for Patient Records');
          setPatients(mockPatients);
        }
      } catch (error) {
        console.error('Error fetching patients, using mock data:', error);
        // Use mock data on error
        setPatients(mockPatients);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Separate existing and past patients for stats
  const existingPatients = patients.filter(p => p.isActive !== false);
  const pastPatients = patients.filter(p => p.isActive === false);

  // Filter all patients based on search, constitution, and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = !searchTerm || 
      patient.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesConstitution = filterConstitution === 'all' ||
      patient.prakriti?.toLowerCase().includes(filterConstitution.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && patient.isActive !== false) ||
      (filterStatus === 'archived' && patient.isActive === false);
    
    return matchesSearch && matchesConstitution && matchesStatus;
  });

  const constitutionOptions = [
    { value: 'all', label: 'All Constitutions' },
    { value: 'vata', label: 'Vata' },
    { value: 'pitta', label: 'Pitta' },
    { value: 'kapha', label: 'Kapha' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Patients' },
    { value: 'active', label: 'Active Only' },
    { value: 'archived', label: 'Archived Only' }
  ];

  const handleViewPastDiet = (patient) => {
    // Navigate to past diets page for this patient
    navigate(`/past-diets?patient=${patient._id || patient.id}`);
  };

  const handleCreateNewDiet = (patient) => {
    // Navigate to AI Diet Generator with patient pre-selected
    navigate(`/ai-diet-generator?patient=${patient._id || patient.id}`);
  };

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
              <h1 className="font-heading font-bold text-3xl text-text-primary mb-2">
                Patient Records
              </h1>
              <p className="text-text-secondary">
                View and manage all your patients - active and archived
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <Input
                  placeholder="Search patients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                options={constitutionOptions}
                value={filterConstitution}
                onChange={setFilterConstitution}
                className="w-48"
              />
              <Select
                options={statusOptions}
                value={filterStatus}
                onChange={setFilterStatus}
                className="w-48"
              />
            </div>

            {/* Patients List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-text-secondary">Loading patients...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <Icon 
                  name="Users" 
                  size={48} 
                  className="text-text-secondary mx-auto mb-4" 
                />
                <h3 className="font-medium text-text-primary mb-2">
                  No Patients Found
                </h3>
                <p className="text-text-secondary">
                  {searchTerm || filterConstitution !== 'all' || filterStatus !== 'all'
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No patients in your records yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map((patient) => {
                  const user = patient.user || {};
                  const constitution = patient.prakriti || patient.constitution || 'Not Assessed';
                  const isArchived = patient.isActive === false;
                  
                  return (
                    <div 
                      key={patient._id || patient.id}
                      className={`bg-card rounded-lg border shadow-organic p-4 hover:shadow-organic-hover transition-smooth ${
                        isArchived ? 'border-border/50 opacity-75' : 'border-border'
                      }`}
                    >
                      <div className="flex items-start space-x-4 mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isArchived ? 'bg-muted' : 'bg-brand-gradient'
                        }`}>
                          <Icon name="User" size={20} color={isArchived ? "var(--color-text-secondary)" : "white"} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-text-primary truncate">
                            {user.name || 'Unknown Patient'}
                          </h3>
                          <p className="text-sm text-text-secondary truncate">
                            {user.email || 'No email'}
                          </p>
                        </div>
                        {isArchived && (
                          <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-full">
                            Archived
                          </span>
                        )}
                        {!isArchived && (
                          <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        {patient.age && (
                          <div className="flex items-center space-x-2 text-sm text-text-secondary">
                            <Icon name="Calendar" size={14} />
                            <span>{patient.age} years old</span>
                          </div>
                        )}
                        {patient.gender && (
                          <div className="flex items-center space-x-2 text-sm text-text-secondary">
                            <Icon name="User" size={14} />
                            <span className="capitalize">{patient.gender}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            constitution.toLowerCase().includes('vata') ? 'bg-blue-100 text-blue-700' :
                            constitution.toLowerCase().includes('pitta') ? 'bg-red-100 text-red-700' :
                            constitution.toLowerCase().includes('kapha') ? 'bg-green-100 text-green-700' :
                            'bg-muted text-text-secondary'
                          }`}>
                            {constitution}
                          </span>
                        </div>
                        {patient.createdAt && (
                          <div className="flex items-center space-x-2 text-xs text-text-secondary">
                            <Icon name="Clock" size={12} />
                            <span>
                              Added: {new Date(patient.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 pt-4 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPastDiet(patient)}
                          className="flex-1"
                          iconName="History"
                        >
                          Past Diet
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleCreateNewDiet(patient)}
                          className="flex-1"
                          iconName="Plus"
                        >
                          Create New Diet
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Summary Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Total Patients</p>
                    <p className="text-2xl font-bold text-text-primary">
                      {patients.length}
                    </p>
                  </div>
                  <Icon name="Users" size={24} className="text-primary" />
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Active Patients</p>
                    <p className="text-2xl font-bold text-success">
                      {existingPatients.length}
                    </p>
                  </div>
                  <Icon name="CheckCircle" size={24} className="text-success" />
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Archived Patients</p>
                    <p className="text-2xl font-bold text-text-secondary">
                      {pastPatients.length}
                    </p>
                  </div>
                  <Icon name="Archive" size={24} className="text-text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientRecords;
