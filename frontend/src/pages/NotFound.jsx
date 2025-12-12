import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 max-w-md">
        <div className="flex justify-center items-center mb-6">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <Icon name="AlertCircle" size={48} className="text-text-secondary" />
          </div>
        </div>
        <div className="flex flex-col gap-2 text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-text-primary">Page Not Found</h2>
          <p className="text-text-secondary">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Go Back
          </Button>
          <Button
            variant="default"
            onClick={() => navigate('/')}
            iconName="Home"
            iconPosition="left"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

