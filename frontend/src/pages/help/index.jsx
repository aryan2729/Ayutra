import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useSession } from '../../contexts/AuthContext';
import OnboardingTutorial from '../../components/Tutorial/OnboardingTutorial';

const Help = () => {
  const navigate = useNavigate();
  const { data } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  const userRole = data?.user?.role || 'Patient';

  const handleRestartTutorial = () => {
    // Clear tutorial completion status
    localStorage.removeItem(`tutorial_completed_${userRole?.toLowerCase()}`);
    setShowTutorial(true);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  const faqItems = [
    {
      question: 'How do I create a patient profile?',
      answer: 'Navigate to Patient Profile Builder from the sidebar. Fill in the personal information and complete the Ayurvedic constitution assessment.'
    },
    {
      question: 'How does the AI Diet Generator work?',
      answer: 'The AI Diet Generator creates personalized diet plans based on patient profiles, Ayurvedic principles, and health goals. Select a patient and generate a plan.'
    },
    {
      question: 'Can I edit a generated diet plan?',
      answer: 'Yes! Go to Diet Plan Viewer, select a patient, and click the edit icon next to any meal to modify it. You can also add serving sizes.'
    },
    {
      question: 'How do I track patient progress?',
      answer: 'Use Progress Analytics to view compliance rates, health metrics, and patient journey charts. Patients can also log their progress.'
    },
    {
      question: 'Where can I view all my patients?',
      answer: 'Go to Patient Records to see all active and archived patients. You can search, filter, and manage patient information from there.'
    }
  ];

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
          <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-heading font-bold text-3xl text-text-primary mb-2">
                Help & Support
              </h1>
              <p className="text-text-secondary">
                Get help with using Ayutra and learn about our features
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon name="PlayCircle" size={24} className="text-primary" />
                  <h3 className="font-semibold text-text-primary">Interactive Tutorial</h3>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  Take a guided tour through all the features of Ayutra
                </p>
                <Button
                  variant="default"
                  onClick={handleRestartTutorial}
                  iconName="Play"
                >
                  Start Tutorial
                </Button>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon name="Book" size={24} className="text-accent" />
                  <h3 className="font-semibold text-text-primary">Documentation</h3>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  Read detailed guides and documentation
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://ayush.delhi.gov.in/ayush/fundamental-principles', '_blank')}
                  iconName="ExternalLink"
                >
                  View Docs
                </Button>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-8">
              <h2 className="font-heading font-semibold text-2xl text-text-primary mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="bg-card rounded-lg border border-border p-6">
                    <h3 className="font-semibold text-text-primary mb-2 flex items-center space-x-2">
                      <Icon name="HelpCircle" size={18} className="text-primary" />
                      <span>{item.question}</span>
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center space-x-2">
                <Icon name="Mail" size={20} className="text-primary" />
                <span>Need More Help?</span>
              </h3>
              <p className="text-text-secondary mb-4">
                If you can't find what you're looking for, our support team is here to help.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => window.open('mailto:support@ayutra.com', '_blank')}
                  iconName="Mail"
                >
                  Email Support
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://youtube.com/playlist?list=PLFDwpbkuJXhrlQ2XfLL77VxNyU88D4SpX&si=O9kC1m4wdW-BAdNr', '_blank')}
                  iconName="Video"
                >
                  Watch Tutorial Videos
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <OnboardingTutorial
          userRole={userRole}
          onComplete={handleTutorialComplete}
        />
      )}
    </div>
  );
};

export default Help;
