import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import DarkModeToggle from './DarkModeToggle';
import { useSession } from '../../contexts/AuthContext';

const Header = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { data } = useSession();
  const user = data?.user || data?.session?.user;

  const allNavigationItems = [
    { name: 'Dashboard', path: '/intelligent-dashboard', icon: 'LayoutDashboard' },
    { name: 'Patient Builder', path: '/patient-profile-builder', icon: 'UserPlus' },
    { name: 'AI Diet Generator', path: '/ai-diet-generator', icon: 'Brain' },
    { name: 'Diet Plans', path: '/diet-plan-viewer', icon: 'FileText' },
    { name: 'Food Explorer', path: '/food-explorer', icon: 'Search' },
    { name: 'Patient Records', path: '/patient-records', icon: 'Users' },
    { name: 'Remedies', path: '/remedies', icon: 'Leaf' }
  ];

  // Filter navigation items based on user role
  // Remove AI Diet Generator for patients
  // Show Patient Records only for practitioners
  // Show Remedies only for patients
  const navigationItems = allNavigationItems.filter(item => {
    if (!user || !user.role) return true; // Show all if user not loaded
    
    const userRole = String(user.role).toLowerCase();
    const isPractitioner = userRole === 'practitioner' || userRole === 'admin';
    const isPatient = userRole === 'patient';
    
    // Hide AI Diet Generator for patients
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

  const allSecondaryItems = [
    { name: 'Patient Records', path: '/patient-records', icon: 'Users' },
    { name: 'Progress Analytics', path: '/progress-analytics', icon: 'BarChart3' },
    { name: 'Remedies', path: '/remedies', icon: 'Leaf' },
    { name: 'Settings', path: '/settings', icon: 'Settings' },
    { name: 'Help', path: '/help', icon: 'HelpCircle' }
  ];

  // Filter secondary items based on user role
  // Remove Progress Analytics for practitioners
  // Show Patient Records only for practitioners
  // Show Remedies only for patients
  const secondaryItems = allSecondaryItems.filter(item => {
    if (!user || !user.role) return true; // Show all if user not loaded
    
    const userRole = String(user.role).toLowerCase();
    const isPractitioner = userRole === 'practitioner' || userRole === 'admin';
    const isPatient = userRole === 'patient';
    
    if (isPractitioner && item.path === '/progress-analytics') {
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

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`bg-background border-b border-border sticky top-0 z-50 ${className}`}>
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo */}
          <Link to="/intelligent-dashboard" className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
              <Icon name="Leaf" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg text-brand-primary leading-none">
                Ayutra
              </span>
              <span className="font-accent text-xs text-text-secondary leading-none">
                Bridging Science and Ayurvedic Wisdom
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-organic'
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.name}</span>
              </Link>
            ))}
            
            {/* More Menu */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Icon name="MoreHorizontal" size={16} />
                <span>More</span>
              </Button>
              
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-organic opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth">
                <div className="py-1">
                  {secondaryItems?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      className={`flex items-center space-x-2 px-3 py-2 text-sm transition-smooth ${
                        isActivePath(item?.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* User Actions - Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            <DarkModeToggle />
            <Button variant="outline" size="sm">
              <Icon name="Bell" size={16} />
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="User" size={16} />
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-2">
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="px-4 py-3 space-y-1">
              {[...navigationItems, ...secondaryItems]?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-smooth ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground shadow-organic'
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.name}</span>
                </Link>
              ))}
              
              <div className="pt-3 mt-3 border-t border-border space-y-2">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" fullWidth>
                    <Icon name="Bell" size={16} />
                    <span className="ml-2">Notifications</span>
                  </Button>
                  <Button variant="outline" size="sm" fullWidth>
                    <Icon name="User" size={16} />
                    <span className="ml-2">Profile</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;