import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSession } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import WelcomeCard from './components/WelcomeCard';
import StatsOverview from './components/StatsOverview';
import QuickActions from './components/QuickActions';
import HealthInsights from './components/HealthInsights';
import OnboardingTutorial from '../../components/Tutorial/OnboardingTutorial';
import Icon from '../../components/AppIcon';

const IntelligentDashboard = () => {
  const { data } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialChecked, setTutorialChecked] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    activities: [],
    insights: {},
    notifications: []
  });

  // Get user role from session and map to dashboard role format
  const getUserRole = () => {
    if (!data?.user?.role) return 'patient'; // Default to patient
    
    // Map backend roles to dashboard roles
    const roleMap = {
      'Admin': 'admin',
      'Practitioner': 'practitioner',
      'Patient': 'patient'
    };
    
    return roleMap[data.user.role] || 'patient';
  };

  const userRole = getUserRole();
  const userName = data?.user?.name || 'User';
  const userRoleForTutorial = data?.user?.role || 'Patient'; // Use backend role format
  const userEmail = data?.user?.email || data?.session?.user?.email;

  // Check if tutorial should be shown on mount
  useEffect(() => {
    // Wait a bit for session data to load
    const checkTutorial = () => {
      const email = data?.user?.email || data?.session?.user?.email;
      const role = userRoleForTutorial?.toLowerCase();
      
      if (!role) {
        // Retry after a short delay if role not available yet
        setTimeout(checkTutorial, 500);
        return;
      }
      
      // Check tutorial completion status - use email-specific key for per-user tracking
      const tutorialCompletedKey = email ? `tutorial_completed_${email}` : `tutorial_completed_${role}`;
      const tutorialCompleted = localStorage.getItem(tutorialCompletedKey);
      
      // If email is available, check user-specific flags
      let shouldShowTutorial = false;
      
      if (email) {
        const isNewUser = localStorage.getItem(`is_new_user_${email}`);
        const showTutorialFlag = localStorage.getItem(`show_tutorial_${email}`);
        const hasLoggedInBefore = localStorage.getItem(`has_logged_in_${email}`);
        
        console.log('Tutorial check (with email):', {
          email,
          isNewUser,
          showTutorialFlag,
          hasLoggedInBefore,
          tutorialCompleted,
          tutorialCompletedKey,
          role
        });
        
        // Show tutorial if:
        // 1. User is new (just signed up) OR has show_tutorial flag
        // 2. User hasn't logged in before (not a returning user)
        // 3. Tutorial hasn't been completed for THIS specific user (by email)
        shouldShowTutorial = 
          (isNewUser === 'true' || showTutorialFlag === 'true') && 
          hasLoggedInBefore !== 'true' && 
          tutorialCompleted !== 'true';
      } else {
        // Fallback: if no email available but tutorial not completed, show it
        // This handles edge cases where email might not be loaded yet
        console.log('Tutorial check (no email, fallback):', {
          tutorialCompleted,
          tutorialCompletedKey,
          role
        });
        // Only show if tutorial hasn't been completed (for new users without email in session)
        shouldShowTutorial = tutorialCompleted !== 'true';
      }
      
      console.log('Should show tutorial:', shouldShowTutorial);
      
      if (shouldShowTutorial) {
        // Show tutorial after a short delay to let dashboard load
        setTimeout(() => {
          console.log('Showing tutorial now with role:', role);
          setShowTutorial(true);
        }, 1500);
      } else {
        console.log('Tutorial not showing. Reasons:', {
          hasEmail: !!email,
          isNewUser: email ? localStorage.getItem(`is_new_user_${email}`) : 'N/A',
          showTutorialFlag: email ? localStorage.getItem(`show_tutorial_${email}`) : 'N/A',
          hasLoggedInBefore: email ? localStorage.getItem(`has_logged_in_${email}`) : 'N/A',
          tutorialCompleted
        });
      }
    };
    
    // Initial check after a delay to ensure session is loaded
    const timer = setTimeout(() => {
      checkTutorial();
      setTutorialChecked(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [data?.user?.email, data?.session?.user?.email, userRoleForTutorial, data]);

  // Mock user data (fallback if session data not available)
  const userData = {
    practitioner: {
      name: data?.user?.name || 'Dr. Practitioner',
      title: 'Senior Ayurvedic Practitioner',
      avatar: data?.user?.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
    },
    patient: {
      name: data?.user?.name || 'Patient',
      title: 'Wellness Journey Member',
      avatar: data?.user?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    admin: {
      name: data?.user?.name || 'Admin User',
      title: 'System Administrator',
      avatar: data?.user?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  };

  const currentUser = userData?.[userRole];

  useEffect(() => {
    // Update current time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now?.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 60000); // Update every minute

    // Simulate loading dashboard data
    const loadDashboardData = () => {
      setDashboardData({
        stats: {
          activePatients: 24,
          dietPlans: 156,
          daysOnPlan: 45,
          complianceRate: 92,
          weightProgress: -3.2,
          energyLevel: 8.5,
          totalUsers: 1247,
          activeSessions: 89,
          systemHealth: 98.5,
          supportTickets: 12
        },
        activities: [],
        insights: {}
      });
    };

    loadDashboardData();

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    
    // Mark that user has logged in (so tutorial won't show again)
    const email = data?.user?.email || data?.session?.user?.email;
    const role = userRoleForTutorial?.toLowerCase();
    
    if (email) {
      // Mark tutorial as completed for THIS specific user (by email)
      localStorage.setItem(`tutorial_completed_${email}`, 'true');
      localStorage.setItem(`has_logged_in_${email}`, 'true');
      // Remove new user flags
      localStorage.removeItem(`is_new_user_${email}`);
      localStorage.removeItem(`show_tutorial_${email}`);
      console.log('Tutorial completed, marked as logged in:', email);
    } else if (role) {
      // Fallback: mark by role if no email
      localStorage.setItem(`tutorial_completed_${role}`, 'true');
    }
  };

  return (
    <>
      <Helmet>
        <title>Intelligent Dashboard - Ayutra</title>
        <meta name="description" content="Personalized command center for Ayurvedic wellness management with role-based insights and analytics." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Onboarding Tutorial */}
        {showTutorial && userRoleForTutorial && (
          <OnboardingTutorial
            userRole={userRoleForTutorial}
            userEmail={data?.user?.email || data?.session?.user?.email}
            onComplete={handleTutorialComplete}
          />
        )}
        
        {/* Debug: Show tutorial status (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-card border border-border p-2 rounded text-xs z-40">
            <div>Tutorial: {showTutorial ? 'SHOWING' : 'HIDDEN'}</div>
            <div>Role: {userRoleForTutorial || 'N/A'}</div>
            <div>Email: {data?.user?.email || data?.session?.user?.email || 'N/A'}</div>
            <div>Checked: {tutorialChecked ? 'YES' : 'NO'}</div>
            <button 
              onClick={() => {
                const email = data?.user?.email || data?.session?.user?.email;
                if (email) {
                  localStorage.setItem(`show_tutorial_${email}`, 'true');
                  localStorage.setItem(`is_new_user_${email}`, 'true');
                  localStorage.removeItem(`has_logged_in_${email}`);
                  localStorage.removeItem(`tutorial_completed_${email}`);
                }
                // Also clear role-based completion
                if (userRoleForTutorial) {
                  localStorage.removeItem(`tutorial_completed_${userRoleForTutorial?.toLowerCase()}`);
                }
                setShowTutorial(true);
              }}
              className="mt-2 px-2 py-1 bg-primary text-white rounded text-xs"
            >
              Force Show Tutorial
            </button>
          </div>
        )}
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
            
            {/* Welcome Section */}
            <WelcomeCard 
              userRole={userRole}
              userName={userName}
              currentTime={currentTime}
            />

            {/* Stats Overview */}
            <StatsOverview 
              userRole={userRole}
              stats={dashboardData?.stats}
            />

            {/* Main Dashboard Grid */}
            <div className="space-y-8">
              <QuickActions userRole={userRole} />
            </div>

            {/* Health Insights Section */}
            <HealthInsights 
              userRole={userRole}
              insights={dashboardData?.insights}
            />

            {/* Footer */}
            <footer className="border-t border-border py-6 mt-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="text-sm text-text-secondary">
                  © {new Date()?.getFullYear()} Ayutra. All rights reserved.
                </span>
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
                  <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
                  <a href="#" className="hover:text-text-primary transition-colors">Support</a>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
};

export default IntelligentDashboard;