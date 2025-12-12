import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useSession } from '../../contexts/AuthContext';
import { patientAPI, dietPlanAPI, complianceAPI } from '../../services/api';
import { Checkbox } from '../../components/ui/Checkbox';
import MealAyurvedicProperties from './components/MealAyurvedicProperties';

const DietPlanViewer = () => {
  const navigate = useNavigate();
  const { data } = useSession();
  const userRole = data?.user?.role;
  const isPractitioner = userRole === 'Practitioner' || userRole === 'Admin';
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDosha, setFilterDosha] = useState('all');
  const [showNutritionInfo, setShowNutritionInfo] = useState(null); // Format: {patientId, day}

  // Mock data for patients with their meal plans
  const mockPatients = [
    {
      id: 'patient_1',
      name: 'John Doe',
      email: 'john@example.com',
      constitution: 'Vata',
      dietPlan: {
        id: 'plan_001',
        name: 'Vata Balancing Diet',
        duration: '4 weeks',
        startDate: '2024-12-01',
        meals: {
          monday: {
            breakfast: { 
              id: 'bf_1', 
              name: 'Warm Quinoa Porridge with Almonds', 
              calories: 320, 
              prepTime: '15 min', 
              servingSize: '1 cup',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: false, astringent: false },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'Nourishes all tissues, promotes strength and vitality'
              }
            },
            lunch: { 
              id: 'ln_1', 
              name: 'Quinoa Kitchari Bowl', 
              calories: 450, 
              prepTime: '30 min', 
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Easily digestible, detoxifying, supports all doshas'
              }
            },
            dinner: { 
              id: 'dn_1', 
              name: 'Spiced Lentil Curry', 
              calories: 420, 
              prepTime: '35 min', 
              servingSize: '1 cup',
              ayurvedicProperties: {
                rasa: { sweet: false, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Balancing' },
                prabhava: 'Strengthens digestion, provides protein and fiber'
              }
            }
          },
          tuesday: {
            breakfast: { 
              id: 'bf_2', 
              name: 'Golden Milk Smoothie', 
              calories: 280, 
              prepTime: '10 min', 
              servingSize: '1 glass',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: true, bitter: false, astringent: false },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: true, light: false, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: true, gross: false, subtle: true, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'Anti-inflammatory, supports immunity and joint health'
              }
            },
            lunch: { 
              id: 'ln_2', 
              name: 'Roasted Vegetable Salad', 
              calories: 380, 
              prepTime: '25 min', 
              servingSize: '2 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: true, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: true, hot: false, cold: false, smooth: false, rough: true, dense: false, liquid: false, soft: false, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Neutral', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Provides fiber, vitamins, and supports digestion'
              }
            },
            dinner: { 
              id: 'dn_2', 
              name: 'Steamed Vegetables with Tahini', 
              calories: 350, 
              prepTime: '20 min', 
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: true, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: false, liquid: false, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Neutral' },
                prabhava: 'Nourishing, easy to digest, supports tissue health'
              }
            }
          },
          wednesday: {
            breakfast: { 
              id: 'bf_3', 
              name: 'Quinoa Porridge with Berries', 
              calories: 300, 
              prepTime: '20 min', 
              servingSize: '1 cup',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: false, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Neutral' },
                prabhava: 'Nourishing, provides antioxidants and fiber'
              }
            },
            lunch: { 
              id: 'ln_3', 
              name: 'Dal with Brown Rice', 
              calories: 420, 
              prepTime: '35 min', 
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: false, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Complete protein, supports all doshas, easily digestible'
              }
            },
            dinner: { 
              id: 'dn_3', 
              name: 'Moong Dal Khichdi', 
              calories: 380, 
              prepTime: '30 min', 
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Detoxifying, tridoshic, ideal for convalescence'
              }
            }
          },
          thursday: {
            breakfast: { 
              id: 'bf_4', 
              name: 'Steamed Idli with Sambar', 
              calories: 250, 
              prepTime: '25 min', 
              servingSize: '3 pieces',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: true, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Balancing' },
                prabhava: 'Fermented food supports gut health and digestion'
              }
            },
            lunch: { 
              id: 'ln_4', 
              name: 'Vegetable Biryani', 
              calories: 480, 
              prepTime: '45 min', 
              servingSize: '2 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: false },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: true, light: false, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: true, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'Aromatic spices enhance digestion and flavor'
              }
            },
            dinner: { 
              id: 'dn_4', 
              name: 'Vegetable Soup with Bread', 
              calories: 320, 
              prepTime: '25 min', 
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: false, bitter: true, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: true, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Neutral' },
                prabhava: 'Light and nourishing, supports hydration'
              }
            }
          },
          friday: {
            breakfast: { 
              id: 'bf_5', 
              name: 'Sprouted Moong Salad', 
              calories: 220, 
              prepTime: '15 min', 
              servingSize: '1 cup',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: true, astringent: true },
                virya: 'cooling',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: true, hot: false, cold: true, smooth: false, rough: true, dense: false, liquid: false, soft: false, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Neutral', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Sprouted grains enhance bioavailability and digestion'
              }
            },
            lunch: { 
              id: 'ln_5', 
              name: 'Lentil Soup with Roti', 
              calories: 400, 
              prepTime: '30 min', 
              servingSize: '1.5 cups + 2 rotis',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: true, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Complete meal, provides protein and carbohydrates'
              }
            },
            dinner: { 
              id: 'dn_5', 
              name: 'Palak Paneer with Roti', 
              calories: 400, 
              prepTime: '30 min', 
              servingSize: '1 cup + 2 rotis',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: true, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: true, light: false, oily: true, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: true, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'Iron-rich, supports blood health and strength'
              }
            }
          },
          saturday: {
            breakfast: { 
              id: 'bf_6', 
              name: 'Chia Seed Pudding', 
              calories: 290, 
              prepTime: '5 min', 
              servingSize: '1 cup',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: false, astringent: false },
                virya: 'cooling',
                vipaka: 'sweet',
                guna: { heavy: true, light: false, oily: true, dry: false, hot: false, cold: true, smooth: true, rough: false, dense: false, liquid: false, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: false, sticky: true },
                doshaEffect: { vata: 'Neutral', pitta: 'Balancing', kapha: 'Neutral' },
                prabhava: 'Omega-3 rich, supports brain and heart health'
              }
            },
            lunch: { 
              id: 'ln_6', 
              name: 'Stir-fried Vegetables with Tofu', 
              calories: 360, 
              prepTime: '20 min', 
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: true, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: false, liquid: false, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Plant-based protein, supports muscle health'
              }
            },
            dinner: { 
              id: 'dn_6', 
              name: 'Grilled Vegetables with Quinoa', 
              calories: 360, 
              prepTime: '30 min', 
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: true, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: true, hot: false, cold: false, smooth: false, rough: true, dense: false, liquid: false, soft: false, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Neutral', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Light meal, supports evening digestion'
              }
            }
          },
          sunday: {
            breakfast: { 
              id: 'bf_7', 
              name: 'Upma with Vegetables', 
              calories: 280, 
              prepTime: '20 min', 
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: false },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Balancing' },
                prabhava: 'Warming breakfast, stimulates morning digestion'
              }
            },
            lunch: { 
              id: 'ln_7', 
              name: 'Rajma Curry with Rice', 
              calories: 440, 
              prepTime: '40 min', 
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: true, light: false, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: true, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'High protein, supports muscle and tissue health'
              }
            },
            dinner: { 
              id: 'dn_7', 
              name: 'Dal Tadka with Rice', 
              calories: 390, 
              prepTime: '35 min', 
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Balancing' },
                prabhava: 'Tempered spices enhance flavor and digestion'
              }
            }
          }
        }
      }
    },
    {
      id: 'patient_2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      constitution: 'Pitta',
      dietPlan: {
        id: 'plan_002',
        name: 'Pitta Balancing Diet',
        duration: '4 weeks',
        startDate: '2024-12-01',
        meals: {
          monday: {
            breakfast: { 
              id: 'bf_8', 
              name: 'Fruit Bowl with Yogurt', 
              calories: 240, 
              prepTime: '10 min',
              servingSize: '1 bowl',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: true, salty: false, pungent: false, bitter: false, astringent: false },
                virya: 'cooling',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: true, smooth: true, rough: false, dense: false, liquid: false, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Neutral', pitta: 'Balancing', kapha: 'Neutral' },
                prabhava: 'Cooling, supports digestion, provides probiotics'
              }
            },
            lunch: { 
              id: 'ln_8', 
              name: 'Vegetable Khichdi', 
              calories: 390, 
              prepTime: '35 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Tridoshic, easily digestible, ideal for all constitutions'
              }
            },
            dinner: { 
              id: 'dn_8', 
              name: 'Stuffed Bell Peppers', 
              calories: 340, 
              prepTime: '40 min',
              servingSize: '2 pieces',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: false, bitter: false, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: false, liquid: false, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Neutral' },
                prabhava: 'Light evening meal, supports Pitta balance'
              }
            }
          },
          tuesday: {
            breakfast: { 
              id: 'bf_9', 
              name: 'Poha with Peanuts', 
              calories: 260, 
              prepTime: '15 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: false },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Balancing' },
                prabhava: 'Warming breakfast, stimulates morning digestion'
              }
            },
            lunch: { 
              id: 'ln_9', 
              name: 'Chana Masala with Roti', 
              calories: 410, 
              prepTime: '30 min',
              servingSize: '1 cup + 2 rotis',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: true, light: false, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: true, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'High protein, supports muscle and tissue health'
              }
            },
            dinner: { 
              id: 'dn_9', 
              name: 'Vegetable Curry with Roti', 
              calories: 370, 
              prepTime: '30 min',
              servingSize: '1 cup + 2 rotis',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: true, astringent: false },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Balancing' },
                prabhava: 'Spiced vegetables enhance digestion and flavor'
              }
            }
          },
          wednesday: {
            breakfast: { 
              id: 'bf_10', 
              name: 'Dosa with Coconut Chutney', 
              calories: 270, 
              prepTime: '30 min',
              servingSize: '2 dosas',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: true, salty: true, pungent: true, bitter: false, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'Fermented, supports gut health and digestion'
              }
            },
            lunch: { 
              id: 'ln_10', 
              name: 'Quinoa Salad Bowl', 
              calories: 370, 
              prepTime: '25 min',
              servingSize: '2 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: true, astringent: true },
                virya: 'cooling',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: true, hot: false, cold: true, smooth: false, rough: true, dense: false, liquid: false, soft: false, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Neutral', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Cooling, supports Pitta balance, provides fiber'
              }
            },
            dinner: { 
              id: 'dn_10', 
              name: 'Lentil Soup', 
              calories: 330, 
              prepTime: '25 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: true, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Light evening meal, easily digestible'
              }
            }
          },
          thursday: {
            breakfast: { 
              id: 'bf_1', 
              name: 'Warm Quinoa Porridge with Almonds', 
              calories: 320, 
              prepTime: '15 min',
              servingSize: '1 cup',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: false, astringent: false },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'Nourishes all tissues, promotes strength and vitality'
              }
            },
            lunch: { 
              id: 'ln_1', 
              name: 'Quinoa Kitchari Bowl', 
              calories: 450, 
              prepTime: '30 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Easily digestible, detoxifying, supports all doshas'
              }
            },
            dinner: { 
              id: 'dn_1', 
              name: 'Spiced Lentil Curry', 
              calories: 420, 
              prepTime: '35 min',
              servingSize: '1 cup',
              ayurvedicProperties: {
                rasa: { sweet: false, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Balancing' },
                prabhava: 'Strengthens digestion, provides protein and fiber'
              }
            }
          },
          friday: {
            breakfast: { 
              id: 'bf_2', 
              name: 'Golden Milk Smoothie', 
              calories: 280, 
              prepTime: '10 min',
              servingSize: '1 glass',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: true, bitter: false, astringent: false },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: true, light: false, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: true, gross: false, subtle: true, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'Anti-inflammatory, supports immunity and joint health'
              }
            },
            lunch: { 
              id: 'ln_2', 
              name: 'Roasted Vegetable Salad', 
              calories: 380, 
              prepTime: '25 min',
              servingSize: '2 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: true, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: true, hot: false, cold: false, smooth: false, rough: true, dense: false, liquid: false, soft: false, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Neutral', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Provides fiber, vitamins, and supports digestion'
              }
            },
            dinner: { 
              id: 'dn_2', 
              name: 'Steamed Vegetables with Tahini', 
              calories: 350, 
              prepTime: '20 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: true, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: false, liquid: false, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Neutral' },
                prabhava: 'Nourishing, easy to digest, supports tissue health'
              }
            }
          },
          saturday: {
            breakfast: { 
              id: 'bf_3', 
              name: 'Quinoa Porridge with Berries', 
              calories: 300, 
              prepTime: '20 min',
              servingSize: '1 cup',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: false, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Neutral' },
                prabhava: 'Nourishing, provides antioxidants and fiber'
              }
            },
            lunch: { 
              id: 'ln_3', 
              name: 'Dal with Brown Rice', 
              calories: 420, 
              prepTime: '35 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: false, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Complete protein, supports all doshas, easily digestible'
              }
            },
            dinner: { 
              id: 'dn_3', 
              name: 'Moong Dal Khichdi', 
              calories: 380, 
              prepTime: '30 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Detoxifying, tridoshic, ideal for convalescence'
              }
            }
          },
          sunday: {
            breakfast: { 
              id: 'bf_4', 
              name: 'Steamed Idli with Sambar', 
              calories: 250, 
              prepTime: '25 min',
              servingSize: '3 pieces',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: true, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Balancing' },
                prabhava: 'Fermented food supports gut health and digestion'
              }
            },
            lunch: { 
              id: 'ln_4', 
              name: 'Vegetable Biryani', 
              calories: 480, 
              prepTime: '45 min',
              servingSize: '2 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: false },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: true, light: false, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: true, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'Aromatic spices enhance digestion and flavor'
              }
            },
            dinner: { 
              id: 'dn_4', 
              name: 'Vegetable Soup with Bread', 
              calories: 320, 
              prepTime: '25 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: false, bitter: true, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: true, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Neutral' },
                prabhava: 'Light and nourishing, supports hydration'
              }
            }
          }
        }
      }
    },
    {
      id: 'patient_3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      constitution: 'Kapha',
      dietPlan: {
        id: 'plan_003',
        name: 'Kapha Balancing Diet',
        duration: '4 weeks',
        startDate: '2024-12-01',
        meals: {
    monday: {
            breakfast: { 
              id: 'bf_5', 
              name: 'Sprouted Moong Salad', 
              calories: 220, 
              prepTime: '15 min',
              servingSize: '1 cup',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: true, astringent: true },
                virya: 'cooling',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: true, hot: false, cold: true, smooth: false, rough: true, dense: false, liquid: false, soft: false, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Neutral', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Sprouted grains enhance bioavailability and digestion'
              }
            },
            lunch: { 
              id: 'ln_5', 
              name: 'Lentil Soup with Roti', 
              calories: 400, 
              prepTime: '30 min',
              servingSize: '1.5 cups + 2 rotis',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: true, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Complete meal, provides protein and carbohydrates'
              }
            },
            dinner: { 
              id: 'dn_5', 
              name: 'Palak Paneer with Roti', 
              calories: 400, 
              prepTime: '30 min',
              servingSize: '1 cup + 2 rotis',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: true, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: true, light: false, oily: true, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: true, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'Iron-rich, supports blood health and strength'
              }
            }
    },
    tuesday: {
            breakfast: { 
              id: 'bf_6', 
              name: 'Chia Seed Pudding', 
              calories: 290, 
              prepTime: '5 min',
              servingSize: '1 cup',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: false, astringent: false },
                virya: 'cooling',
                vipaka: 'sweet',
                guna: { heavy: true, light: false, oily: true, dry: false, hot: false, cold: true, smooth: true, rough: false, dense: false, liquid: false, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: false, sticky: true },
                doshaEffect: { vata: 'Neutral', pitta: 'Balancing', kapha: 'Neutral' },
                prabhava: 'Omega-3 rich, supports brain and heart health'
              }
            },
            lunch: { 
              id: 'ln_6', 
              name: 'Stir-fried Vegetables with Tofu', 
              calories: 360, 
              prepTime: '20 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: true, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: false, liquid: false, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Plant-based protein, supports muscle health'
              }
            },
            dinner: { 
              id: 'dn_6', 
              name: 'Grilled Vegetables with Quinoa', 
              calories: 360, 
              prepTime: '30 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: true, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: true, hot: false, cold: false, smooth: false, rough: true, dense: false, liquid: false, soft: false, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Neutral', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Light meal, supports evening digestion'
              }
            }
    },
    wednesday: {
            breakfast: { 
              id: 'bf_7', 
              name: 'Upma with Vegetables', 
              calories: 280, 
              prepTime: '20 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: false },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Balancing' },
                prabhava: 'Warming breakfast, stimulates morning digestion'
              }
            },
            lunch: { 
              id: 'ln_7', 
              name: 'Rajma Curry with Rice', 
              calories: 440, 
              prepTime: '40 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: true, light: false, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: true, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'High protein, supports muscle and tissue health'
              }
            },
            dinner: { 
              id: 'dn_7', 
              name: 'Dal Tadka with Rice', 
              calories: 390, 
              prepTime: '35 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Balancing' },
                prabhava: 'Tempered spices enhance flavor and digestion'
              }
            }
    },
    thursday: {
            breakfast: { 
              id: 'bf_8', 
              name: 'Fruit Bowl with Yogurt', 
              calories: 240, 
              prepTime: '10 min',
              servingSize: '1 bowl',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: true, salty: false, pungent: false, bitter: false, astringent: false },
                virya: 'cooling',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: true, smooth: true, rough: false, dense: false, liquid: false, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Neutral', pitta: 'Balancing', kapha: 'Neutral' },
                prabhava: 'Cooling, supports digestion, provides probiotics'
              }
            },
            lunch: { 
              id: 'ln_8', 
              name: 'Vegetable Khichdi', 
              calories: 390, 
              prepTime: '35 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Tridoshic, easily digestible, ideal for all constitutions'
              }
            },
            dinner: { 
              id: 'dn_8', 
              name: 'Stuffed Bell Peppers', 
              calories: 340, 
              prepTime: '40 min',
              servingSize: '2 pieces',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: false, bitter: false, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: false, liquid: false, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Neutral' },
                prabhava: 'Light evening meal, supports Pitta balance'
              }
            }
    },
    friday: {
            breakfast: { 
              id: 'bf_9', 
              name: 'Poha with Peanuts', 
              calories: 260, 
              prepTime: '15 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: false },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Balancing' },
                prabhava: 'Warming breakfast, stimulates morning digestion'
              }
            },
            lunch: { 
              id: 'ln_9', 
              name: 'Chana Masala with Roti', 
              calories: 410, 
              prepTime: '30 min',
              servingSize: '1 cup + 2 rotis',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: true, light: false, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: true, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'High protein, supports muscle and tissue health'
              }
            },
            dinner: { 
              id: 'dn_9', 
              name: 'Vegetable Curry with Roti', 
              calories: 370, 
              prepTime: '30 min',
              servingSize: '1 cup + 2 rotis',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: true, astringent: false },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Balancing' },
                prabhava: 'Spiced vegetables enhance digestion and flavor'
              }
            }
    },
    saturday: {
            breakfast: { 
              id: 'bf_10', 
              name: 'Dosa with Coconut Chutney', 
              calories: 270, 
              prepTime: '30 min',
              servingSize: '2 dosas',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: true, salty: true, pungent: true, bitter: false, astringent: false },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'Fermented, supports gut health and digestion'
              }
            },
            lunch: { 
              id: 'ln_10', 
              name: 'Quinoa Salad Bowl', 
              calories: 370, 
              prepTime: '25 min',
              servingSize: '2 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: true, astringent: true },
                virya: 'cooling',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: true, hot: false, cold: true, smooth: false, rough: true, dense: false, liquid: false, soft: false, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Neutral', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Cooling, supports Pitta balance, provides fiber'
              }
            },
            dinner: { 
              id: 'dn_10', 
              name: 'Lentil Soup', 
              calories: 330, 
              prepTime: '25 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: true, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Light evening meal, easily digestible'
              }
            }
    },
    sunday: {
            breakfast: { 
              id: 'bf_1', 
              name: 'Warm Quinoa Porridge with Almonds', 
              calories: 320, 
              prepTime: '15 min',
              servingSize: '1 cup',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: false, pungent: false, bitter: false, astringent: false },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Neutral' },
                prabhava: 'Nourishes all tissues, promotes strength and vitality'
              }
            },
            lunch: { 
              id: 'ln_1', 
              name: 'Quinoa Kitchari Bowl', 
              calories: 450, 
              prepTime: '30 min',
              servingSize: '1.5 cups',
              ayurvedicProperties: {
                rasa: { sweet: true, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'neutral',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: false, dry: false, hot: false, cold: false, smooth: true, rough: false, dense: true, liquid: false, soft: true, hard: false, stable: true, mobile: false, gross: false, subtle: false, clear: true, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Balancing', kapha: 'Balancing' },
                prabhava: 'Easily digestible, detoxifying, supports all doshas'
              }
            },
            dinner: { 
              id: 'dn_1', 
              name: 'Spiced Lentil Curry', 
              calories: 420, 
              prepTime: '35 min',
              servingSize: '1 cup',
              ayurvedicProperties: {
                rasa: { sweet: false, sour: false, salty: true, pungent: true, bitter: false, astringent: true },
                virya: 'heating',
                vipaka: 'sweet',
                guna: { heavy: false, light: true, oily: true, dry: false, hot: true, cold: false, smooth: true, rough: false, dense: false, liquid: true, soft: true, hard: false, stable: false, mobile: false, gross: false, subtle: true, clear: false, sticky: false },
                doshaEffect: { vata: 'Balancing', pitta: 'Neutral', kapha: 'Balancing' },
                prabhava: 'Strengthens digestion, provides protein and fiber'
              }
            }
          }
        }
      }
    }
  ];

  useEffect(() => {
    // Fetch patients - in real app, use patientAPI.getAll()
    // For now, using mock data
    const fetchPatients = async () => {
      setLoading(true);
      try {
        // const response = await patientAPI.getAll({ role: 'Patient' });
        // setPatients(response.data);
        setPatients(mockPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setPatients(mockPatients); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    if (isPractitioner) {
      fetchPatients();
    }
  }, [isPractitioner]);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDosha = filterDosha === 'all' || 
                        patient.constitution?.toLowerCase() === filterDosha.toLowerCase();
    return matchesSearch && matchesDosha;
  });

  const handleEditMeal = (patientId, day, mealType, meal) => {
    setEditingMeal({ patientId, day, mealType, meal });
  };

  const handleSaveMeal = async (updatedMeal) => {
    try {
      // In real app: await dietPlanAPI.update(editingMeal.patientId, { meals: { ... } });
      setPatients(prev => prev.map(patient => {
        if (patient.id === editingMeal.patientId) {
          const updatedMeals = { ...patient.dietPlan.meals };
          updatedMeals[editingMeal.day][editingMeal.mealType] = updatedMeal;
          return {
            ...patient,
            dietPlan: {
              ...patient.dietPlan,
              meals: updatedMeals
            }
          };
        }
        return patient;
      }));
      setEditingMeal(null);
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingMeal(null);
  };

  // Calculate nutritional totals for a day
  const calculateDayNutrition = (dayMeals) => {
    if (!dayMeals) return null;
    
    const meals = [dayMeals.breakfast, dayMeals.lunch, dayMeals.dinner].filter(Boolean);
    
    // Helper function to estimate nutrition from calories (if not provided)
    const estimateNutrition = (meal) => {
      if (meal.protein && meal.carbs && meal.fats) {
        return {
          calories: meal.calories || 0,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats,
          fiber: meal.fiber || 0
        };
      }
      
      // Estimate based on typical meal composition
      const calories = meal.calories || 0;
      // Typical distribution: 20% protein, 50% carbs, 30% fats
      return {
        calories,
        protein: Math.round(calories * 0.20 / 4), // 4 cal per gram
        carbs: Math.round(calories * 0.50 / 4), // 4 cal per gram
        fats: Math.round(calories * 0.30 / 9), // 9 cal per gram
        fiber: Math.round(calories * 0.02) // Rough estimate
      };
    };
    
    const totals = meals.reduce((acc, meal) => {
      const nutrition = estimateNutrition(meal);
      return {
        calories: acc.calories + nutrition.calories,
        protein: acc.protein + nutrition.protein,
        carbs: acc.carbs + nutrition.carbs,
        fats: acc.fats + nutrition.fats,
        fiber: acc.fiber + nutrition.fiber
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
    
    return totals;
  };

  const toggleNutritionInfo = (patientId, day) => {
    const key = `${patientId}-${day}`;
    if (showNutritionInfo === key) {
      setShowNutritionInfo(null);
    } else {
      setShowNutritionInfo(key);
    }
  };

  // Meal database - comprehensive list of meals with serving sizes
  const mealDatabase = [
    // Corn-based meals
    { name: "Corn and Vegetable Stir Fry", calories: 280, prepTime: "20 min", servingSize: "1.5 cups", category: "Vegetable" },
    { name: "Corn Soup with Herbs", calories: 220, prepTime: "25 min", servingSize: "1.5 cups", category: "Soup" },
    { name: "Corn Chaat with Spices", calories: 180, prepTime: "15 min", servingSize: "1 cup", category: "Snack" },
    { name: "Corn and Quinoa Salad", calories: 320, prepTime: "15 min", servingSize: "2 cups", category: "Salad" },
    { name: "Corn Roti with Dal", calories: 350, prepTime: "30 min", servingSize: "2 rotis + 1 cup dal", category: "Main" },
    { name: "Corn Upma", calories: 290, prepTime: "20 min", servingSize: "1.5 cups", category: "Breakfast" },
    { name: "Corn Pulao", calories: 380, prepTime: "35 min", servingSize: "1.5 cups", category: "Main" },
    { name: "Corn and Paneer Curry", calories: 420, prepTime: "30 min", servingSize: "1 cup", category: "Curry" },
    { name: "Corn Fritters", calories: 250, prepTime: "25 min", servingSize: "4 pieces", category: "Snack" },
    { name: "Corn and Spinach Sabzi", calories: 240, prepTime: "20 min", servingSize: "1 cup", category: "Vegetable" },
    
    // Quinoa meals
    { name: "Quinoa Porridge with Berries", calories: 300, prepTime: "20 min", servingSize: "1 cup", category: "Breakfast" },
    { name: "Quinoa Kitchari Bowl", calories: 450, prepTime: "30 min", servingSize: "1.5 cups", category: "Main" },
    { name: "Quinoa Salad Bowl", calories: 370, prepTime: "25 min", servingSize: "2 cups", category: "Salad" },
    { name: "Quinoa Pilaf", calories: 380, prepTime: "30 min", servingSize: "1.5 cups", category: "Main" },
    { name: "Quinoa and Vegetable Stir Fry", calories: 340, prepTime: "25 min", servingSize: "1.5 cups", category: "Main" },
    
    // Lentil meals
    { name: "Spiced Lentil Curry", calories: 420, prepTime: "35 min", servingSize: "1 cup", category: "Curry" },
    { name: "Lentil Soup", calories: 330, prepTime: "25 min", servingSize: "1.5 cups", category: "Soup" },
    { name: "Lentil Soup with Roti", calories: 400, prepTime: "30 min", servingSize: "1.5 cups + 2 rotis", category: "Main" },
    { name: "Red Lentil Dal", calories: 350, prepTime: "30 min", servingSize: "1 cup", category: "Dal" },
    { name: "Lentil and Vegetable Stew", calories: 380, prepTime: "40 min", servingSize: "1.5 cups", category: "Stew" },
    
    // Dal meals
    { name: "Dal with Brown Rice", calories: 420, prepTime: "35 min", servingSize: "1.5 cups", category: "Main" },
    { name: "Dal Tadka with Rice", calories: 390, prepTime: "35 min", servingSize: "1.5 cups", category: "Main" },
    { name: "Moong Dal Khichdi", calories: 380, prepTime: "30 min", servingSize: "1.5 cups", category: "Main" },
    { name: "Toor Dal Curry", calories: 360, prepTime: "30 min", servingSize: "1 cup", category: "Dal" },
    { name: "Chana Dal with Vegetables", calories: 400, prepTime: "35 min", servingSize: "1.5 cups", category: "Dal" },
    
    // Vegetable meals
    { name: "Roasted Vegetable Salad", calories: 380, prepTime: "25 min", servingSize: "2 cups", category: "Salad" },
    { name: "Steamed Vegetables with Tahini", calories: 350, prepTime: "20 min", servingSize: "1.5 cups", category: "Vegetable" },
    { name: "Vegetable Biryani", calories: 480, prepTime: "45 min", servingSize: "2 cups", category: "Main" },
    { name: "Vegetable Soup with Bread", calories: 320, prepTime: "25 min", servingSize: "1.5 cups + 1 slice", category: "Soup" },
    { name: "Vegetable Khichdi", calories: 390, prepTime: "35 min", servingSize: "1.5 cups", category: "Main" },
    { name: "Vegetable Curry with Roti", calories: 370, prepTime: "30 min", servingSize: "1 cup + 2 rotis", category: "Curry" },
    { name: "Stir-fried Vegetables with Tofu", calories: 360, prepTime: "20 min", servingSize: "1.5 cups", category: "Main" },
    { name: "Grilled Vegetables with Quinoa", calories: 360, prepTime: "30 min", servingSize: "1.5 cups", category: "Main" },
    { name: "Stuffed Bell Peppers", calories: 340, prepTime: "40 min", servingSize: "2 pieces", category: "Main" },
    
    // Breakfast meals
    { name: "Warm Quinoa Porridge with Almonds", calories: 320, prepTime: "15 min", servingSize: "1 cup", category: "Breakfast" },
    { name: "Golden Milk Smoothie", calories: 280, prepTime: "10 min", servingSize: "1 glass", category: "Breakfast" },
    { name: "Steamed Idli with Sambar", calories: 250, prepTime: "25 min", servingSize: "3 pieces", category: "Breakfast" },
    { name: "Sprouted Moong Salad", calories: 220, prepTime: "15 min", servingSize: "1 cup", category: "Breakfast" },
    { name: "Chia Seed Pudding", calories: 290, prepTime: "5 min", servingSize: "1 cup", category: "Breakfast" },
    { name: "Upma with Vegetables", calories: 280, prepTime: "20 min", servingSize: "1.5 cups", category: "Breakfast" },
    { name: "Fruit Bowl with Yogurt", calories: 240, prepTime: "10 min", servingSize: "1.5 cups", category: "Breakfast" },
    { name: "Poha with Peanuts", calories: 260, prepTime: "15 min", servingSize: "1.5 cups", category: "Breakfast" },
    { name: "Dosa with Coconut Chutney", calories: 270, prepTime: "30 min", servingSize: "2 pieces", category: "Breakfast" },
    
    // Curry meals
    { name: "Rajma Curry with Rice", calories: 440, prepTime: "40 min", servingSize: "1.5 cups", category: "Curry" },
    { name: "Chana Masala with Roti", calories: 410, prepTime: "30 min", servingSize: "1 cup + 2 rotis", category: "Curry" },
    { name: "Palak Paneer with Roti", calories: 400, prepTime: "30 min", servingSize: "1 cup + 2 rotis", category: "Curry" },
    { name: "Aloo Gobi Curry", calories: 350, prepTime: "30 min", servingSize: "1 cup", category: "Curry" },
    { name: "Baingan Bharta", calories: 320, prepTime: "35 min", servingSize: "1 cup", category: "Curry" },
  ];
    
  const getMealSuggestions = (query) => {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return mealDatabase
      .filter(meal => meal.name.toLowerCase().includes(lowerQuery))
      .slice(0, 10)
      .sort((a, b) => {
        // Prioritize meals that start with the query
        const aStarts = a.name.toLowerCase().startsWith(lowerQuery);
        const bStarts = b.name.toLowerCase().startsWith(lowerQuery);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      });
  };

  const MealEditForm = ({ meal, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: meal?.name || '',
      calories: meal?.calories || '',
      prepTime: meal?.prepTime || '',
      servingSize: meal?.servingSize || ''
    });
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionTimeout, setSuggestionTimeout] = useState(null);

    const handleNameChange = (e) => {
      const value = e.target.value;
      setFormData({ ...formData, name: value });
      
      // Clear previous timeout
      if (suggestionTimeout) {
        clearTimeout(suggestionTimeout);
      }

      // Show suggestions after user stops typing
      if (value.length >= 2) {
        const timeout = setTimeout(() => {
          const mealSuggestions = getMealSuggestions(value);
          setSuggestions(mealSuggestions);
          setShowSuggestions(mealSuggestions.length > 0);
        }, 300);
        setSuggestionTimeout(timeout);
      } else {
        setShowSuggestions(false);
        setSuggestions([]);
      }
    };

    const handleSelectSuggestion = (suggestedMeal) => {
      setFormData({
        name: suggestedMeal.name,
        calories: suggestedMeal.calories,
        prepTime: suggestedMeal.prepTime,
        servingSize: suggestedMeal.servingSize || formData.servingSize || '',
        ayurvedicProperties: suggestedMeal.ayurvedicProperties || meal?.ayurvedicProperties
      });
      setShowSuggestions(false);
      setSuggestions([]);
  };

    useEffect(() => {
      return () => {
        if (suggestionTimeout) {
          clearTimeout(suggestionTimeout);
        }
      };
    }, [suggestionTimeout]);

    return (
      <div className="p-4 bg-muted rounded-lg space-y-3 relative">
        <div className="relative">
          <Input
            label="Meal Name"
            value={formData.name}
            onChange={handleNameChange}
            onFocus={() => {
              if (formData.name.length >= 2) {
                const mealSuggestions = getMealSuggestions(formData.name);
                setSuggestions(mealSuggestions);
                setShowSuggestions(mealSuggestions.length > 0);
              }
            }}
            onBlur={() => {
              // Delay hiding to allow clicking on suggestions
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="Type meal name (e.g., corn, quinoa, lentil)..."
          />
          
          {/* Meal Suggestions Cards */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-organic max-h-96 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-medium text-text-secondary mb-2 px-2">
                  Suggestions ({suggestions.length})
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((suggestedMeal, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestedMeal)}
                      className="p-3 bg-surface hover:bg-primary/5 border border-border rounded-lg cursor-pointer transition-smooth group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h6 className="font-medium text-text-primary group-hover:text-primary transition-colors">
                            {suggestedMeal.name}
                          </h6>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-text-secondary flex-wrap gap-2">
                            <span className="flex items-center space-x-1">
                              <Icon name="Zap" size={12} />
                              <span>{suggestedMeal.calories} cal</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Icon name="Clock" size={12} />
                              <span>{suggestedMeal.prepTime}</span>
                            </span>
                            {suggestedMeal.servingSize && (
                              <span className="flex items-center space-x-1">
                                <Icon name="Ruler" size={12} />
                                <span>{suggestedMeal.servingSize}</span>
                              </span>
                            )}
                            {suggestedMeal.category && (
                              <span className="px-2 py-0.5 bg-muted rounded text-xs">
                                {suggestedMeal.category}
                              </span>
                            )}
                          </div>
                        </div>
                        <Icon name="ChevronRight" size={16} className="text-text-secondary group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            type="number"
            label="Calories"
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
          />
          <Input
            label="Prep Time"
            value={formData.prepTime}
            onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
            placeholder="e.g., 15 min"
          />
          <Input
            label="Serving Size"
            value={formData.servingSize}
            onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
            placeholder="e.g., 1 cup, 200g"
          />
        </div>
        <div className="flex space-x-2">
          <Button size="sm" onClick={() => onSave(formData)}>
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  // For patients, show their own diet plan
  const [patientDietPlan, setPatientDietPlan] = useState(null);
  const [patientLoading, setPatientLoading] = useState(true);
  const [mealCompliance, setMealCompliance] = useState({}); // { "date-day-mealType": true/false }
  const togglingMealsRef = useRef(new Set()); // Track meals being toggled to prevent double-clicks
  const mealComplianceRef = useRef({}); // Ref to track current state for synchronous access

  // Fetch meal compliance data
  const fetchMealCompliance = async (userId, preserveOptimisticUpdates = true) => {
    try {
      // Get current week's compliance
      const response = await complianceAPI.getWeekly();
      if (response.data?.success) {
        const compliance = {};
        // Map compliance data to our state format
        const meals = response.data.data?.meals || [];
        meals.forEach(meal => {
          const dateKey = new Date(meal.date).toISOString().split('T')[0];
          const key = `${dateKey}-${meal.dayOfWeek}-${meal.mealType}`;
          compliance[key] = meal.consumed;
        });
        
        // If preserving optimistic updates, merge with existing state
        if (preserveOptimisticUpdates) {
          setMealCompliance(prev => {
            // Merge: keep optimistic updates that are being toggled, otherwise use fetched data
            const merged = { ...compliance };
            // Keep any keys that are currently being toggled
            togglingMealsRef.current.forEach(key => {
              if (prev[key] !== undefined) {
                merged[key] = prev[key]; // Keep optimistic update
              }
            });
            mealComplianceRef.current = merged;
            return merged;
          });
        } else {
          setMealCompliance(compliance);
          mealComplianceRef.current = compliance; // Update ref
        }
      }
    } catch (error) {
      console.error('Error fetching meal compliance:', error);
    }
  };
  
  // Sync ref with state whenever state changes
  useEffect(() => {
    mealComplianceRef.current = mealCompliance;
  }, [mealCompliance]);

  useEffect(() => {
    // Fetch patient's own diet plan if user is a patient
    if (userRole === 'Patient' && data?.user?.id) {
      const fetchPatientDietPlan = async () => {
        setPatientLoading(true);
        try {
          // TODO: Replace with actual API call to get patient's diet plan
          // const response = await dietPlanAPI.getByPatientId(data.user.id);
          // setPatientDietPlan(response.data);
          
          // For now, use mock data - in production, fetch from API
          // Find a mock patient that matches the current user
          const mockPatient = mockPatients.find(p => p.email === data.user.email) || mockPatients[0];
          if (mockPatient && mockPatient.dietPlan) {
            setPatientDietPlan({
              patient: {
                id: mockPatient.id,
                name: data.user.name || mockPatient.name,
                email: data.user.email || mockPatient.email,
                constitution: mockPatient.constitution
              },
              dietPlan: mockPatient.dietPlan
            });
          }
          
          // Fetch meal compliance
          await fetchMealCompliance(data.user.id);
        } catch (error) {
          console.error('Error fetching patient diet plan:', error);
        } finally {
          setPatientLoading(false);
        }
      };
      fetchPatientDietPlan();
    }
  }, [userRole, data?.user?.id, data?.user?.email]);

  // Handle meal checkbox toggle - memoized to prevent re-renders
  const handleMealToggle = useCallback(async (day, mealType, meal, date) => {
    if (!data?.user?.id || !meal) return;
    
    const dateObj = date || new Date();
    const dateKey = dateObj.toISOString().split('T')[0];
    const key = `${dateKey}-${day}-${mealType}`;
    
    // Prevent double-clicks using ref
    if (togglingMealsRef.current.has(key)) {
      return;
    }
    
    // Add to toggling set
    togglingMealsRef.current.add(key);
    
    // Read current state from ref (synchronous access)
    const currentState = mealComplianceRef.current[key] || false;
    const newState = !currentState;
    
    // Update the state optimistically - this should persist
    setMealCompliance(prev => {
      const updated = { ...prev };
      updated[key] = newState;
      mealComplianceRef.current = updated; // Update ref immediately
      return updated;
    });

    try {
      const response = await complianceAPI.markMeal({
        date: dateKey,
        dayOfWeek: day,
        mealType: mealType,
        mealId: meal.id,
        consumed: newState,
      });
      
      // Only revert if API explicitly returns failure
      // If response is successful or undefined, keep the optimistic update
      if (response?.data?.success === false) {
        console.warn('API returned failure, reverting state for:', key);
        setMealCompliance(prev => {
          const updated = { ...prev };
          updated[key] = currentState; // Revert to original state
          mealComplianceRef.current = updated; // Update ref
          return updated;
        });
      } else {
        // API call succeeded - ensure state is set correctly
        // The optimistic update should already be in place, but confirm it
        setMealCompliance(prev => {
          if (prev[key] !== newState) {
            console.log('Confirming state update for:', key, 'to', newState);
            const updated = { ...prev };
            updated[key] = newState;
            mealComplianceRef.current = updated;
            return updated;
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error updating meal compliance for', key, ':', error);
      // Only revert on actual network/server errors
      // For now, let's keep the optimistic update even on error
      // The user can manually fix it if needed
      // Uncomment below to revert on error:
      /*
      setMealCompliance(prev => {
        const updated = { ...prev };
        updated[key] = currentState; // Revert to original state
        mealComplianceRef.current = updated; // Update ref
        return updated;
      });
      */
    } finally {
      // Remove from toggling set
      togglingMealsRef.current.delete(key);
    }
  }, [data?.user?.id]);

  // Get current date for the day of week (for current week)
  const getDateForDay = (day) => {
    const today = new Date();
    const currentDay = today.getDay();
    // Map: 0=Sunday, 1=Monday, etc.
    const dayMap = { 
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3, 
      thursday: 4, friday: 5, saturday: 6 
    };
    const targetDayIndex = dayMap[day.toLowerCase()];
    
    // Calculate difference
    let diff = targetDayIndex - currentDay;
    // If target day is earlier in the week, go to next week
    if (diff < 0) {
      diff += 7;
    }
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    return targetDate;
  };

  // Patient view - show their own diet plan
  if (userRole === 'Patient') {
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
                  My Diet Plan
                </h1>
                <p className="text-text-secondary">
                  View your personalized Ayurvedic diet plan created by your practitioner
                </p>
              </div>

              {patientLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-4 text-text-secondary">Loading your diet plan...</p>
                </div>
              ) : !patientDietPlan ? (
                <div className="text-center py-12">
                  <Icon name="FileText" size={48} className="text-text-secondary mx-auto mb-4" />
                  <h3 className="font-medium text-text-primary mb-2">No Diet Plan Available</h3>
                  <p className="text-text-secondary mb-4">
                    Your practitioner hasn't created a diet plan for you yet.
                  </p>
                  <p className="text-sm text-text-secondary">
                    Please contact your practitioner to get your personalized diet plan.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Patient Info Card */}
                  <div className="bg-card rounded-lg border border-border shadow-organic p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-brand-gradient rounded-full flex items-center justify-center">
                        <Icon name="User" size={20} color="white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary">{patientDietPlan.patient.name}</h3>
                        <p className="text-sm text-text-secondary">{patientDietPlan.patient.email}</p>
                      </div>
                      {patientDietPlan.patient.constitution && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          patientDietPlan.patient.constitution === 'Vata' ? 'bg-blue-100 text-blue-700' :
                          patientDietPlan.patient.constitution === 'Pitta' ? 'bg-red-100 text-red-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {patientDietPlan.patient.constitution} Constitution
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Diet Plan Details */}
                  {patientDietPlan.dietPlan && (
                    <div className="bg-card rounded-lg border border-border shadow-organic">
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-text-primary mb-1">
                              {patientDietPlan.dietPlan.name}
                            </h4>
                            <p className="text-sm text-text-secondary">
                              Duration: {patientDietPlan.dietPlan.duration} • Started: {new Date(patientDietPlan.dietPlan.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Weekly Meal Plan */}
                      <div className="p-4 space-y-4">
                        {daysOfWeek.map((day) => {
                          const dayMeals = patientDietPlan.dietPlan.meals[day];
                          if (!dayMeals) return null;

                          const nutritionTotals = calculateDayNutrition(dayMeals);
                          const nutritionInfoKey = `${patientDietPlan.patient.id}-${day}`;
                          const isShowingNutrition = showNutritionInfo === nutritionInfoKey;

                          return (
                            <div key={day} className="bg-surface rounded-lg p-4 border border-border">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium text-text-primary flex items-center space-x-2">
                                  <Icon name="Calendar" size={16} />
                                  <span>{dayLabels[day]}</span>
                                </h5>
                                <button
                                  onClick={() => toggleNutritionInfo(patientDietPlan.patient.id, day)}
                                  className="p-1.5 rounded-full hover:bg-muted transition-smooth group"
                                  title="View nutritional information"
                                >
                                  <Icon 
                                    name="Info" 
                                    size={18} 
                                    className={`text-text-secondary group-hover:text-primary transition-colors ${
                                      isShowingNutrition ? 'text-primary' : ''
                                    }`}
                                  />
                                </button>
                              </div>

                              {/* Nutritional Summary Card */}
                              {isShowingNutrition && nutritionTotals && (
                                <div className="mb-4 p-4 bg-card rounded-lg border border-primary/20 shadow-organic">
                                  <div className="flex items-center justify-between mb-3">
                                    <h6 className="font-semibold text-text-primary flex items-center space-x-2">
                                      <Icon name="Activity" size={16} className="text-primary" />
                                      <span>Daily Nutritional Summary</span>
                                    </h6>
                                    <button
                                      onClick={() => setShowNutritionInfo(null)}
                                      className="p-1 rounded-full hover:bg-muted transition-smooth"
                                    >
                                      <Icon name="X" size={14} className="text-text-secondary" />
                                    </button>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className="space-y-1">
                                      <div className="text-xs text-text-secondary">Total Calories</div>
                                      <div className="text-lg font-semibold text-text-primary">
                                        {nutritionTotals.calories}
                                        <span className="text-xs font-normal text-text-secondary ml-1">kcal</span>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-xs text-text-secondary">Protein</div>
                                      <div className="text-lg font-semibold text-primary">
                                        {nutritionTotals.protein}
                                        <span className="text-xs font-normal text-text-secondary ml-1">g</span>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-xs text-text-secondary">Carbohydrates</div>
                                      <div className="text-lg font-semibold text-orange-500">
                                        {nutritionTotals.carbs}
                                        <span className="text-xs font-normal text-text-secondary ml-1">g</span>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-xs text-text-secondary">Fats</div>
                                      <div className="text-lg font-semibold text-yellow-500">
                                        {nutritionTotals.fats}
                                        <span className="text-xs font-normal text-text-secondary ml-1">g</span>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-xs text-text-secondary">Fiber</div>
                                      <div className="text-lg font-semibold text-green-500">
                                        {nutritionTotals.fiber}
                                        <span className="text-xs font-normal text-text-secondary ml-1">g</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['breakfast', 'lunch', 'dinner'].map((mealType) => {
                                  const meal = dayMeals[mealType];
                                  const mealDate = getDateForDay(day);
                                  const dateKey = mealDate.toISOString().split('T')[0];
                                  const complianceKey = `${dateKey}-${day}-${mealType}`;
                                  const isConsumed = mealCompliance[complianceKey] || false;
                                  
                                  return (
                                    <div 
                                      key={mealType}
                                      className={`bg-muted rounded-lg p-3 transition-smooth ${
                                        isConsumed ? 'ring-2 ring-success/50 bg-success/5' : ''
                                      }`}
                                    >
                                      <div className="flex items-start justify-between mb-2">
                                        <label className="text-xs font-medium text-text-secondary capitalize">
                                          {mealType}
                                        </label>
                                        {meal && (
                                          <div className="flex items-center">
                                            <input
                                              key={complianceKey}
                                              type="checkbox"
                                              checked={isConsumed}
                                              onChange={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleMealToggle(day, mealType, meal, mealDate);
                                              }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                              }}
                                              disabled={togglingMealsRef.current.has(complianceKey)}
                                              className={`w-5 h-5 rounded border-2 transition-all cursor-pointer ${
                                                isConsumed 
                                                  ? 'bg-success border-success text-white' 
                                                  : 'border-border hover:border-primary'
                                              } ${togglingMealsRef.current.has(complianceKey) ? 'opacity-50 cursor-not-allowed' : ''} focus:ring-2 focus:ring-primary focus:ring-offset-1`}
                                              style={{
                                                appearance: 'none',
                                                WebkitAppearance: 'none',
                                                backgroundImage: isConsumed ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'white\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\' clip-rule=\'evenodd\'/%3E%3C/svg%3E")' : 'none',
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat'
                                              }}
                                            />
                                          </div>
                                        )}
                                      </div>
                                      {meal ? (
                                        <>
                                          <h6 className={`font-medium text-sm mb-1 ${
                                            isConsumed ? 'text-success line-through' : 'text-text-primary'
                                          }`}>
                                            {meal.name}
                                          </h6>
                                          <div className="flex items-center space-x-3 text-xs text-text-secondary flex-wrap gap-2">
                                            <span className="flex items-center space-x-1">
                                              <Icon name="Zap" size={12} />
                                              <span>{meal.calories} cal</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                              <Icon name="Clock" size={12} />
                                              <span>{meal.prepTime}</span>
                                            </span>
                                          {meal.servingSize && (
                                            <span className="flex items-center space-x-1">
                                              <Icon name="Ruler" size={12} />
                                              <span>{meal.servingSize}</span>
                                            </span>
                                          )}
                                        </div>
                                        {isConsumed && (
                                          <p className="text-xs text-success mt-1 flex items-center space-x-1">
                                            <Icon name="CheckCircle" size={12} />
                                            <span>Completed</span>
                                          </p>
                                        )}
                                        {/* Ayurvedic Properties */}
                                        {meal && <MealAyurvedicProperties meal={meal} />}
                                      </>
                                    ) : (
                                      <p className="text-xs text-text-secondary italic">No meal assigned</p>
                                    )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                Review Diet Plans
              </h1>
              <p className="text-text-secondary">
                View and manage meal plans for all patients
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
                options={[
                  { value: 'all', label: 'All Doshas' },
                  { value: 'vata', label: 'Vata' },
                  { value: 'pitta', label: 'Pitta' },
                  { value: 'kapha', label: 'Kapha' }
                ]}
                    value={filterDosha}
                    onChange={setFilterDosha}
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
                <Icon name="Users" size={48} className="text-text-secondary mx-auto mb-4" />
                <h3 className="font-medium text-text-primary mb-2">No patients found</h3>
                <p className="text-text-secondary">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No patients have been assigned diet plans yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPatients.map((patient) => {
                  const isExpanded = expandedPatient === patient.id;
                  const isEditing = editingMeal?.patientId === patient.id;

                  return (
                    <div key={patient.id} className="bg-card rounded-lg border border-border shadow-organic">
                      {/* Patient Header */}
                      <div 
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-smooth"
                        onClick={() => setExpandedPatient(isExpanded ? null : patient.id)}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-brand-gradient rounded-full flex items-center justify-center">
                            <Icon name="User" size={20} color="white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-text-primary">{patient.name}</h3>
                            <p className="text-sm text-text-secondary">{patient.email}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              patient.constitution === 'Vata' ? 'bg-blue-100 text-blue-700' :
                              patient.constitution === 'Pitta' ? 'bg-red-100 text-red-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {patient.constitution} Constitution
                            </span>
                            <span className="text-sm text-text-secondary">
                              {patient.dietPlan?.name || 'No diet plan'}
                            </span>
                    </div>
                  </div>
                        <Icon 
                          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                          size={20} 
                          className="text-text-secondary ml-4"
                        />
                    </div>

                      {/* Expanded Meal Plans */}
                      {isExpanded && patient.dietPlan && (
                        <div className="border-t border-border p-4">
                          <div className="mb-4 flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-text-primary mb-1">
                                {patient.dietPlan.name}
                              </h4>
                              <p className="text-sm text-text-secondary">
                                Duration: {patient.dietPlan.duration} • Started: {new Date(patient.dietPlan.startDate).toLocaleDateString()}
                      </p>
                    </div>
                <Button
                  variant="outline"
                              size="sm"
                              onClick={() => navigate(`/ai-diet-generator?patient=${patient.id}`)}
                              iconName="Edit"
                >
                  Generate New Plan
                </Button>
                          </div>

                          {/* Weekly Meal Plan */}
                          <div className="space-y-4">
                            {daysOfWeek.map((day) => {
                              const dayMeals = patient.dietPlan.meals[day];
                              if (!dayMeals) return null;

                              const isEditingDay = isEditing && editingMeal.day === day;

                              const nutritionTotals = calculateDayNutrition(dayMeals);
                              const nutritionInfoKey = `${patient.id}-${day}`;
                              const isShowingNutrition = showNutritionInfo === nutritionInfoKey;

                              return (
                                <div key={day} className="bg-surface rounded-lg p-4 border border-border">
                                  <div className="flex items-center justify-between mb-3">
                                    <h5 className="font-medium text-text-primary flex items-center space-x-2">
                                      <Icon name="Calendar" size={16} />
                                      <span>{dayLabels[day]}</span>
                                    </h5>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleNutritionInfo(patient.id, day);
                                      }}
                                      className="p-1.5 rounded-full hover:bg-muted transition-smooth group"
                                      title="View nutritional information"
                                    >
                                      <Icon 
                                        name="Info" 
                                        size={18} 
                                        className={`text-text-secondary group-hover:text-primary transition-colors ${
                                          isShowingNutrition ? 'text-primary' : ''
                                        }`}
                                      />
                                    </button>
                                  </div>

                                  {/* Nutritional Summary Card */}
                                  {isShowingNutrition && nutritionTotals && (
                                    <div className="mb-4 p-4 bg-card rounded-lg border border-primary/20 shadow-organic">
                                      <div className="flex items-center justify-between mb-3">
                                        <h6 className="font-semibold text-text-primary flex items-center space-x-2">
                                          <Icon name="Activity" size={16} className="text-primary" />
                                          <span>Daily Nutritional Summary</span>
                                        </h6>
                                        <button
                                          onClick={() => setShowNutritionInfo(null)}
                                          className="p-1 rounded-full hover:bg-muted transition-smooth"
                                        >
                                          <Icon name="X" size={14} className="text-text-secondary" />
                                        </button>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        <div className="space-y-1">
                                          <div className="text-xs text-text-secondary">Total Calories</div>
                                          <div className="text-lg font-semibold text-text-primary">
                                            {nutritionTotals.calories}
                                            <span className="text-xs font-normal text-text-secondary ml-1">kcal</span>
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <div className="text-xs text-text-secondary">Protein</div>
                                          <div className="text-lg font-semibold text-primary">
                                            {nutritionTotals.protein}
                                            <span className="text-xs font-normal text-text-secondary ml-1">g</span>
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <div className="text-xs text-text-secondary">Carbohydrates</div>
                                          <div className="text-lg font-semibold text-orange-500">
                                            {nutritionTotals.carbs}
                                            <span className="text-xs font-normal text-text-secondary ml-1">g</span>
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <div className="text-xs text-text-secondary">Fats</div>
                                          <div className="text-lg font-semibold text-yellow-500">
                                            {nutritionTotals.fats}
                                            <span className="text-xs font-normal text-text-secondary ml-1">g</span>
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <div className="text-xs text-text-secondary">Fiber</div>
                                          <div className="text-lg font-semibold text-green-500">
                                            {nutritionTotals.fiber}
                                            <span className="text-xs font-normal text-text-secondary ml-1">g</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Recommended Daily Values (for reference) */}
                                      <div className="mt-4 pt-4 border-t border-border">
                                        <div className="text-xs text-text-secondary">
                                          <span className="font-medium">Recommended Daily Intake:</span> 
                                          <span className="ml-2">Calories: 2000-2500 kcal</span>
                                          <span className="mx-2">•</span>
                                          <span>Protein: 50-75g</span>
                                          <span className="mx-2">•</span>
                                          <span>Carbs: 225-325g</span>
                                          <span className="mx-2">•</span>
                                          <span>Fats: 44-78g</span>
                                          <span className="mx-2">•</span>
                                          <span>Fiber: 25-30g</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {['breakfast', 'lunch', 'dinner'].map((mealType) => {
                                      const meal = dayMeals[mealType];
                                      const isEditingMealType = isEditingDay && editingMeal.mealType === mealType;

                                      if (isEditingMealType) {
                                        return (
                                          <div key={mealType}>
                                            <label className="text-xs font-medium text-text-secondary mb-2 block capitalize">
                                              {mealType}
                                            </label>
                                            <MealEditForm
                                              meal={meal}
                                              onSave={(updated) => handleSaveMeal({ ...updated, id: meal.id })}
                                              onCancel={handleCancelEdit}
                                            />
                                          </div>
                                        );
                                      }

                                      return (
                                        <div 
                                          key={mealType}
                                          className="bg-muted rounded-lg p-3 hover:bg-muted/80 transition-smooth"
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <label className="text-xs font-medium text-text-secondary capitalize">
                                              {mealType}
                                            </label>
                <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditMeal(patient.id, day, mealType, meal);
                                              }}
                                              className="h-6 w-6 p-0"
                                            >
                                              <Icon name="Edit" size={12} />
                </Button>
                                          </div>
                                          {meal ? (
                                            <>
                                              <h6 className="font-medium text-text-primary text-sm mb-1">
                                                {meal.name}
                                              </h6>
                                              <div className="flex items-center space-x-3 text-xs text-text-secondary flex-wrap gap-2">
                                                <span className="flex items-center space-x-1">
                                                  <Icon name="Zap" size={12} />
                                                  <span>{meal.calories} cal</span>
                                                </span>
                                                <span className="flex items-center space-x-1">
                                                  <Icon name="Clock" size={12} />
                                                  <span>{meal.prepTime}</span>
                                                </span>
                                                {meal.servingSize && (
                                                  <span className="flex items-center space-x-1">
                                                    <Icon name="Ruler" size={12} />
                                                    <span>{meal.servingSize}</span>
                                                  </span>
                                                )}
                                              </div>
                                              {/* Ayurvedic Properties */}
                                              {meal && <MealAyurvedicProperties meal={meal} />}
                                            </>
                                          ) : (
                                            <p className="text-xs text-text-secondary italic">No meal assigned</p>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DietPlanViewer;
