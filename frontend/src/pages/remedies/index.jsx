import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';

const Remedies = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const remedyCategories = [
    {
      id: 1,
      title: 'Digestive Remedies',
      sanskrit: 'Agni Deepana',
      icon: 'Heart',
      recommended: [
        'Warm water throughout the day',
        'Ginger + lemon tea',
        'Cumin–coriander–fennel (CCF) tea',
        'Eat at regular timings',
        'Add a pinch of hing (asafoetida) in meals'
      ],
      avoid: [
        'Cold drinks',
        'Raw salads at night',
        'Overeating'
      ]
    },
    {
      id: 2,
      title: 'Immunity Boosting Remedies',
      sanskrit: 'Ojas Vardhak',
      icon: 'Shield',
      recommended: [
        'Tulsi + ginger + honey tea',
        'Turmeric milk',
        'Fresh fruits like amla, pomegranate',
        'Morning sunlight exposure',
        'Yoga + pranayama'
      ],
      avoid: [
        'Cold foods',
        'Stress',
        'Skipping meals'
      ]
    },
    {
      id: 3,
      title: 'Sleep Remedies',
      sanskrit: 'Nidra Vardhak',
      icon: 'Moon',
      recommended: [
        'Warm milk with nutmeg',
        'Foot massage with sesame oil',
        'Calm music before bed',
        'Light dinner before 8 PM',
        'Fixed sleep schedule'
      ],
      avoid: [
        'Mobile screens late at night',
        'Caffeine after evening',
        'Heavy meals'
      ]
    },
    {
      id: 4,
      title: 'Stress & Anxiety Remedies',
      sanskrit: 'Manas Shanti',
      icon: 'Brain',
      recommended: [
        'Meditation 10–20 min',
        'Deep breathing exercises',
        'Brahmi tea',
        'Nature walk',
        'Gratitude journaling'
      ],
      avoid: [
        'Overthinking',
        'Excess social media',
        'Working continuously without breaks'
      ]
    },
    {
      id: 5,
      title: 'Skin Health Remedies',
      sanskrit: 'Twacha Poshan',
      icon: 'Sparkles',
      recommended: [
        'Hydration: 2.5–3 L water',
        'Aloe vera juice',
        'Turmeric water',
        'Coconut/sesame oil massage',
        'Fruits: papaya, pomegranate'
      ],
      avoid: [
        'Junk food',
        'Sleeping late',
        'Harsh chemical products'
      ]
    },
    {
      id: 6,
      title: 'Hair Remedies',
      sanskrit: 'Keshya Upachara',
      icon: 'Scissors',
      recommended: [
        'Warm oil massage (coconut/sesame)',
        'Amla + bhringraj powder',
        'Balanced diet',
        'Gentle shampoo twice a week'
      ],
      avoid: [
        'Daily hair wash',
        'Too much heat styling',
        'Stress'
      ]
    },
    {
      id: 7,
      title: 'Menstrual Health Remedies',
      sanskrit: 'Stri Swasthya',
      icon: 'Heart',
      recommended: [
        'Warm water',
        'Light yoga (not inversions)',
        'Fennel tea',
        'Iron-rich foods (beetroot, spinach)',
        'Proper rest'
      ],
      avoid: [
        'Cold drinks',
        'Heavy workouts',
        'Skipping meals'
      ]
    },
    {
      id: 8,
      title: 'Weight Management Remedies',
      sanskrit: 'Sthoulya Upachara',
      icon: 'Activity',
      recommended: [
        'Morning walk 45 minutes',
        'Warm water with lemon',
        'Millets/barley instead of wheat',
        'Early dinner',
        'Triphala at night (general detox)'
      ],
      avoid: [
        'Sugar-heavy foods',
        'Late night eating',
        'Sedentary routine'
      ]
    },
    {
      id: 9,
      title: 'Heart Health Remedies',
      sanskrit: 'Hridya Raksha',
      icon: 'Heart',
      recommended: [
        'Garlic + warm water',
        'Ginger + cumin tea',
        'Low-salt diet',
        'Regular walking',
        'Early, light dinner'
      ],
      avoid: [
        'Stress',
        'Heavy/oily foods',
        'Excess salt'
      ]
    },
    {
      id: 10,
      title: 'Joint Pain Remedies',
      sanskrit: 'Sandhi Shool',
      icon: 'Activity',
      recommended: [
        'Warm sesame oil massage',
        'Turmeric + black pepper',
        'Light stretching',
        'Hot water fomentation',
        'Sunlight exposure'
      ],
      avoid: [
        'Cold foods',
        'Long sitting',
        'Overloading joints'
      ]
    }
  ];

  const selectedRemedy = remedyCategories.find(cat => cat.id === selectedCategory) || remedyCategories[0];

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
                Ayurvedic Remedies
              </h1>
              <p className="text-text-secondary">
                Traditional remedies and recommendations for holistic wellness
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-4 sticky top-6">
                  <h3 className="font-semibold text-text-primary mb-4">Categories</h3>
                  <div className="space-y-2">
                    {remedyCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-smooth ${
                          selectedCategory === category.id || (!selectedCategory && category.id === 1)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon name={category.icon} size={16} />
                          <span className="font-medium">{category.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-card rounded-lg border border-border shadow-organic p-6">
                  {/* Category Header */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-brand-gradient rounded-lg flex items-center justify-center">
                        <Icon name={selectedRemedy.icon} size={24} color="white" />
                      </div>
                      <div>
                        <h2 className="font-heading font-bold text-2xl text-text-primary">
                          {selectedRemedy.title}
                        </h2>
                        <p className="text-accent font-medium text-sm">
                          {selectedRemedy.sanskrit}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Section */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Icon name="CheckCircle" size={20} className="text-success" />
                      <h3 className="font-semibold text-lg text-text-primary">Recommended</h3>
                    </div>
                    <div className="space-y-3">
                      {selectedRemedy.recommended.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-success/5 rounded-lg border border-success/20">
                          <Icon name="Check" size={18} className="text-success flex-shrink-0 mt-0.5" />
                          <p className="text-text-primary">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Avoid Section */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Icon name="XCircle" size={20} className="text-error" />
                      <h3 className="font-semibold text-lg text-text-primary">Avoid</h3>
                    </div>
                    <div className="space-y-3">
                      {selectedRemedy.avoid.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-error/5 rounded-lg border border-error/20">
                          <Icon name="X" size={18} className="text-error flex-shrink-0 mt-0.5" />
                          <p className="text-text-primary">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ayurvedic Principles Info */}
                <div className="mt-6 bg-muted rounded-lg border border-border p-6">
                  <div className="flex items-start space-x-3">
                    <Icon name="Leaf" size={24} className="text-success flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">Ayurvedic Principles</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        These remedies are based on traditional Ayurvedic wisdom and should be practiced consistently 
                        for best results. Always consult with your practitioner before making significant changes to 
                        your routine, especially if you have existing health conditions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Remedies;
