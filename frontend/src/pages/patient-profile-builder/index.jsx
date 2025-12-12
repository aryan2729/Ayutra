import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import PersonalInfoForm from './components/PersonalInfoForm';
import QuestionCard from './components/QuestionCard';
import PrakritiAssessment from './components/PrakritiAssessment';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useSession } from '../../contexts/AuthContext';

const PatientProfileBuilder = () => {
  const navigate = useNavigate();
  const { data } = useSession();
  const userRole = data?.user?.role || data?.session?.user?.role;
  const isPatient = userRole && String(userRole).toLowerCase() === 'patient';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    healthGoals: [],
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);

  const steps = [
    { id: 1, title: 'Personal Info' },
    { id: 2, title: 'Assessment' }
  ];

  // Comprehensive Prakriti Assessment Questions
  const prakritiAssessmentQuestions = [
    // SECTION 1: ANATOMICAL FEATURES
    {
      id: 'body_frame_breadth',
      title: 'Body Frame Breadth (Akriti-Vistara Pramana)',
      sanskritTerm: 'Akriti',
      sanskritMeaning: 'Physical structure assessment',
      icon: 'User',
      type: 'multi',
      subQuestions: [
        {
          id: 'overall_frame_breadth',
          question: '1.1 Overall Body Frame:',
      options: [
        {
              id: 'vata_overall_frame',
              text: 'Thin/Narrow',
              description: 'Delicate, slender structure'
        },
        {
              id: 'pitta_overall_frame',
              text: 'Medium',
              description: 'Moderate, well-proportioned structure'
        },
        {
              id: 'kapha_overall_frame',
              text: 'Broad',
              description: 'Large, solid structure'
        }
      ]
    },
    {
          id: 'shoulder_breadth',
          question: '1.2 Shoulder Width:',
          options: [
            {
              id: 'vata_shoulder_width',
              text: 'Thin/Narrow',
              description: 'Narrow, delicate shoulders'
            },
            {
              id: 'pitta_shoulder_width',
              text: 'Medium',
              description: 'Moderate shoulder width'
            },
            {
              id: 'kapha_shoulder_width',
              text: 'Broad',
              description: 'Broad, sturdy shoulders'
            }
          ]
        },
        {
          id: 'chest_structure',
          question: '1.3 Chest Structure:',
          options: [
            {
              id: 'vata_chest_structure',
              text: 'Thin/Narrow',
              description: 'Narrow, flat chest'
            },
            {
              id: 'pitta_chest_structure',
              text: 'Medium',
              description: 'Moderate chest development'
            },
            {
              id: 'kapha_chest_structure',
              text: 'Broad',
              description: 'Broad, full chest'
            }
          ]
        },
        {
          id: 'forehead_breadth',
          question: '1.4 Forehead Width:',
          options: [
            {
              id: 'vata_forehead_width',
              text: 'Thin/Narrow',
              description: 'Narrow forehead (<4 angula)'
            },
            {
              id: 'pitta_forehead_width',
              text: 'Medium',
              description: 'Moderate forehead width (=4 angula)'
            },
            {
              id: 'kapha_forehead_width',
              text: 'Broad',
              description: 'Broad forehead (>4 angula)'
            }
          ]
        }
      ]
    },
    {
      id: 'body_frame_length',
      title: 'Body Frame Length (Akriti-Ayama Pramana)',
      sanskritTerm: 'Akriti Ayama',
      sanskritMeaning: 'Body length assessment',
      icon: 'User',
      type: 'multi',
      subQuestions: [
        {
          id: 'overall_length',
          question: '2.1 Overall Body Length:',
          options: [
            {
              id: 'vata_overall_length',
              text: 'Long',
              description: 'Tall, elongated structure'
            },
            {
              id: 'pitta_overall_length',
              text: 'Medium',
              description: 'Average height'
            },
            {
              id: 'kapha_vata_overall_length',
              text: 'Too Short/Too Long',
              description: 'Extreme height variations'
            }
          ]
        },
        {
          id: 'forehead_length',
          question: '2.2 Forehead Length:',
          options: [
            {
              id: 'vata_forehead_length',
              text: 'Long',
              description: 'Elongated forehead'
            },
            {
              id: 'pitta_forehead_length',
              text: 'Medium',
              description: 'Average forehead length'
            },
            {
              id: 'kapha_forehead_length',
              text: 'Too Short/Too Long',
              description: 'Extreme forehead length'
            }
          ]
        }
      ]
    },
    {
      id: 'body_size_development',
      title: 'Size & Development (Upachaya-Praman)',
      sanskritTerm: 'Upachaya',
      sanskritMeaning: 'Body development assessment',
      icon: 'User',
      type: 'multi',
      subQuestions: [
        {
          id: 'body_build',
          question: '3.1 Body Build:',
          options: [
            {
              id: 'vata_body_build',
              text: 'Weakly Developed',
              description: 'Underdeveloped, delicate'
            },
            {
              id: 'pitta_body_build',
              text: 'Moderately Developed',
              description: 'Average development'
            },
            {
              id: 'kapha_body_build',
              text: 'Well Developed',
              description: 'Strong, robust build'
            }
          ]
        },
        {
          id: 'face_development',
          question: '3.2 Face Development:',
          options: [
            {
              id: 'vata_face_development',
              text: 'Weakly Developed',
              description: 'Thin, delicate facial features'
            },
            {
              id: 'pitta_face_development',
              text: 'Moderately Developed',
              description: 'Average facial development'
            },
            {
              id: 'kapha_face_development',
              text: 'Well Developed',
              description: 'Full, well-developed face'
            }
          ]
        },
        {
          id: 'eye_development',
          question: '3.3 Eye Development:',
          options: [
            {
              id: 'vata_eye_development',
              text: 'Weakly Developed',
              description: 'Small, underdeveloped eyes'
            },
            {
              id: 'pitta_eye_development',
              text: 'Moderately Developed',
              description: 'Average eye size'
            },
            {
              id: 'kapha_eye_development',
              text: 'Well Developed',
              description: 'Large, prominent eyes'
            }
          ]
        },
        {
          id: 'eyelash_size',
          question: '3.4 Eyelash Size:',
          options: [
            {
              id: 'vata_eyelash',
              text: 'Small',
              description: 'Short, thin eyelashes'
            },
            {
              id: 'pitta_eyelash',
              text: 'Medium',
              description: 'Average eyelash length'
            },
            {
              id: 'kapha_eyelash',
              text: 'Large',
              description: 'Long, thick eyelashes'
            }
          ]
        },
        {
          id: 'joints_development',
          question: '3.5 Joints Development:',
          options: [
            {
              id: 'vata_joints',
              text: 'Weakly Developed',
              description: 'Small, prominent joints'
            },
            {
              id: 'pitta_joints',
              text: 'Moderately Developed',
              description: 'Average joint size'
            },
            {
              id: 'kapha_joints',
              text: 'Well Developed',
              description: 'Large, well-covered joints'
            }
          ]
        },
        {
          id: 'lips_size',
          question: '3.6 Lips Size:',
          options: [
            {
              id: 'vata_lips',
              text: 'Small',
              description: 'Thin, narrow lips'
            },
            {
              id: 'pitta_lips',
              text: 'Medium',
              description: 'Average lip size'
            },
            {
              id: 'kapha_lips',
              text: 'Large',
              description: 'Full, broad lips'
            }
          ]
        },
        {
          id: 'nails_size',
          question: '3.7 Nails Size:',
          options: [
            {
              id: 'vata_nails',
              text: 'Small',
              description: 'Short nails, length < breadth'
            },
            {
              id: 'pitta_nails',
              text: 'Medium',
              description: 'Length = breadth'
            },
            {
              id: 'kapha_nails',
              text: 'Large',
              description: 'Long nails, length > breadth'
            }
          ]
        }
      ]
    },
    {
      id: 'body_musculature',
      title: 'Body Build Musculature (Upachaya: Dravata-Dridhata)',
      sanskritTerm: 'Dravata-Dridhata',
      sanskritMeaning: 'Muscle tone assessment',
      icon: 'Activity',
      type: 'single',
      options: [
        {
          id: 'vata_musculature',
          text: 'Thin',
          description: 'Lean and slender physique'
        },
        {
          id: 'pitta_kapha_musculature',
          text: 'Soft and Loosely Knitted',
          description: 'Less toned, relaxed muscle structure'
        },
        {
          id: 'kapha_musculature',
          text: 'Smooth and Firmly Knitted',
          description: 'Well-defined, toned muscular build'
        }
      ]
    },
    // SECTION 2: PHYSIOLOGICAL FEATURES
    {
      id: 'skin_features',
      title: 'Skin Features (Varna)',
      sanskritTerm: 'Tvak',
      sanskritMeaning: 'Skin characteristics',
      icon: 'Sparkles',
      type: 'multi',
      subQuestions: [
        {
          id: 'skin_appearance',
          question: '5.1 Skin Appearance (Select all that apply):',
          type: 'multiple_select',
      options: [
        {
              id: 'vata_skin_cracked',
              text: 'Cracked skin',
              description: 'Visible breaks or fissures'
            },
            {
              id: 'pitta_skin_lustrous',
              text: 'Lustrous skin',
              description: 'Healthy glow or sheen'
        },
        {
              id: 'pitta_skin_moles',
              text: 'Moles',
              description: 'Melanin pigmented spots'
            },
            {
              id: 'vata_skin_wrinkled',
              text: 'Wrinkled skin',
              description: 'Fine lines or creases'
            },
            {
              id: 'vata_pitta_prominent_veins',
              text: 'Prominently visible veins and tendons',
              description: 'Noticeably visible veins'
        },
        {
              id: 'kapha_skin_clear',
              text: 'Clear skin',
              description: 'Free of blemishes'
        }
      ]
    },
    {
          id: 'skin_nature',
          question: '5.2 Skin Nature:',
      options: [
        {
              id: 'vata_skin_nature',
              text: 'Dry',
              description: 'Often feels dry, tight, irritable'
        },
        {
              id: 'pitta_skin_nature',
              text: 'Oily',
              description: 'Frequently feels oily or sticky'
        },
        {
              id: 'vata_pitta_skin_nature',
              text: 'Seasonal/Variable',
              description: 'Changes with seasons'
            },
            {
              id: 'kapha_skin_nature',
              text: 'Normal',
              description: 'Balanced, not too dry or oily'
        }
      ]
    },
    {
          id: 'skin_texture',
          question: '5.3 Skin Texture:',
      options: [
        {
              id: 'vata_skin_texture',
              text: 'Rough',
              description: 'Uneven, not smooth to touch'
        },
        {
              id: 'pitta_kapha_skin_texture',
              text: 'Smooth',
              description: 'Even, lustrous, glowing'
        },
        {
              id: 'vata_kapha_skin_texture',
              text: 'Coarse',
              description: 'High level of roughness'
        }
      ]
    },
    {
          id: 'skin_color',
          question: '5.4 Skin Color:',
      options: [
        {
              id: 'vata_skin_color',
              text: 'Dark/Dusky',
              description: 'Dark complexion'
            },
            {
              id: 'pitta_skin_color',
              text: 'Fair Reddish/Pale Yellow',
              description: 'Fair with reddish/yellow tinge'
            },
            {
              id: 'kapha_skin_color',
              text: 'Fair Pink/Wheatish',
              description: 'Fresh, pink or wheatish complexion'
            }
          ]
        },
        {
          id: 'skin_type',
          question: '5.5 Skin Type:',
          options: [
            {
              id: 'vata_skin_type',
              text: 'Thin',
              description: 'Delicate, thin skin'
            },
            {
              id: 'kapha_skin_type',
              text: 'Thick',
              description: 'Thick, resilient skin'
            }
          ]
        }
      ]
    },
    {
      id: 'hair_features',
      title: 'Hair Features (Kesha)',
      sanskritTerm: 'Kesha',
      sanskritMeaning: 'Hair characteristics',
      icon: 'Sparkles',
      type: 'multi',
      subQuestions: [
        {
          id: 'hair_nature',
          question: '6.1 Hair Nature:',
          options: [
            {
              id: 'vata_hair_nature',
              text: 'Dry',
              description: 'Dry, brittle hair'
            },
            {
              id: 'pitta_hair_nature',
              text: 'Oily',
              description: 'Greasy, oily hair'
            },
            {
              id: 'vata_pitta_hair_nature',
              text: 'Seasonal/Variable',
              description: 'Changes with seasons'
            },
            {
              id: 'kapha_hair_nature',
              text: 'Normal',
              description: 'Balanced hair'
            }
          ]
        },
        {
          id: 'hair_color',
          question: '6.2 Hair Color:',
          options: [
            {
              id: 'vata_kapha_hair_color',
              text: 'Black/Dark Brown',
              description: 'Dark hair color'
            },
            {
              id: 'pitta_hair_color',
              text: 'Dusky/Light Brown',
              description: 'Lighter hair shades'
            }
          ]
        },
        {
          id: 'hair_type',
          question: '6.3 Hair Type:',
          options: [
            {
              id: 'vata_hair_type',
              text: 'Thin',
              description: 'Fine, thin hair strands'
            },
            {
              id: 'kapha_hair_type',
              text: 'Thick',
              description: 'Thick, coarse hair strands'
            }
          ]
        },
        {
          id: 'hair_prone_to',
          question: '6.4 Hair Prone to:',
          type: 'multiple_select',
          options: [
            {
              id: 'vata_hair_graying',
              text: 'Graying',
              description: 'Early or premature graying'
            },
            {
              id: 'vata_hair_falling',
              text: 'Falling',
              description: 'Hair loss tendency'
            },
            {
              id: 'vata_hair_breaking',
              text: 'Breaking',
              description: 'Brittle, breakable hair'
            },
            {
              id: 'vata_hair_split_ends',
              text: 'Split at ends',
              description: 'Split ends tendency'
            },
            {
              id: 'kapha_hair_none',
              text: 'None',
              description: 'Healthy, strong hair'
            }
          ]
        }
      ]
    },
    {
      id: 'nail_features',
      title: 'Nail Features (Nakha)',
      sanskritTerm: 'Nakha',
      sanskritMeaning: 'Nail characteristics',
      icon: 'Sparkles',
      type: 'multi',
      subQuestions: [
        {
          id: 'nail_color',
          question: '7.1 Nail Color:',
          options: [
            {
              id: 'vata_nail_color',
              text: 'Dark',
              description: 'Dark colored nails'
            },
            {
              id: 'pitta_nail_color',
              text: 'Reddish',
              description: 'Reddish tinge nails'
            },
            {
              id: 'pitta_nail_color_yellow',
              text: 'Pale Yellow',
              description: 'Yellowish nails'
            },
            {
              id: 'kapha_nail_color',
              text: 'Pink',
              description: 'Pink, healthy nails'
            }
          ]
        },
        {
          id: 'nail_texture',
          question: '7.2 Nail Texture:',
          options: [
            {
              id: 'kapha_nail_texture',
              text: 'Smooth',
              description: 'Smooth, even nails'
            },
            {
              id: 'vata_nail_texture',
              text: 'Rough',
              description: 'Rough, uneven nails'
            },
            {
              id: 'kapha_nail_texture_soft',
              text: 'Soft',
              description: 'Soft, bendable nails'
            }
          ]
        },
        {
          id: 'nail_nature',
          question: '7.3 Nail Nature:',
          options: [
            {
              id: 'kapha_nail_nature',
              text: 'Firm',
              description: 'Strong, firm nails'
            },
            {
              id: 'vata_nail_nature',
              text: 'Brittle/Cracked',
              description: 'Easily breakable nails'
            }
          ]
        }
      ]
    },
    {
      id: 'teeth_palate_features',
      title: 'Teeth & Palate Features (Danta-Talu)',
      sanskritTerm: 'Danta-Talu',
      sanskritMeaning: 'Teeth and palate characteristics',
      icon: 'Sparkles',
      type: 'multi',
      subQuestions: [
        {
          id: 'teeth_color',
          question: '8.1 Teeth Color:',
          options: [
            {
              id: 'vata_teeth_color',
              text: 'Dull/Blackish',
              description: 'Dark, dull teeth'
            },
            {
              id: 'kapha_teeth_color',
              text: 'Milky White',
              description: 'White, lustrous teeth'
            },
            {
              id: 'pitta_teeth_color',
              text: 'Yellowish',
              description: 'Yellow tinge teeth'
            }
          ]
        },
        {
          id: 'teeth_shape',
          question: '8.2 Teeth Shape:',
          options: [
            {
              id: 'kapha_teeth_shape',
              text: 'Even',
              description: 'Regular, even teeth'
            },
            {
              id: 'vata_teeth_shape',
              text: 'Uneven',
              description: 'Irregular teeth alignment'
            }
          ]
        },
        {
          id: 'teeth_size',
          question: '8.3 Teeth Size:',
          options: [
            {
              id: 'kapha_teeth_size',
              text: 'Large',
              description: 'Large, well-developed teeth'
            },
            {
              id: 'pitta_teeth_size',
              text: 'Medium',
              description: 'Average tooth size'
            },
            {
              id: 'vata_teeth_size_small',
              text: 'Too Small',
              description: 'Very small teeth'
            },
            {
              id: 'vata_teeth_size_large',
              text: 'Too Large',
              description: 'Disproportionately large teeth'
            }
          ]
        },
        {
          id: 'palate_color',
          question: '8.4 Palate Color:',
          options: [
            {
              id: 'vata_palate_color',
              text: 'Dark',
              description: 'Dark colored palate'
            },
            {
              id: 'pitta_palate_color',
              text: 'Reddish',
              description: 'Reddish palate'
            },
            {
              id: 'pitta_palate_color_yellow',
              text: 'Pale Yellow',
              description: 'Yellowish palate'
            },
            {
              id: 'kapha_palate_color',
              text: 'Pink',
              description: 'Pink, healthy palate'
            }
          ]
        }
      ]
    },
    {
      id: 'lips_features',
      title: 'Lips Features (Oshtha)',
      sanskritTerm: 'Oshtha',
      sanskritMeaning: 'Lip characteristics',
      icon: 'Sparkles',
      type: 'multi',
      subQuestions: [
        {
          id: 'lips_color',
          question: '9.1 Lips Color:',
          options: [
            {
              id: 'vata_lips_color',
              text: 'Dark',
              description: 'Dark colored lips'
            },
            {
              id: 'pitta_lips_color',
              text: 'Reddish',
              description: 'Reddish lips'
            },
            {
              id: 'pitta_lips_color_yellow',
              text: 'Pale Yellow',
              description: 'Yellowish lips'
            },
            {
              id: 'kapha_lips_color',
              text: 'Pink',
              description: 'Pink, healthy lips'
            }
          ]
        },
        {
          id: 'lips_tendency',
          question: '9.2 Lips Tendency:',
          options: [
            {
              id: 'kapha_lips_tendency',
              text: 'Firm',
              description: 'Firm, resilient lips'
            },
            {
              id: 'vata_lips_tendency',
              text: 'Cracked',
              description: 'Dry, cracked lips'
            },
            {
              id: 'vata_lips_tendency_wrinkled',
              text: 'Wrinkled',
              description: 'Wrinkled lips'
            }
          ]
        }
      ]
    },
    {
      id: 'palm_features',
      title: 'Palm Features (Pani)',
      sanskritTerm: 'Pani',
      sanskritMeaning: 'Palm characteristics',
      icon: 'Sparkles',
      type: 'multi',
      subQuestions: [
        {
          id: 'palm_color',
          question: '10.1 Palm Color:',
          options: [
            {
              id: 'vata_palm_color',
              text: 'Dark',
              description: 'Dark colored palms'
            },
            {
              id: 'pitta_palm_color',
              text: 'Reddish',
              description: 'Reddish palms'
            },
            {
              id: 'pitta_palm_color_yellow',
              text: 'Pale Yellow',
              description: 'Yellowish palms'
            },
            {
              id: 'kapha_palm_color',
              text: 'Pink',
              description: 'Pink, healthy palms'
            }
          ]
        },
        {
          id: 'palm_tendency',
          question: '10.2 Palm Tendency:',
          options: [
            {
              id: 'kapha_palm_tendency',
              text: 'Firm',
              description: 'Firm, resilient palms'
            },
            {
              id: 'vata_palm_tendency',
              text: 'Cracked',
              description: 'Dry, cracked palms'
            },
            {
              id: 'vata_palm_tendency_wrinkled',
              text: 'Wrinkled',
              description: 'Wrinkled palms'
            }
          ]
        }
      ]
    },
    {
      id: 'sole_features',
      title: 'Sole Features (Pada)',
      sanskritTerm: 'Pada',
      sanskritMeaning: 'Sole characteristics',
      icon: 'Sparkles',
      type: 'multi',
      subQuestions: [
        {
          id: 'sole_color',
          question: '11.1 Sole Color:',
          options: [
            {
              id: 'vata_sole_color',
              text: 'Dark',
              description: 'Dark colored soles'
            },
            {
              id: 'pitta_sole_color',
              text: 'Reddish',
              description: 'Reddish soles'
            },
            {
              id: 'pitta_sole_color_yellow',
              text: 'Pale Yellow',
              description: 'Yellowish soles'
            },
            {
              id: 'kapha_sole_color',
              text: 'Pink',
              description: 'Pink, healthy soles'
            }
          ]
        },
        {
          id: 'sole_tendency',
          question: '11.2 Sole Tendency:',
          options: [
            {
              id: 'kapha_sole_tendency',
              text: 'Firm',
              description: 'Firm, resilient soles'
            },
            {
              id: 'vata_sole_tendency',
              text: 'Cracked',
              description: 'Dry, cracked soles'
            },
            {
              id: 'vata_sole_tendency_wrinkled',
              text: 'Wrinkled',
              description: 'Wrinkled soles'
            }
          ]
        }
      ]
    },
    // SECTION 3: PHYSIOLOGICAL FUNCTIONS
    {
      id: 'food_behavior',
      title: 'Food Behavior (Bhakti-Abhilasha)',
      sanskritTerm: 'Bhakti',
      sanskritMeaning: 'Food preferences and digestion',
      icon: 'Utensils',
      type: 'multi',
      subQuestions: [
        {
          id: 'taste_preference',
          question: '12.1 Taste Preference (Select all that apply):',
          type: 'multiple_select',
          options: [
            {
              id: 'kapha_taste_sweet',
              text: 'Sweet',
              description: 'Prefers sweet foods'
        },
        {
              id: 'pitta_taste_sour',
              text: 'Sour',
              description: 'Prefers sour foods'
            },
            {
              id: 'pitta_taste_salty',
              text: 'Salty',
              description: 'Prefers salty foods'
            },
            {
              id: 'vata_taste_bitter',
              text: 'Bitter',
              description: 'Prefers bitter foods'
            },
            {
              id: 'vata_taste_pungent',
              text: 'Pungent',
              description: 'Prefers spicy foods'
            },
            {
              id: 'vata_taste_astringent',
              text: 'Astringent',
              description: 'Prefers astringent foods'
            }
          ]
        },
        {
          id: 'food_temperature',
          question: '12.2 Preferred Food/Beverage Temperature:',
          type: 'multiple_select',
          options: [
            {
              id: 'pitta_food_temperature',
              text: 'Cold',
              description: 'Prefers cold food/drinks'
            },
            {
              id: 'vata_food_temperature',
              text: 'Warm',
              description: 'Prefers warm food/drinks'
            },
            {
              id: 'kapha_food_temperature',
              text: 'Any',
              description: 'No temperature preference'
            },
            {
              id: 'vata_pitta_food_temperature',
              text: 'None',
              description: 'Avoids extreme temperatures'
            }
          ]
        },
        {
          id: 'appetite_frequency',
          question: '12.3 Appetite Frequency:',
          options: [
            {
              id: 'pitta_appetite_frequency',
              text: 'Regular',
              description: 'Hunger at regular intervals'
            },
            {
              id: 'vata_appetite_frequency',
              text: 'Irregular',
              description: 'Unpredictable hunger'
            }
          ]
        },
        {
          id: 'appetite_amount',
          question: '12.4 Appetite Amount:',
          options: [
            {
              id: 'vata_appetite_amount',
              text: 'Low',
              description: 'Eats small portions'
            },
            {
              id: 'pitta_appetite_amount',
              text: 'Medium',
              description: 'Moderate portion size'
            },
            {
              id: 'kapha_appetite_amount',
              text: 'High',
              description: 'Eats large portions'
            },
            {
              id: 'vata_appetite_amount_variable',
              text: 'Variable',
              description: 'Inconsistent amount'
            }
          ]
        },
        {
          id: 'digestive_power',
          question: '12.5 Digestive Amount:',
          options: [
            {
              id: 'vata_digestive_power_low',
              text: 'Low',
              description: 'Mandagni - digests with difficulty'
            },
            {
              id: 'pitta_digestive_power_medium',
              text: 'Medium',
              description: 'Sama Agni - normal digestion'
            },
            {
              id: 'pitta_digestive_power_high',
              text: 'High',
              description: 'Teekshnagni - strong digestion'
            },
            {
              id: 'vata_digestive_power_variable',
              text: 'Variable',
              description: 'Vishama Agni - unpredictable'
            }
          ]
        }
      ]
    },
    {
      id: 'physiological_functions',
      title: 'Other Physiological Functions',
      sanskritTerm: 'Kriya',
      sanskritMeaning: 'Body functions assessment',
      icon: 'Activity',
      type: 'multi',
      subQuestions: [
        {
          id: 'body_temperature',
          question: '13.1 Body Temperature:',
          options: [
            {
              id: 'vata_body_temperature',
              text: 'Low',
              description: 'Often feels colder than others'
            },
            {
              id: 'pitta_body_temperature',
              text: 'High',
              description: 'Often feels warmer than others'
            },
            {
              id: 'kapha_body_temperature',
              text: 'Medium',
              description: 'Average body temperature'
            },
            {
              id: 'vata_body_temperature_variable',
              text: 'Variable',
              description: 'Fluctuating temperature'
            }
          ]
        },
        {
          id: 'perspiration',
          question: '13.2 Perspiration:',
          options: [
            {
              id: 'pitta_perspiration',
              text: 'High',
              description: 'Sweats excessively'
            },
            {
              id: 'vata_perspiration',
              text: 'Low',
              description: 'Rarely sweats'
            },
            {
              id: 'kapha_perspiration',
              text: 'Medium',
              description: 'Moderate sweating'
            },
            {
              id: 'vata_perspiration_variable',
              text: 'Variable',
              description: 'Inconsistent sweating'
            }
          ]
        },
        {
          id: 'body_odour',
          question: '13.3 Body Odour:',
          options: [
            {
              id: 'pitta_body_odour',
              text: 'Strong',
              description: 'Pronounced body odor'
        },
        {
              id: 'kapha_body_odour',
              text: 'Very Less',
              description: 'Minimal body odor'
            },
            {
              id: 'kapha_body_odour_mild',
              text: 'Mild',
              description: 'Slight, pleasant odor'
            }
          ]
        },
        {
          id: 'sleep_amount',
          question: '13.4 Sleep Amount:',
          options: [
            {
              id: 'vata_sleep_amount',
              text: 'Low',
              description: 'Less sleep needed'
            },
            {
              id: 'pitta_sleep_amount',
              text: 'Medium',
              description: 'Average sleep needs'
            },
            {
              id: 'kapha_sleep_amount',
              text: 'High',
              description: 'More sleep needed'
            },
            {
              id: 'vata_sleep_amount_variable',
              text: 'Variable',
              description: 'Inconsistent sleep needs'
            }
          ]
        },
        {
          id: 'sleep_quality',
          question: '13.5 Sleep Quality:',
          options: [
            {
              id: 'kapha_sleep_quality',
              text: 'Deep',
              description: 'Deep, sound sleep'
            },
            {
              id: 'pitta_sleep_quality',
              text: 'Sound',
              description: 'Good quality sleep'
            },
            {
              id: 'vata_sleep_quality',
              text: 'Shallow',
              description: 'Light, easily disturbed sleep'
            }
          ]
        },
        {
          id: 'weight_changes',
          question: '13.6 Body Weight Changes:',
          options: [
            {
              id: 'pitta_weight_changes',
              text: 'Gain and Lose easily',
              description: 'Weight fluctuates easily'
            },
            {
              id: 'vata_weight_changes',
              text: 'Difficulty in gaining',
              description: 'Hard to gain weight'
            },
            {
              id: 'kapha_weight_changes',
              text: 'Gain easily and Lose with difficulty',
              description: 'Easy to gain, hard to lose'
            },
            {
              id: 'kapha_weight_changes_stable',
              text: 'Stable',
              description: 'Weight remains constant'
            }
          ]
        }
      ]
    },
    {
      id: 'bowel_patterns',
      title: 'Bowel Patterns (Koshtha-Mala Pravritti)',
      sanskritTerm: 'Koshtha',
      sanskritMeaning: 'Intestinal habits',
      icon: 'Activity',
      type: 'multi',
      subQuestions: [
        {
          id: 'bowel_habit',
          question: '14.1 Bowel Habit (Frequency):',
          options: [
            {
              id: 'pitta_kapha_bowel_habit',
              text: 'Regular',
              description: 'Daily at fixed timings'
            },
            {
              id: 'vata_bowel_habit',
              text: 'Irregular',
              description: 'Not daily, inconsistent'
            },
            {
              id: 'vata_bowel_habit_variable',
              text: 'Variable',
              description: 'Changes frequently'
            }
          ]
        },
        {
          id: 'bowel_tendency',
          question: '14.2 Bowel Tendency:',
          options: [
            {
              id: 'vata_bowel_tendency',
              text: 'Constipation',
              description: 'Tendency toward constipation'
            },
            {
              id: 'pitta_bowel_tendency',
              text: 'Loose motion',
              description: 'Tendency toward diarrhea'
            },
            {
              id: 'kapha_bowel_tendency',
              text: 'None',
              description: 'Normal bowel movement'
            }
          ]
        },
        {
          id: 'stool_consistency',
          question: '14.3 Stool Consistency:',
          options: [
            {
              id: 'vata_stool_consistency',
              text: 'Hard',
              description: 'Hard, lumpy stools'
            },
            {
              id: 'pitta_stool_consistency',
              text: 'Loose/Soft/Semisolid',
              description: 'Soft, watery stools'
            },
            {
              id: 'kapha_stool_consistency',
              text: 'Formed (Medium)',
              description: 'Well-formed, sausage-like'
            }
          ]
        }
      ]
    },
    {
      id: 'strength_assessment',
      title: 'Strength Assessment (Bala)',
      sanskritTerm: 'Bala',
      sanskritMeaning: 'Physical and mental strength',
      icon: 'Activity',
      type: 'single',
      options: [
        {
          id: 'vata_strength',
          text: 'Low',
          description: 'Less physical and mental endurance'
        },
        {
          id: 'pitta_strength',
          text: 'Medium',
          description: 'Moderate strength and endurance'
        },
        {
          id: 'kapha_strength',
          text: 'High',
          description: 'Strong physical and mental endurance'
        }
      ]
    }
  ];

  // Use the comprehensive assessment questions
  const assessmentQuestions = prakritiAssessmentQuestions;

  useEffect(() => {
    // Save progress to localStorage
    const progressData = {
      currentStep,
      currentQuestionIndex,
      answers,
      formData,
      timestamp: new Date()?.toISOString()
    };
    localStorage.setItem('prakriti_assessment_progress', JSON.stringify(progressData));
  }, [currentStep, currentQuestionIndex, answers, formData]);

  useEffect(() => {
    // Load saved progress on component mount
    const savedProgress = localStorage.getItem('prakriti_assessment_progress');
    if (savedProgress) {
      try {
        const data = JSON.parse(savedProgress);
        // Only restore if saved within last 24 hours
        const savedTime = new Date(data.timestamp);
        const now = new Date();
        const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setCurrentStep(data?.currentStep || 1);
          setCurrentQuestionIndex(data?.currentQuestionIndex || 0);
          setAnswers(data?.answers || {});
          setFormData(data?.formData || formData);
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);


  const validatePersonalInfo = () => {
    const newErrors = {};
    
    if (!formData?.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData?.email)) newErrors.email = 'Invalid email format';
    if (!formData?.age) newErrors.age = 'Age is required';
    if (!formData?.gender) newErrors.gender = 'Gender is required';
    if (formData?.healthGoals?.length === 0) newErrors.healthGoals = 'At least one health goal is required';
    if (!formData?.termsAccepted) newErrors.termsAccepted = 'You must accept the terms to continue';
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Function to calculate prakriti based on selected answers
  const calculatePrakritiFromAnswers = (answers) => {
    const doshaCounts = { vata: 0, pitta: 0, kapha: 0 };
    
    // Helper function to process option IDs and count doshas
    const processOptionId = (optionId) => {
      if (!optionId) return;
      
      // Handle combined dosha options (e.g., 'vata_pitta_xxx')
      if (optionId.includes('vata_')) doshaCounts.vata += 1;
      if (optionId.includes('pitta_')) doshaCounts.pitta += 1;
      if (optionId.includes('kapha_')) doshaCounts.kapha += 1;
    };
    
    // Process answers - handle both single and multi-subquestion formats
    Object.entries(answers).forEach(([questionId, answer]) => {
      // If answer is an object (multi-subquestion format), process each sub-answer
      if (typeof answer === 'object' && answer !== null) {
        Object.values(answer).forEach(optionId => {
          // Handle arrays (for multiple_select)
          if (Array.isArray(optionId)) {
            optionId.forEach(id => processOptionId(id));
          } else {
            processOptionId(optionId);
          }
        });
      } else {
        // Single answer format
        if (Array.isArray(answer)) {
          answer.forEach(id => processOptionId(id));
        } else {
          processOptionId(answer);
        }
      }
    });
    
    // Determine primary prakriti
    let prakriti = '';
    const maxCount = Math.max(doshaCounts.vata, doshaCounts.pitta, doshaCounts.kapha);
    
    if (doshaCounts.vata === doshaCounts.pitta && doshaCounts.pitta === doshaCounts.kapha) {
      prakriti = 'Balanced (Sama)';
    } else if (doshaCounts.vata === maxCount && doshaCounts.pitta === maxCount) {
      prakriti = 'Vata-Pitta';
    } else if (doshaCounts.vata === maxCount && doshaCounts.kapha === maxCount) {
      prakriti = 'Vata-Kapha';
    } else if (doshaCounts.pitta === maxCount && doshaCounts.kapha === maxCount) {
      prakriti = 'Pitta-Kapha';
    } else if (doshaCounts.vata === maxCount) {
      prakriti = 'Vata';
    } else if (doshaCounts.pitta === maxCount) {
      prakriti = 'Pitta';
    } else {
      prakriti = 'Kapha';
    }
    
    return {
      prakriti,
      scores: {
        vata: doshaCounts.vata,
        pitta: doshaCounts.pitta,
        kapha: doshaCounts.kapha
      },
      description: `Based on your responses, your primary constitution is ${prakriti}.`
    };
  };

  const calculateConstitution = () => {
    const result = calculatePrakritiFromAnswers(answers);
    const primaryDosha = result.prakriti.split('-')[0].toLowerCase();
    const secondaryDosha = result.prakriti.includes('-') 
      ? result.prakriti.split('-')[1].split(' ')[0].toLowerCase() 
      : null;

    let characteristics = getCharacteristics(primaryDosha, secondaryDosha);
    const recommendations = getRecommendations(primaryDosha, secondaryDosha);

    return {
      primaryDosha: primaryDosha.charAt(0).toUpperCase() + primaryDosha.slice(1),
      secondaryDosha: secondaryDosha ? secondaryDosha.charAt(0).toUpperCase() + secondaryDosha.slice(1) : null,
      constitution: result.prakriti,
      characteristics,
      recommendations,
      scores: result.scores,
      description: result.description
    };
  };

  const getCharacteristics = (primary, secondary) => {
    const characteristics = {
      vata: ['Creative', 'Quick thinking', 'Flexible', 'Energetic when balanced', 'Light sleep'],
      pitta: ['Intense', 'Focused', 'Ambitious', 'Strong digestion', 'Medium sleep'],
      kapha: ['Stable', 'Calm', 'Loving', 'Strong build', 'Deep sleep']
    };
    
    const primaryChars = characteristics[primary] || [];
    const secondaryChars = secondary ? characteristics[secondary] || [] : [];
    
    return [...primaryChars, ...secondaryChars];
  };

  const getRecommendations = (primary, secondary) => {
    const recommendations = {
      vata: ['Warm, cooked foods', 'Regular routine', 'Gentle exercise', 'Adequate rest'],
      pitta: ['Cooling foods', 'Avoid spicy foods', 'Moderate exercise', 'Regular meals'],
      kapha: ['Light, warm foods', 'Regular exercise', 'Avoid heavy foods', 'Active lifestyle']
    };

    const primaryRecs = recommendations[primary] || [];
    const secondaryRecs = secondary ? recommendations[secondary] || [] : [];
    
    return [...primaryRecs, ...secondaryRecs];
  };

  const handleAnswerSelect = (questionId, answerData) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerData
    }));
  };

  const handleQuestionNext = () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Assessment complete
      const result = calculateConstitution();
      setAssessmentResult(result);
      
      // Save assessment result to localStorage for use in diet generator
      const patientData = {
        ...result,
        personalInfo: formData,
        completedAt: new Date()?.toISOString()
      };
      localStorage.setItem('patient_constitution', JSON.stringify(patientData));
      
      // Save flag to indicate a patient was just created/assessed (for auto-selection in AI Diet Generator)
      if (!isPatient) {
        localStorage.setItem('recently_created_patient', JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          age: formData.age,
          gender: formData.gender,
          constitution: result.primaryDosha + (result.secondaryDosha ? `-${result.secondaryDosha}` : ''),
          prakriti: result.primaryDosha + (result.secondaryDosha ? `-${result.secondaryDosha}` : ''),
          vata_state: result.vataState,
          pitta_state: result.pittaState,
          kapha_state: result.kaphaState,
          timestamp: new Date()?.toISOString()
        }));
      }
      
      // Navigate based on user role: patients go to dashboard, practitioners go to diet generator
      if (isPatient) {
        navigate('/intelligent-dashboard');
      } else {
      navigate('/ai-diet-generator');
      }
    }
  };

  const handleQuestionPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleStartDietGeneration = () => {
    if (isPatient) {
      navigate('/intelligent-dashboard');
    } else {
    navigate('/ai-diet-generator');
    }
  };

  const handlePersonalInfoNext = () => {
    if (validatePersonalInfo()) {
      setCurrentStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-text-primary mb-2">
                Patient Profile Builder
              </h1>
          <p className="text-text-secondary">
            {currentStep === 1 
              ? 'Enter your personal information to get started'
              : 'Complete the Prakriti assessment to determine your Ayurvedic constitution'}
              </p>
            </div>

        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-center space-x-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep > step.id 
                    ? 'bg-primary text-white' 
                    : currentStep === step.id 
                    ? 'bg-primary text-white ring-2 ring-primary ring-offset-2' 
                    : 'bg-muted text-text-secondary'
                }`}>
                  {currentStep > step.id ? (
                    <Icon name="Check" size={16} color="white" />
                  ) : (
                    step.id
                  )}
          </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= step.id ? 'text-text-primary' : 'text-text-secondary'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 ? (
          <PersonalInfoForm
            formData={formData}
            onFormDataChange={setFormData}
            errors={errors}
            onNext={handlePersonalInfoNext}
          />
        ) : (
          <PrakritiAssessment
            questions={assessmentQuestions}
            answers={answers}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleQuestionNext}
            onPrevious={handleQuestionPrevious}
            isFirst={currentQuestionIndex === 0}
            isLast={currentQuestionIndex === assessmentQuestions.length - 1}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={assessmentQuestions.length}
          />
        )}
      </main>
    </div>
  );
};

export default PatientProfileBuilder;
