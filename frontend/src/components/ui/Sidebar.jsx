import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useSession } from '../../contexts/AuthContext';

const Sidebar = ({ isCollapsed = false, onToggleCollapse, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data, signOut } = useSession();
  const user = data?.user || data?.session?.user;

  // Get role display name
  const getRoleDisplayName = (role) => {
    const roleMap = {
      'practitioner': 'Ayurvedic Practitioner',
      'doctor': 'Ayurvedic Doctor',
      'admin': 'Administrator',
      'patient': 'Patient'
    };
    return roleMap[role?.toLowerCase()] || 'User';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user?.name) return 'User';
    // Add "Dr." prefix for practitioners and doctors
    if (user.role === 'practitioner' || user.role === 'doctor') {
      return `Dr. ${user.name}`;
    }
    return user.name;
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const allNavigationItems = [
    { 
      name: 'Intelligent Dashboard', 
      path: '/intelligent-dashboard', 
      icon: 'LayoutDashboard',
      description: 'Overview & insights'
    },
    { 
      name: 'Create Patient Profile ', 
      path: '/patient-profile-builder', 
      icon: 'UserPlus',
      description: 'Create patient profiles'
    },
    { 
      name: 'AI Diet Generator', 
      path: '/ai-diet-generator', 
      icon: 'Brain',
      description: 'Generate personalized diets'
    },
    { 
      name: 'Diet Plan Viewer', 
      path: '/diet-plan-viewer', 
      icon: 'FileText',
      description: 'Review diet plan'
    },
    { 
      name: 'Food Explorer', 
      path: '/food-explorer', 
      icon: 'Search',
      description: 'Discover foods & nutrients'
    },
    { 
      name: 'Patient Records', 
      path: '/patient-records', 
      icon: 'Users',
      description: 'View past & existing patients'
    },
    { 
      name: 'Progress Analytics', 
      path: '/progress-analytics', 
      icon: 'BarChart3',
      description: 'Track patient progress'
    },
    { 
      name: 'Remedies', 
      path: '/remedies', 
      icon: 'Leaf',
      description: 'Ayurvedic remedies & wellness'
    }
  ];

  // Filter navigation items based on user role
  // Remove Progress Analytics for practitioners
  // Remove AI Diet Generator for patients
  // Show Patient Records only for practitioners
  // Show Remedies only for patients
  const navigationItems = allNavigationItems.filter(item => {
    if (!user || !user.role) return true; // Show all if user not loaded
    
    const userRole = String(user.role).toLowerCase();
    const isPractitioner = userRole === 'practitioner' || userRole === 'admin';
    const isPatient = userRole === 'patient';
    
    if (isPractitioner && item.path === '/progress-analytics') {
      return false;
    }
    if (isPatient && item.path === '/ai-diet-generator') {
      return false;
    }
    // Patient Records only for practitioners
    if (item.path === '/patient-records' && !isPractitioner) {
      return false;
    }
    // Remedies only for patients
    if (item.path === '/remedies' && !isPatient) {
      return false;
    }
    return true;
  });

  const bottomItems = [
    { name: 'Settings', path: '/settings', icon: 'Settings' },
    { name: 'Help & Support', path: '/help', icon: 'HelpCircle' }
  ];

  const isActivePath = (path) => location?.pathname === path;
  const shouldShowExpanded = !isCollapsed || isHovered;

  return (
    <aside 
      className={`bg-surface border-r border-border transition-all duration-300 ease-smooth fixed left-0 top-16 bottom-0 z-40 ${
        shouldShowExpanded ? 'w-64' : 'w-16'
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {shouldShowExpanded && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-brand-gradient rounded flex items-center justify-center">
                  <Icon name="Leaf" size={14} color="white" />
                </div>
                <span className="font-heading font-semibold text-sm text-brand-primary">
                  Navigation
                </span>
              </div>
            )}
            
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className={`${shouldShowExpanded ? '' : 'mx-auto'}`}
              >
                <Icon 
                  name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                  size={16} 
                />
              </Button>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navigationItems?.map((item) => {
            const isActive = isActivePath(item?.path);
            
            return (
              <Link
                key={item?.path}
                to={item?.path}
                className={`group flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-smooth relative ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-organic'
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}
              >
                <Icon 
                  name={item?.icon} 
                  size={18} 
                  className="flex-shrink-0"
                />
                {shouldShowExpanded && (
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {item?.name}
                    </div>
                    <div className={`text-xs truncate ${
                      isActive ? 'text-primary-foreground/80' : 'text-text-secondary'
                    }`}>
                      {item?.description}
                    </div>
                  </div>
                )}
                {/* Tooltip for collapsed state */}
                {isCollapsed && !isHovered && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-organic opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth whitespace-nowrap z-50">
                    {item?.name}
                  </div>
                )}
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-2 border-t border-border space-y-1">
          {bottomItems?.map((item) => {
            const isActive = isActivePath(item?.path);
            
            return (
              <Link
                key={item?.path}
                to={item?.path}
                className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-smooth relative ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}
              >
                <Icon 
                  name={item?.icon} 
                  size={16} 
                  className="flex-shrink-0"
                />
                {shouldShowExpanded && (
                  <span className="ml-3 truncate">
                    {item?.name}
                  </span>
                )}
                {/* Tooltip for collapsed state */}
                {isCollapsed && !isHovered && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-organic opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth whitespace-nowrap z-50">
                    {item?.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Profile Section */}
        {shouldShowExpanded && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-gradient rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-primary truncate">
                  {getUserDisplayName()}
                </div>
                <div className="text-xs text-text-secondary truncate">
                  {getRoleDisplayName(user?.role)}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive transition-smooth group"
                title="Logout"
              >
                <Icon name="LogOut" size={14} className="group-hover:scale-110 transition-transform" />
                <span className="ml-2 text-xs font-medium hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        )}
        
        {/* Collapsed User Profile (when sidebar is collapsed) */}
        {isCollapsed && !isHovered && (
          <div className="p-2 border-t border-border">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="w-full hover:bg-destructive/10 hover:text-destructive transition-smooth"
              title="Logout"
            >
              <Icon name="LogOut" size={16} />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;