import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchFilters from './components/SearchFilters';
import QuickFilters from './components/QuickFilters';
import FoodGrid from './components/FoodGrid';
import FoodDetailModal from './components/FoodDetailModal';
import RecentlyViewed from './components/RecentlyViewed';

const FoodExplorer = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({});
  const [quickFilters, setQuickFilters] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFood, setSelectedFood] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Mock food data - Updated with correct images
  const mockFoods = [
    {
      id: 1,
      name: "Basmati Rice",
      scientificName: "Oryza sativa",
      category: "Grains & Cereals",
      origin: "India",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
      description: `Basmati rice is a long-grain aromatic rice variety known for its distinctive fragrance and delicate flavor. Traditionally grown in the foothills of the Himalayas, this premium rice variety has been cultivated for centuries and is prized for its exceptional quality and nutritional benefits.`,
      doshaEffect: "tridoshic",
      doshaDescription: "Basmati rice is considered tridoshic, meaning it balances all three doshas when consumed in moderation.",
      tastes: ["sweet"],
      potency: "cooling",
      bestSeason: "summer",
      availability: "year-round",
      seasonal: false,
      rating: 4.8,
      usageCount: 1250,
      nutrition: {
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
        detailed: {
          fiber: "0.4g",
          iron: "0.2mg",
          magnesium: "12mg",
          phosphorus: "43mg",
          potassium: "35mg",
          zinc: "0.4mg"
        }
      },
      keyBenefits: [
        "Easy to digest",
        "Provides sustained energy",
        "Rich in complex carbohydrates",
        "Low in fat and sodium",
        "Gluten-free grain option"
      ],
      nutritionalBenefits: [
        "Provides essential amino acids for protein synthesis",
        "Contains B-vitamins for energy metabolism",
        "Low glycemic index helps maintain stable blood sugar"
      ],
      dietaryTags: ["vegetarian", "vegan", "gluten-free"],
      ayurvedicUses: [
        "Recommended for convalescence and recovery",
        "Helps build ojas (vital essence)",
        "Suitable for all body types when prepared properly"
      ],
      prabhava: "Promotes mental clarity and sattvic qualities when consumed mindfully",
      preparationMethods: [
        {
          name: "Steamed",
          description: "Traditional method preserving nutrients and aroma"
        },
        {
          name: "Pilaf Style",
          description: "Cooked with ghee and spices for enhanced flavor"
        }
      ],
      servingSuggestions: [
        "Serve with dal and vegetables for complete nutrition",
        "Pair with cooling raita in summer months",
        "Combine with warming spices in winter"
      ],
      storage: "Store in airtight containers in a cool, dry place. Can be stored for up to 2 years.",
      contraindications: [
        "Consume in moderation if you have diabetes",
        "May increase Kapha if eaten in excess"
      ]
    },
    {
      id: 2,
      name: "Turmeric",
      scientificName: "Curcuma longa",
      category: "Spices & Herbs",
      origin: "Southeast Asia",
      image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop",
      description: `Turmeric, known as the 'Golden Spice', is one of the most revered herbs in Ayurveda. This vibrant yellow root has been used for thousands of years for its powerful healing properties and is considered a natural antibiotic and anti-inflammatory agent.`,
      doshaEffect: "kapha-balancing",
      doshaDescription: "Turmeric primarily reduces Kapha and Pitta while being neutral for Vata when used appropriately.",
      tastes: ["bitter", "pungent"],
      potency: "heating",
      bestSeason: "winter",
      availability: "year-round",
      seasonal: false,
      rating: 4.9,
      usageCount: 2100,
      nutrition: {
        calories: 29,
        protein: 0.9,
        carbs: 6.3,
        fat: 0.3,
        detailed: {
          fiber: "2.1g",
          iron: "5.2mg",
          manganese: "0.5mg",
          potassium: "170mg",
          vitamin_c: "0.7mg",
          curcumin: "200mg"
        }
      },
      keyBenefits: [
        "Powerful anti-inflammatory properties",
        "Natural antioxidant",
        "Supports immune system",
        "Aids digestion",
        "Promotes wound healing"
      ],
      nutritionalBenefits: [
        "Curcumin provides potent anti-inflammatory effects",
        "Rich in antioxidants that fight free radicals",
        "Contains essential oils with antimicrobial properties"
      ],
      dietaryTags: ["vegetarian", "vegan", "organic"],
      ayurvedicUses: [
        "Natural antibiotic and antiseptic",
        "Purifies blood and improves complexion",
        "Supports liver function and detoxification",
        "Helps in respiratory conditions"
      ],
      prabhava: "Acts as a yogavahi - enhances the properties of other herbs when combined",
      preparationMethods: [
        {
          name: "Golden Milk",
          description: "Mixed with warm milk and honey for daily consumption"
        },
        {
          name: "Paste",
          description: "Ground fresh for topical applications"
        }
      ],
      servingSuggestions: [
        "Add to curries and dal for flavor and health benefits",
        "Mix with warm milk before bedtime",
        "Use in face masks for glowing skin"
      ],
      storage: "Store whole turmeric in a cool, dry place. Ground turmeric should be kept in airtight containers.",
      contraindications: [
        "Avoid in excess during pregnancy",
        "May interact with blood-thinning medications",
        "Can increase Pitta if used excessively"
      ]
    },
    {
      id: 3,
      name: "Almonds",
      scientificName: "Prunus dulcis",
      category: "Nuts & Seeds",
      origin: "Mediterranean",
      image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=300&fit=crop&crop=center",
      description: `Almonds are nutrient-dense tree nuts that have been cultivated for thousands of years. In Ayurveda, almonds are considered one of the most nourishing foods, particularly beneficial for building ojas (vital essence) and supporting brain function.`,
      doshaEffect: "vata-balancing",
      doshaDescription: "Almonds are excellent for balancing Vata dosha due to their oily, heavy, and nourishing qualities.",
      tastes: ["sweet"],
      potency: "heating",
      bestSeason: "winter",
      availability: "year-round",
      seasonal: false,
      rating: 4.7,
      usageCount: 1800,
      nutrition: {
        calories: 579,
        protein: 21.2,
        carbs: 21.6,
        fat: 49.9,
        detailed: {
          fiber: "12.5g",
          calcium: "269mg",
          iron: "3.7mg",
          magnesium: "270mg",
          phosphorus: "481mg",
          potassium: "733mg",
          vitamin_e: "25.6mg"
        }
      },
      keyBenefits: [
        "Rich in healthy monounsaturated fats",
        "Excellent source of vitamin E",
        "Supports heart health",
        "Enhances brain function",
        "Builds strength and vitality"
      ],
      nutritionalBenefits: [
        "High in protein for muscle building and repair",
        "Contains healthy fats that support hormone production",
        "Rich in antioxidants that protect against oxidative stress"
      ],
      dietaryTags: ["vegetarian", "vegan", "gluten-free", "organic"],
      ayurvedicUses: [
        "Builds ojas and enhances immunity",
        "Nourishes nervous system and brain tissue",
        "Supports reproductive health",
        "Helps in weight gain for underweight individuals"
      ],
      prabhava: "Medhya rasayana - specifically enhances memory and cognitive function",
      preparationMethods: [
        {
          name: "Soaked",
          description: "Soak overnight and peel for better digestibility"
        },
        {
          name: "Almond Milk",
          description: "Blend soaked almonds with water for a nutritious drink"
        }
      ],
      servingSuggestions: [
        "Eat 5-10 soaked almonds daily on empty stomach",
        "Add to smoothies and desserts",
        "Use almond flour in baking"
      ],
      storage: "Store in airtight containers in a cool, dry place. Refrigerate for longer shelf life.",
      contraindications: [
        "May increase Kapha if consumed in excess",
        "Avoid if allergic to tree nuts",
        "Limit intake if you have kidney stones"
      ]
    },
    {
      id: 4,
      name: "Spinach",
      scientificName: "Spinacia oleracea",
      category: "Vegetables",
      origin: "Persia",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
      description: `Spinach is a leafy green vegetable packed with nutrients and considered highly beneficial in Ayurveda. This versatile vegetable is rich in iron, vitamins, and minerals, making it an excellent choice for maintaining overall health and vitality.`,
      doshaEffect: "pitta-balancing",
      doshaDescription: "Spinach has a cooling effect and helps balance Pitta dosha while being neutral for other doshas.",
      tastes: ["sweet", "astringent"],
      potency: "cooling",
      bestSeason: "winter",
      availability: "year-round",
      seasonal: true,
      rating: 4.6,
      usageCount: 1400,
      nutrition: {
        calories: 23,
        protein: 2.9,
        carbs: 3.6,
        fat: 0.4,
        detailed: {
          fiber: "2.2g",
          iron: "2.7mg",
          calcium: "99mg",
          magnesium: "79mg",
          potassium: "558mg",
          vitamin_a: "469mcg",
          vitamin_c: "28mg",
          folate: "194mcg"
        }
      },
      keyBenefits: [
        "Excellent source of iron",
        "Rich in antioxidants",
        "Supports eye health",
        "Boosts immune system",
        "Promotes healthy digestion"
      ],
      nutritionalBenefits: [
        "High in folate essential for cell division and DNA synthesis",
        "Contains lutein and zeaxanthin for eye health",
        "Rich in nitrates that support cardiovascular health"
      ],
      dietaryTags: ["vegetarian", "vegan", "gluten-free", "low-sodium"],
      ayurvedicUses: [
        "Purifies blood and improves complexion",
        "Strengthens nervous system",
        "Supports liver function",
        "Helps in anemia and weakness"
      ],
      prabhava: "Rakta shodhaka - specifically purifies and nourishes blood tissue",
      preparationMethods: [
        {
          name: "Sautéed",
          description: "Lightly cooked with spices to enhance absorption"
        },
        {
          name: "Raw Salad",
          description: "Fresh young leaves in salads for maximum nutrients"
        }
      ],
      servingSuggestions: [
        "Add to dal and curries for extra nutrition",
        "Use in smoothies for a nutrient boost",
        "Prepare as palak paneer or palak dal"
      ],
      storage: "Store fresh spinach in refrigerator for 3-5 days. Wash just before use.",
      contraindications: [
        "May increase Vata if consumed raw in excess",
        "Contains oxalates - limit if prone to kidney stones",
        "Cook well to reduce oxalate content"
      ]
    },
    {
      id: 5,
      name: "Mango",
      scientificName: "Mangifera indica",
      category: "Fruits",
      origin: "South Asia",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop",
      description: `Mango, known as the 'King of Fruits', is beloved not only for its delicious taste but also for its numerous health benefits. In Ayurveda, mango is considered a rasayana (rejuvenative) fruit that nourishes all body tissues and promotes longevity.`,
      doshaEffect: "vata-balancing",
      doshaDescription: "Ripe mangoes balance Vata and Pitta doshas due to their sweet taste and cooling nature.",
      tastes: ["sweet"],
      potency: "cooling",
      bestSeason: "summer",
      availability: "seasonal",
      seasonal: true,
      rating: 4.8,
      usageCount: 2200,
      nutrition: {
        calories: 60,
        protein: 0.8,
        carbs: 15,
        fat: 0.4,
        detailed: {
          fiber: "1.6g",
          vitamin_a: "54mcg",
          vitamin_c: "36.4mg",
          folate: "43mcg",
          potassium: "168mg",
          magnesium: "10mg",
          beta_carotene: "640mcg"
        }
      },
      keyBenefits: [
        "Rich in vitamin C and antioxidants",
        "Supports immune system",
        "Promotes healthy digestion",
        "Nourishes skin and hair",
        "Provides natural energy"
      ],
      nutritionalBenefits: [
        "High in beta-carotene which converts to vitamin A",
        "Contains digestive enzymes that aid in protein digestion",
        "Rich in antioxidants that protect against cellular damage"
      ],
      dietaryTags: ["vegetarian", "vegan", "gluten-free"],
      ayurvedicUses: [
        "Rasayana - promotes longevity and vitality",
        "Nourishes all seven dhatus (body tissues)",
        "Improves complexion and skin health",
        "Supports reproductive health"
      ],
      prabhava: "Ojas vardhaka - specifically increases vital essence and immunity",
      preparationMethods: [
        {
          name: "Fresh",
          description: "Eat ripe mango as is for maximum benefits"
        },
        {
          name: "Smoothie",
          description: "Blend with milk or yogurt for a nourishing drink"
        }
      ],
      servingSuggestions: [
        "Eat as a mid-morning or afternoon snack",
        "Add to fruit salads and desserts",
        "Use in lassi and smoothies"
      ],
      storage: "Store unripe mangoes at room temperature. Refrigerate ripe mangoes for 3-5 days.",
      contraindications: [
        "May increase Kapha if consumed in excess",
        "Diabetics should consume in moderation",
        "Avoid eating with milk if you have weak digestion"
      ]
    },
    {
      id: 6,
      name: "Chickpeas",
      scientificName: "Cicer arietinum",
      category: "Legumes & Pulses",
      origin: "Middle East",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop&crop=center",
      description: `Chickpeas, also known as garbanzo beans, are versatile legumes that have been cultivated for thousands of years. In Ayurveda, chickpeas are valued for their protein content and ability to provide sustained energy while being relatively easy to digest when properly prepared.`,
      doshaEffect: "kapha-balancing",
      doshaDescription: "Chickpeas help balance Kapha dosha due to their light and dry qualities, while being neutral for other doshas.",
      tastes: ["sweet", "astringent"],
      potency: "heating",
      bestSeason: "winter",
      availability: "year-round",
      seasonal: false,
      rating: 4.5,
      usageCount: 1600,
      nutrition: {
        calories: 164,
        protein: 8.9,
        carbs: 27.4,
        fat: 2.6,
        detailed: {
          fiber: "7.6g",
          iron: "2.9mg",
          magnesium: "48mg",
          phosphorus: "168mg",
          potassium: "291mg",
          zinc: "1.5mg",
          folate: "172mcg"
        }
      },
      keyBenefits: [
        "Excellent source of plant protein",
        "High in dietary fiber",
        "Supports heart health",
        "Helps regulate blood sugar",
        "Promotes digestive health"
      ],
      nutritionalBenefits: [
        "Contains all essential amino acids for complete protein",
        "Rich in folate essential for cell division",
        "High fiber content supports gut health and satiety"
      ],
      dietaryTags: ["vegetarian", "vegan", "gluten-free"],
      ayurvedicUses: [
        "Provides strength and stamina",
        "Supports muscle building",
        "Helps in weight management",
        "Nourishes nervous system"
      ],
      prabhava: "Balya - specifically enhances physical strength and endurance",
      preparationMethods: [
        {
          name: "Boiled",
          description: "Soak overnight and boil with digestive spices"
        },
        {
          name: "Roasted",
          description: "Dry roast for a crunchy, nutritious snack"
        }
      ],
      servingSuggestions: [
        "Prepare as chana masala with warming spices",
        "Add to salads and soups",
        "Make hummus for a healthy dip"
      ],
      storage: "Store dried chickpeas in airtight containers for up to 1 year. Cooked chickpeas last 3-4 days refrigerated.",
      contraindications: [
        "May cause gas if not properly soaked and cooked",
        "Can increase Vata if eaten dry without adequate oil",
        "Soak for 8-12 hours before cooking for better digestibility"
      ]
    },
    {
      id: 7,
      name: "Coconut Oil",
      scientificName: "Cocos nucifera",
      category: "Oils & Fats",
      origin: "Tropical regions",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
      description: `Coconut oil is extracted from mature coconuts and is highly revered in Ayurveda for its therapeutic properties. This versatile oil is used both internally and externally and is considered one of the best oils for Pitta constitution due to its cooling nature.`,
      doshaEffect: "pitta-balancing",
      doshaDescription: "Coconut oil is cooling in nature and particularly beneficial for balancing Pitta dosha.",
      tastes: ["sweet"],
      potency: "cooling",
      bestSeason: "summer",
      availability: "year-round",
      seasonal: false,
      rating: 4.7,
      usageCount: 1900,
      nutrition: {
        calories: 862,
        protein: 0,
        carbs: 0,
        fat: 100,
        detailed: {
          saturated_fat: "82.5g",
          monounsaturated_fat: "6.3g",
          polyunsaturated_fat: "1.7g",
          lauric_acid: "47g",
          capric_acid: "6g",
          vitamin_e: "0.1mg"
        }
      },
      keyBenefits: [
        "Contains beneficial medium-chain fatty acids",
        "Natural antimicrobial properties",
        "Supports brain health",
        "Promotes healthy skin and hair",
        "Easy to digest and metabolize"
      ],
      nutritionalBenefits: [
        "Rich in lauric acid which has antimicrobial properties",
        "Medium-chain triglycerides provide quick energy",
        "Contains antioxidants that protect against oxidative stress"
      ],
      dietaryTags: ["vegetarian", "vegan", "organic"],
      ayurvedicUses: [
        "Excellent for oil pulling (gandusha)",
        "Nourishes and strengthens hair",
        "Soothes Pitta-related skin conditions",
        "Supports digestive fire without overheating"
      ],
      prabhava: "Twak prasadana - specifically enhances skin complexion and health",
      preparationMethods: [
        {
          name: "Cold-pressed",
          description: "Unrefined oil retaining maximum nutrients"
        },
        {
          name: "Infused",
          description: "Combined with herbs for enhanced therapeutic properties"
        }
      ],
      servingSuggestions: [
        "Use for cooking at medium temperatures",
        "Add to smoothies for healthy fats",
        "Apply topically for skin and hair care"
      ],
      storage: "Store in a cool, dry place. Solidifies below 76°F but remains usable.",
      contraindications: [
        "May increase Kapha if used excessively",
        "Use in moderation if you have high cholesterol",
        "Choose organic, unrefined varieties for best benefits"
      ]
    },
    {
      id: 8,
      name: "Ginger",
      scientificName: "Zingiber officinale",
      category: "Spices & Herbs",
      origin: "Southeast Asia",
      image: "https://images.unsplash.com/photo-1599639844132-8f85e7eb69ee?w=400&h=300&fit=crop&crop=center",
      description: `Ginger is one of the most important herbs in Ayurveda, known as 'Vishwabhesaj' - the universal medicine. This aromatic rhizome has been used for thousands of years for its digestive, anti-inflammatory, and warming properties.`,
      doshaEffect: "vata-balancing",
      doshaDescription: "Ginger primarily balances Vata and Kapha doshas while potentially increasing Pitta if used excessively.",
      tastes: ["pungent"],
      potency: "heating",
      bestSeason: "winter",
      availability: "year-round",
      seasonal: false,
      rating: 4.9,
      usageCount: 2500,
      nutrition: {
        calories: 80,
        protein: 1.8,
        carbs: 17.8,
        fat: 0.8,
        detailed: {
          fiber: "2g",
          calcium: "16mg",
          iron: "0.6mg",
          magnesium: "43mg",
          phosphorus: "34mg",
          potassium: "415mg",
          vitamin_c: "5mg",
          gingerol: "400mg"
        }
      },
      keyBenefits: [
        "Powerful digestive stimulant",
        "Natural anti-inflammatory",
        "Reduces nausea and motion sickness",
        "Boosts circulation",
        "Supports respiratory health"
      ],
      nutritionalBenefits: [
        "Contains gingerol, a potent bioactive compound",
        "Rich in antioxidants that fight inflammation",
        "Provides essential oils with therapeutic properties"
      ],
      dietaryTags: ["vegetarian", "vegan", "organic"],
      ayurvedicUses: [
        "Deepana - kindles digestive fire",
        "Pachana - aids in digestion of food",
        "Shwasa hara - beneficial for respiratory conditions",
        "Vata anulomana - promotes proper flow of Vata"
      ],
      prabhava: "Agni deepaka - specifically enhances digestive fire without causing acidity",
      preparationMethods: [
        {
          name: "Fresh Tea",
          description: "Boil fresh ginger slices in water for warming tea"
        },
        {
          name: "Dried Powder",
          description: "Ground dried ginger for cooking and medicine"
        }
      ],
      servingSuggestions: [
        "Drink ginger tea before meals to stimulate appetite",
        "Add fresh ginger to curries and stir-fries",
        "Chew small piece after meals for digestion"
      ],
      storage: "Store fresh ginger in refrigerator for 2-3 weeks. Dried ginger powder in airtight containers.",
      contraindications: [
        "Avoid in excess if you have hyperacidity",
        "May increase bleeding risk with blood thinners",
        "Pregnant women should limit intake"
      ]
    },
    // Additional food options
    {
      id: 9,
      name: "Cardamom",
      scientificName: "Elettaria cardamomum",
      category: "Spices & Herbs",
      origin: "India",
      image: "https://images.unsplash.com/photo-1598022286893-e8e0ca8de0e2?w=400&h=300&fit=crop",
      description: "Known as the 'Queen of Spices', cardamom is highly aromatic and prized for its digestive properties.",
      doshaEffect: "tridoshic",
      tastes: ["sweet", "pungent"],
      potency: "cooling",
      bestSeason: "all seasons",
      availability: "year-round",
      seasonal: false,
      rating: 4.8,
      usageCount: 1200,
      nutrition: { calories: 311, protein: 10.8, carbs: 68.5, fat: 6.7 },
      keyBenefits: ["Freshens breath", "Aids digestion", "Anti-inflammatory", "Rich in antioxidants"],
      dietaryTags: ["vegetarian", "vegan", "organic"],
    },
    {
      id: 10,
      name: "Sesame Seeds",
      scientificName: "Sesamum indicum",
      category: "Nuts & Seeds",
      origin: "Africa",
      image: "https://images.unsplash.com/photo-1519590595-2b86b8dd0b4e?w=400&h=300&fit=crop",
      description: "Tiny seeds packed with healthy fats, protein, and minerals, especially calcium.",
      doshaEffect: "vata-balancing",
      tastes: ["sweet"],
      potency: "heating",
      bestSeason: "winter",
      availability: "year-round",
      seasonal: false,
      rating: 4.6,
      usageCount: 800,
      nutrition: { calories: 573, protein: 17.7, carbs: 23.4, fat: 49.7 },
      keyBenefits: ["Rich in calcium", "Healthy fats", "Supports bone health", "Anti-aging properties"],
      dietaryTags: ["vegetarian", "vegan", "gluten-free"],
    },
    {
      id: 11,
      name: "Sweet Potato",
      scientificName: "Ipomoea batatas",
      category: "Root Vegetables",
      origin: "Central America",
      image: "https://images.unsplash.com/photo-1590566390240-65e1a5a0a3d4?w=400&h=300&fit=crop&crop=center",
      description: "Nutritious root vegetable rich in beta-carotene and complex carbohydrates.",
      doshaEffect: "vata-balancing",
      tastes: ["sweet"],
      potency: "heating",
      bestSeason: "fall",
      availability: "year-round",
      seasonal: true,
      rating: 4.7,
      usageCount: 1100,
      nutrition: { calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1 },
      keyBenefits: ["High in beta-carotene", "Good source of fiber", "Supports immune system", "Rich in potassium"],
      dietaryTags: ["vegetarian", "vegan", "gluten-free"],
    },
    {
      id: 12,
      name: "Black Pepper",
      scientificName: "Piper nigrum",
      category: "Spices & Herbs",
      origin: "India",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      description: "The 'King of Spices', black pepper enhances digestion and nutrient absorption.",
      doshaEffect: "vata-kapha-balancing",
      tastes: ["pungent"],
      potency: "heating",
      bestSeason: "winter",
      availability: "year-round",
      seasonal: false,
      rating: 4.8,
      usageCount: 2000,
      nutrition: { calories: 251, protein: 10.4, carbs: 63.9, fat: 3.3 },
      keyBenefits: ["Enhances digestion", "Increases nutrient absorption", "Anti-inflammatory", "Antimicrobial"],
      dietaryTags: ["vegetarian", "vegan", "organic"],
    }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Load favorites and recently viewed from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('ayurdiet-favorites');
    const savedRecentlyViewed = localStorage.getItem('ayurdiet-recently-viewed');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    if (savedRecentlyViewed) {
      setRecentlyViewed(JSON.parse(savedRecentlyViewed));
    }
  }, []);

  // Filter and sort foods
  const filteredAndSortedFoods = useMemo(() => {
    let filtered = [...mockFoods];

    // Apply search filters
    if (searchFilters?.searchTerm) {
      const term = searchFilters?.searchTerm?.toLowerCase();
      filtered = filtered?.filter(food => 
        food?.name?.toLowerCase()?.includes(term) ||
        food?.scientificName?.toLowerCase()?.includes(term) ||
        food?.category?.toLowerCase()?.includes(term) ||
        food?.description?.toLowerCase()?.includes(term)
      );
    }

    if (searchFilters?.category) {
      filtered = filtered?.filter(food => food?.category === searchFilters?.category);
    }

    if (searchFilters?.dosha) {
      filtered = filtered?.filter(food => food?.doshaEffect === searchFilters?.dosha);
    }

    if (searchFilters?.taste) {
      filtered = filtered?.filter(food => food?.tastes?.includes(searchFilters?.taste));
    }

    if (searchFilters?.potency) {
      filtered = filtered?.filter(food => food?.potency === searchFilters?.potency);
    }

    if (searchFilters?.season) {
      filtered = filtered?.filter(food => food?.bestSeason === searchFilters?.season);
    }

    if (searchFilters?.availability) {
      filtered = filtered?.filter(food => food?.availability === searchFilters?.availability);
    }

    // Apply quick filters
    if (quickFilters?.length > 0) {
      filtered = filtered?.filter(food => {
        return quickFilters?.every(filter => {
          if (food?.dietaryTags && food?.dietaryTags?.includes(filter)) return true;
          if (filter === food?.doshaEffect) return true;
          if (food?.tastes && food?.tastes?.includes(filter)) return true;
          if (filter === 'seasonal' && food?.seasonal) return true;
          if (filter === 'local' && food?.availability === 'local') return true;
          return false;
        });
      });
    }

    // Apply dietary restrictions
    if (searchFilters?.dietaryRestrictions && searchFilters?.dietaryRestrictions?.length > 0) {
      filtered = filtered?.filter(food => 
        searchFilters?.dietaryRestrictions?.every(restriction => 
          food?.dietaryTags && food?.dietaryTags?.includes(restriction)
        )
      );
    }

    // Apply nutritional range filters
    if (searchFilters?.nutritionRange) {
      const ranges = searchFilters?.nutritionRange;
      filtered = filtered?.filter(food => {
        const nutrition = food?.nutrition;
        return (nutrition?.calories <= ranges?.calories?.[1] &&
        nutrition?.protein <= ranges?.protein?.[1] &&
        nutrition?.carbs <= ranges?.carbs?.[1] && nutrition?.fat <= ranges?.fat?.[1]);
      });
    }

    // Sort foods
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'rating':
          return b?.rating - a?.rating;
        case 'calories':
          return a?.nutrition?.calories - b?.nutrition?.calories;
        case 'protein':
          return b?.nutrition?.protein - a?.nutrition?.protein;
        case 'popularity':
          return b?.usageCount - a?.usageCount;
        case 'seasonal':
          return b?.seasonal - a?.seasonal;
        default:
          return 0;
      }
    });

    return filtered;
  }, [mockFoods, searchFilters, quickFilters, sortBy]);

  const handleFiltersChange = (filters) => {
    setSearchFilters(filters);
  };

  const handleQuickFiltersChange = (filters) => {
    setQuickFilters(filters);
  };

  const handleClearAllQuickFilters = () => {
    setQuickFilters([]);
  };

  const handleFavorite = (foodId) => {
    const newFavorites = favorites?.includes(foodId)
      ? favorites?.filter(id => id !== foodId)
      : [...favorites, foodId];
    
    setFavorites(newFavorites);
    localStorage.setItem('ayurdiet-favorites', JSON.stringify(newFavorites));
  };

  const handleViewDetails = (food) => {
    setSelectedFood(food);
    setShowDetailModal(true);
    
    // Add to recently viewed
    const newRecentlyViewed = [
      food,
      ...recentlyViewed?.filter(item => item?.id !== food?.id)
    ]?.slice(0, 10);
    
    setRecentlyViewed(newRecentlyViewed);
    localStorage.setItem('ayurdiet-recently-viewed', JSON.stringify(newRecentlyViewed));
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedFood(null);
  };

  const handleClearRecentHistory = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('ayurdiet-recently-viewed');
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Food Explorer - Ayutra | Discover Ayurvedic Foods & Nutrition</title>
        <meta name="description" content="Explore comprehensive database of foods with Ayurvedic properties, nutritional information, and health benefits. Advanced search and filtering capabilities." />
        <meta name="keywords" content="ayurvedic foods, nutrition database, food explorer, dosha foods, ayurvedic nutrition" />
      </Helmet>
      <Header />
      <div className="flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          {/* Page Header */}
          <div className="bg-brand-gradient text-primary-foreground p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-heading font-bold text-3xl mb-2">
                    Food Explorer
                  </h1>
                  <p className="text-primary-foreground/90 text-lg">
                    Discover foods with Ayurvedic wisdom and modern nutrition science
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button
                    variant="secondary"
                    onClick={() => setFiltersCollapsed(!filtersCollapsed)}
                    className="bg-green-600/90 hover:bg-green-700 text-white border-green-500/50 shadow-lg backdrop-blur-sm"
                  >
                    <Icon name="Filter" size={16} />
                    {filtersCollapsed ? 'Show' : 'Hide'} Filters
                  </Button>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {filteredAndSortedFoods?.length}
                    </div>
                    <div className="text-sm text-primary-foreground/80">
                      Foods Available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Viewed */}
          <RecentlyViewed
            recentFoods={recentlyViewed}
            onViewDetails={handleViewDetails}
            onClearHistory={handleClearRecentHistory}
          />

          {/* Quick Filters */}
          <QuickFilters
            activeFilters={quickFilters}
            onFilterChange={handleQuickFiltersChange}
            onClearAll={handleClearAllQuickFilters}
          />

          {/* Main Content */}
          <div className="flex">
            {/* Advanced Filters Sidebar */}
            <SearchFilters
              onFiltersChange={handleFiltersChange}
              isCollapsed={filtersCollapsed}
              onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
            />

            {/* Food Grid */}
            <FoodGrid
              foods={filteredAndSortedFoods}
              loading={loading}
              onFavorite={handleFavorite}
              onViewDetails={handleViewDetails}
              favorites={favorites}
              viewMode={viewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
      </div>
      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedFood}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};

export default FoodExplorer;