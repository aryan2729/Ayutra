import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIGenerationEngine = ({ patient, preferences, onGenerationComplete }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const generationPhases = [
    {
      id: 1,
      title: "Analyzing Patient Profile",
      description: "Processing constitution, health conditions, and medical history",
      icon: "User",
      duration: 2000
    },
    {
      id: 2,
      title: "Evaluating Dietary Preferences",
      description: "Incorporating restrictions, allergies, and food preferences",
      icon: "Utensils",
      duration: 1500
    },
    {
      id: 3,
      title: "Applying Ayurvedic Principles",
      description: "Balancing doshas and selecting appropriate foods",
      icon: "Leaf",
      duration: 2500
    },
    {
      id: 4,
      title: "Generating Meal Plans",
      description: "Creating personalized breakfast, lunch, and dinner options",
      icon: "ChefHat",
      duration: 3000
    },
    {
      id: 5,
      title: "Optimizing Nutrition",
      description: "Ensuring balanced macronutrients and micronutrients",
      icon: "BarChart3",
      duration: 2000
    },
    {
      id: 6,
      title: "Finalizing Recommendations",
      description: "Adding cooking instructions and lifestyle tips",
      icon: "CheckCircle",
      duration: 1500
    }
  ];

  const mockGeneratedPlan = {
    id: "plan_" + Date.now(),
    patientId: patient?.id,
    confidence: 94,
    generatedAt: new Date()?.toISOString(),
    duration: "7 days",
    totalCalories: 1800,
    macros: {
      carbs: 45,
      protein: 25,
      fat: 30
    },
    ayurvedicBalance: {
      vata: 30,
      pitta: 40,
      kapha: 30
    },
    meals: {
      breakfast: [
        {
          id: "bf_1",
          name: "Warm Spiced Oatmeal with Almonds",
          calories: 320,
          prepTime: "15 min",
          servingSize: "1 cup",
          ayurvedicProperties: ["Grounding", "Nourishing"],
          ingredients: ["Rolled oats", "Almond milk", "Cinnamon", "Cardamom", "Almonds", "Honey"]
        },
        {
          id: "bf_2",
          name: "Golden Milk Smoothie",
          calories: 280,
          prepTime: "10 min",
          servingSize: "1 glass",
          ayurvedicProperties: ["Anti-inflammatory", "Digestive"],
          ingredients: ["Coconut milk", "Turmeric", "Ginger", "Banana", "Dates"]
        },
        {
          id: "bf_3",
          name: "Quinoa Porridge with Berries",
          calories: 300,
          prepTime: "20 min",
          servingSize: "1 cup",
          ayurvedicProperties: ["Light", "Energizing"],
          ingredients: ["Quinoa", "Almond milk", "Berries", "Honey", "Nuts"]
        },
        {
          id: "bf_4",
          name: "Steamed Idli with Sambar",
          calories: 250,
          prepTime: "25 min",
          servingSize: "3 pieces",
          ayurvedicProperties: ["Digestive", "Balancing"],
          ingredients: ["Rice", "Urad dal", "Sambar", "Coconut chutney"]
        },
        {
          id: "bf_5",
          name: "Sprouted Moong Salad",
          calories: 220,
          prepTime: "15 min",
          servingSize: "1 cup",
          ayurvedicProperties: ["Cleansing", "Light"],
          ingredients: ["Sprouted moong", "Cucumber", "Tomato", "Lemon", "Coriander"]
        },
        {
          id: "bf_6",
          name: "Chia Seed Pudding",
          calories: 290,
          prepTime: "5 min (overnight)",
          servingSize: "1 cup",
          ayurvedicProperties: ["Cooling", "Nourishing"],
          ingredients: ["Chia seeds", "Coconut milk", "Dates", "Vanilla", "Berries"]
        },
        {
          id: "bf_7",
          name: "Upma with Vegetables",
          calories: 280,
          prepTime: "20 min",
          servingSize: "1.5 cups",
          ayurvedicProperties: ["Warming", "Satisfying"],
          ingredients: ["Semolina", "Vegetables", "Ghee", "Mustard seeds", "Curry leaves"]
        },
        {
          id: "bf_8",
          name: "Fruit Bowl with Yogurt",
          calories: 240,
          prepTime: "10 min",
          servingSize: "1.5 cups",
          ayurvedicProperties: ["Cooling", "Digestive"],
          ingredients: ["Seasonal fruits", "Yogurt", "Honey", "Nuts", "Seeds"]
        },
        {
          id: "bf_9",
          name: "Poha with Peanuts",
          calories: 260,
          prepTime: "15 min",
          servingSize: "1.5 cups",
          ayurvedicProperties: ["Light", "Energizing"],
          ingredients: ["Flattened rice", "Peanuts", "Onions", "Turmeric", "Coriander"]
        },
        {
          id: "bf_10",
          name: "Dosa with Coconut Chutney",
          calories: 270,
          prepTime: "30 min",
          servingSize: "2 pieces",
          ayurvedicProperties: ["Balancing", "Satisfying"],
          ingredients: ["Rice", "Urad dal", "Coconut", "Chilies", "Ginger"]
        }
      ],
      lunch: [
        {
          id: "ln_1",
          name: "Quinoa Kitchari Bowl",
          calories: 450,
          prepTime: "30 min",
          servingSize: "1.5 cups",
          ayurvedicProperties: ["Balancing", "Cleansing"],
          ingredients: ["Quinoa", "Mung dal", "Vegetables", "Ghee", "Cumin", "Coriander"]
        },
        {
          id: "ln_2",
          name: "Roasted Vegetable Salad",
          calories: 380,
          prepTime: "25 min",
          servingSize: "2 cups",
          ayurvedicProperties: ["Cooling", "Light"],
          ingredients: ["Mixed vegetables", "Olive oil", "Lemon", "Fresh herbs"]
        },
        {
          id: "ln_3",
          name: "Dal with Brown Rice",
          calories: 420,
          prepTime: "35 min",
          servingSize: "1.5 cups",
          ayurvedicProperties: ["Nourishing", "Protein-rich"],
          ingredients: ["Toor dal", "Brown rice", "Ghee", "Spices", "Vegetables"]
        },
        {
          id: "ln_4",
          name: "Vegetable Biryani",
          calories: 480,
          prepTime: "45 min",
          servingSize: "2 cups",
          ayurvedicProperties: ["Warming", "Satisfying"],
          ingredients: ["Basmati rice", "Mixed vegetables", "Spices", "Ghee", "Yogurt"]
        },
        {
          id: "ln_5",
          name: "Lentil Soup with Roti",
          calories: 400,
          prepTime: "30 min",
          servingSize: "1.5 cups + 2 rotis",
          ayurvedicProperties: ["Digestive", "Balancing"],
          ingredients: ["Lentils", "Whole wheat roti", "Ghee", "Spices", "Herbs"]
        },
        {
          id: "ln_6",
          name: "Stir-fried Vegetables with Tofu",
          calories: 360,
          prepTime: "20 min",
          servingSize: "1.5 cups",
          ayurvedicProperties: ["Light", "Protein-rich"],
          ingredients: ["Tofu", "Mixed vegetables", "Sesame oil", "Ginger", "Garlic"]
        },
        {
          id: "ln_7",
          name: "Rajma Curry with Rice",
          calories: 440,
          prepTime: "40 min",
          servingSize: "1.5 cups",
          ayurvedicProperties: ["Nourishing", "Satisfying"],
          ingredients: ["Kidney beans", "Rice", "Onions", "Tomatoes", "Spices"]
        },
        {
          id: "ln_8",
          name: "Vegetable Khichdi",
          calories: 390,
          prepTime: "35 min",
          servingSize: "1.5 cups",
          ayurvedicProperties: ["Digestive", "Cleansing"],
          ingredients: ["Rice", "Moong dal", "Vegetables", "Ghee", "Cumin"]
        },
        {
          id: "ln_9",
          name: "Chana Masala with Roti",
          calories: 410,
          prepTime: "30 min",
          servingSize: "1 cup + 2 rotis",
          ayurvedicProperties: ["Warming", "Protein-rich"],
          ingredients: ["Chickpeas", "Whole wheat roti", "Onions", "Tomatoes", "Spices"]
        },
        {
          id: "ln_10",
          name: "Quinoa Salad Bowl",
          calories: 370,
          prepTime: "25 min",
          servingSize: "2 cups",
          ayurvedicProperties: ["Cooling", "Light"],
          ingredients: ["Quinoa", "Mixed vegetables", "Olive oil", "Lemon", "Herbs"]
        }
      ],
      dinner: [
        {
          id: "dn_1",
          name: "Spiced Lentil Curry",
          calories: 420,
          prepTime: "35 min",
          servingSize: "1 cup",
          ayurvedicProperties: ["Warming", "Protein-rich"],
          ingredients: ["Red lentils", "Tomatoes", "Onions", "Spices", "Coconut milk"]
        },
        {
          id: "dn_2",
          name: "Steamed Vegetables with Tahini",
          calories: 350,
          prepTime: "20 min",
          servingSize: "1.5 cups",
          ayurvedicProperties: ["Light", "Digestive"],
          ingredients: ["Seasonal vegetables", "Tahini", "Lemon", "Herbs"]
        },
        {
          id: "dn_3",
          name: "Moong Dal Khichdi",
          calories: 380,
          prepTime: "30 min",
          servingSize: "1.5 cups",
          ayurvedicProperties: ["Digestive", "Light"],
          ingredients: ["Moong dal", "Rice", "Ghee", "Cumin", "Vegetables"]
        },
        {
          id: "dn_4",
          name: "Vegetable Soup with Bread",
          calories: 320,
          prepTime: "25 min",
          servingSize: "1.5 cups + 1 slice",
          ayurvedicProperties: ["Warming", "Light"],
          ingredients: ["Mixed vegetables", "Herbs", "Whole grain bread", "Olive oil"]
        },
        {
          id: "dn_5",
          name: "Palak Paneer with Roti",
          calories: 400,
          prepTime: "30 min",
          servingSize: "1 cup + 2 rotis",
          ayurvedicProperties: ["Nourishing", "Balancing"],
          ingredients: ["Spinach", "Paneer", "Whole wheat roti", "Spices", "Ghee"]
        },
        {
          id: "dn_6",
          name: "Grilled Vegetables with Quinoa",
          calories: 360,
          prepTime: "30 min",
          servingSize: "1.5 cups",
          ayurvedicProperties: ["Light", "Energizing"],
          ingredients: ["Grilled vegetables", "Quinoa", "Olive oil", "Lemon", "Herbs"]
        },
        {
          id: "dn_7",
          name: "Dal Tadka with Rice",
          calories: 390,
          prepTime: "35 min",
          servingSize: "1.5 cups",
          ayurvedicProperties: ["Digestive", "Nourishing"],
          ingredients: ["Yellow dal", "Rice", "Ghee", "Cumin", "Garlic"]
        },
        {
          id: "dn_8",
          name: "Stuffed Bell Peppers",
          calories: 340,
          prepTime: "40 min",
          servingSize: "2 pieces",
          ayurvedicProperties: ["Cooling", "Light"],
          ingredients: ["Bell peppers", "Quinoa", "Vegetables", "Herbs", "Olive oil"]
        },
        {
          id: "dn_9",
          name: "Vegetable Curry with Roti",
          calories: 370,
          prepTime: "30 min",
          servingSize: "1 cup + 2 rotis",
          ayurvedicProperties: ["Warming", "Balancing"],
          ingredients: ["Mixed vegetables", "Whole wheat roti", "Spices", "Ghee", "Yogurt"]
        },
        {
          id: "dn_10",
          name: "Lentil Soup",
          calories: 330,
          prepTime: "25 min",
          servingSize: "1.5 cups",
          ayurvedicProperties: ["Light", "Digestive"],
          ingredients: ["Red lentils", "Vegetables", "Spices", "Herbs", "Lemon"]
        }
      ]
    },
    recommendations: [
      "Eat your largest meal at midday when digestive fire is strongest",
      "Include warm, cooked foods to support Vata balance",
      "Drink warm water throughout the day",
      "Avoid cold drinks and raw foods in the evening"
    ]
  };

  const startGeneration = async () => {
    setIsGenerating(true);
    setCurrentPhase(0);
    setConfidence(0);

    for (let i = 0; i < generationPhases?.length; i++) {
      setCurrentPhase(i);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, generationPhases[i].duration));
      
      // Update confidence gradually
      const newConfidence = Math.min(95, Math.floor((i + 1) / generationPhases?.length * 100));
      setConfidence(newConfidence);
    }

    // Simulate final processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setGeneratedPlan(mockGeneratedPlan);
    setIsGenerating(false);
    onGenerationComplete(mockGeneratedPlan);
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-organic">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Brain" size={32} color="white" />
        </div>
        <h3 className="font-heading font-semibold text-xl text-text-primary mb-2">
          AI Diet Generation Engine
        </h3>
        <p className="text-text-secondary">
          Powered by ancient Ayurvedic wisdom and modern AI technology
        </p>
      </div>
      {!isGenerating && !generatedPlan && (
        <div className="space-y-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-3">Generation Parameters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Patient:</span>
                <span className="ml-2 font-medium">{patient?.name}</span>
              </div>
              <div>
                <span className="text-text-secondary">Constitution:</span>
                <span className="ml-2 font-medium">{patient?.constitution}</span>
              </div>
              <div>
                <span className="text-text-secondary">Restrictions:</span>
                <span className="ml-2 font-medium">
                  {preferences?.dietaryRestrictions?.length || 0} items
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Allergies:</span>
                <span className="ml-2 font-medium">
                  {preferences?.allergies?.length || 0} items
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="default"
              size="lg"
              onClick={startGeneration}
              iconName="Sparkles"
              className="px-8"
            >
              Generate Personalized Diet Plan
            </Button>
          </div>
        </div>
      )}
      {isGenerating && (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-border"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - confidence / 100)}`}
                  className="text-primary transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{confidence}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="font-medium text-text-primary">AI Processing</span>
            </div>
            <p className="text-sm text-text-secondary">
              Confidence Level: {confidence}%
            </p>
          </div>

          {/* Current Phase */}
          <div className="space-y-4">
            {generationPhases?.map((phase, index) => {
              const isActive = index === currentPhase;
              const isCompleted = index < currentPhase;
              const isUpcoming = index > currentPhase;

              return (
                <div
                  key={phase?.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-smooth ${
                    isActive
                      ? 'bg-primary/10 border border-primary/20'
                      : isCompleted
                        ? 'bg-success/10 border border-success/20' :'bg-muted border border-border'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isCompleted
                        ? 'bg-success text-success-foreground'
                        : 'bg-border text-text-secondary'
                  }`}>
                    {isCompleted ? (
                      <Icon name="Check" size={16} />
                    ) : isActive ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icon name={phase?.icon} size={16} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className={`font-medium ${
                      isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-text-primary'
                    }`}>
                      {phase?.title}
                    </h5>
                    <p className="text-sm text-text-secondary">
                      {phase?.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {generatedPlan && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} color="white" />
            </div>
            <h4 className="font-heading font-semibold text-lg text-text-primary mb-2">
              Diet Plan Generated Successfully!
            </h4>
            <p className="text-text-secondary">
              Your personalized Ayurvedic diet plan is ready for review
            </p>
          </div>

          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-text-primary">Generation Summary</h5>
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={16} className="text-success" />
                <span className="text-success font-medium">{generatedPlan?.confidence}% Confidence</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Duration:</span>
                <span className="ml-2 font-medium">{generatedPlan?.duration}</span>
              </div>
              <div>
                <span className="text-text-secondary">Daily Calories:</span>
                <span className="ml-2 font-medium">{generatedPlan?.totalCalories}</span>
              </div>
              <div>
                <span className="text-text-secondary">Meal Options:</span>
                <span className="ml-2 font-medium">
                  {Object.values(generatedPlan?.meals)?.flat()?.length} recipes
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" iconName="RotateCcw">
              Regenerate
            </Button>
            <Button variant="default" iconName="Eye">
              Review Plan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGenerationEngine;