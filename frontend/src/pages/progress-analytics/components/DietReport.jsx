import React from 'react';
import Icon from '../../../components/AppIcon';
import { useSession } from '../../../contexts/AuthContext';

const DietReport = ({ patientData, dietPlan, metrics }) => {
  const { data } = useSession();
  const user = data?.user || data?.session?.user;

  // Exchange List Data
  const exchangeList = [
    { foodGroup: 'Cereals and millets', gmPortion: '30 gm/portion', householdMeasure: '3 Tbsp', energy: '100 Kcal', proteins: '3g', cho: '20g', fat: '0.8g' },
    { foodGroup: 'Pulses/Legumes/Soya', gmPortion: '30 gm/portion', householdMeasure: '3 Tbsp', energy: '100 Kcal', proteins: '6g', cho: '15g', fat: '0.7g' },
    { foodGroup: 'Egg / Paneer / non-veg', gmPortion: '50 gm/portion', householdMeasure: '1/4-5 cubes / 2 pieces', energy: '100 Kcal', proteins: '9g', cho: '0g', fat: '7g' },
    { foodGroup: 'Milk double toned (<2% fat)', gmPortion: '100 gm/portion', householdMeasure: '½ Cup', energy: '45 Kcal', proteins: '3g', cho: '5g', fat: '1.5g' },
    { foodGroup: 'Roots and tubers (Potato/ Yam/ sweet potato/ Carrot/ beet root)', gmPortion: '100 gm/portion', householdMeasure: '1 Cup', energy: '80 Kcal', proteins: '1.3g', cho: '18g', fat: '-' },
    { foodGroup: 'Green leafy vegetables and Seasonal vegetables', gmPortion: '100 gm/portion', householdMeasure: '1 Cup', energy: '37 Kcal', proteins: '2.65g', cho: '1g', fat: '0.3g' },
    { foodGroup: 'Fruits', gmPortion: '100 gm/portion', householdMeasure: '1 Portion', energy: '40 Kcal', proteins: '-', cho: '10g', fat: '-' },
    { foodGroup: 'Nuts', gmPortion: '15 gm/portion', householdMeasure: '10-12 almonds/ 5-6 walnuts', energy: '85 Kcal', proteins: '3g', cho: '2g', fat: '7g' },
    { foodGroup: 'Seeds', gmPortion: '10 gm/portion', householdMeasure: '2 Tsp', energy: '45 Kcal', proteins: '1.7g', cho: '2.6g', fat: '3.3g' },
    { foodGroup: 'Oil/Fat', gmPortion: '5 gm/portion', householdMeasure: '1 Tsp', energy: '45 Kcal', proteins: '-', cho: '-', fat: '5g' },
    { foodGroup: 'Sugar', gmPortion: '5 gm/portion', householdMeasure: '1 Tsp', energy: '20 Kcal', proteins: '-', cho: '5g', fat: '-' }
  ];

  // Daily Allowances Data
  const dailyAllowances = [
    { foodGroup: 'Cereals (whole wheat flour / Brown rice/ wheat porridge/wheat bread/Steel cut oats/Ragi/wheat flakes/ quinoa/barley/ millets)', exchanges: 6, amount: '180 gm', householdMeasure: '5-6 chapati' },
    { foodGroup: 'Pulses/ Legumes/ Soya (Red beans, white beans, chickpeas, black chana, lentils)', exchanges: 3, amount: '90 gm', householdMeasure: '3 katorie' },
    { foodGroup: 'Milk/Curd (double toned)', exchanges: 4, amount: '400', householdMeasure: '2.5 cups' },
    { foodGroup: 'Egg white/Paneer/Non veg', exchanges: 1, amount: '50', householdMeasure: '2/4-5 pcs/1-2 small pcs' },
    { foodGroup: 'Roots and tubers', exchanges: 1, amount: '100', householdMeasure: '1 servings' },
    { foodGroup: 'Green leafy and Seasonal vegetables', exchanges: 5, amount: '500', householdMeasure: '4-5 servings' },
    { foodGroup: 'Fruits (apple/pear/orange/ sweet lime/Peach/cherry/ strawberry/kiwi/ pineapple/grapes/papaya)', exchanges: 2, amount: '100', householdMeasure: '1 Large/12-20 pcs' },
    { foodGroup: 'Nuts', exchanges: 1, amount: '15', householdMeasure: '10-12 almonds/ 5-6 walnuts' },
    { foodGroup: 'Seeds (Flax seeds/ Chia seeds)', exchanges: 1, amount: '10', householdMeasure: '2 tsp' },
    { foodGroup: 'Oil/Fat', exchanges: 3, amount: '15', householdMeasure: '3 tsp' },
    { foodGroup: 'Sugar/jaggery/honey', exchanges: 2, amount: '10', householdMeasure: '2 tsp' }
  ];

  // Food To Avoid
  const foodsToAvoid = [
    'Full Cream Milk & its products.',
    'Consume less fat, especially saturated fat (found in fatty meats, poultry skin, butter, ghee, whole milk, ice cream, cheese, palm oil, coconut oil, margarine, and vanaspati).',
    'Foods high in cholesterol (organ Meats like liver, kidney, brain, egg yolk, fatty Meat, Bacon, Ham, poultry skin, cheese).',
    'Pickles and Chutneys in oil and salt.',
    'Fried food like Poori, Pakora, Parantha, Samosa, Patties, Burger, Pizza.',
    'Excess of sugar and sweet products like Jam, Jelly, Murabas, and Canned Fruits.',
    'Restrict Cakes, Pastries, Rice puddings, and Chocolates.',
    'Soft drinks like Campa Cola, Limca, Squashes, Syrups, and Juices.',
    'All tinned, canned, and preserved food products including fish, veg soups.',
    'Alcoholic drinks and aerated drinks.'
  ];

  // Get patient info
  const patientName = patientData?.fullName || user?.name || 'Patient';
  const patientAge = patientData?.age || user?.age || '';
  const patientGender = patientData?.gender || user?.gender || '';
  const patientId = patientData?.id || user?.id || 'N/A';
  
  // Get diet plan info
  const totalCalories = dietPlan?.totalCalories || metrics?.find(m => m.label === 'Daily Calories')?.value || '1800';
  const proteinTarget = dietPlan?.proteinTarget || '75';
  const carbTarget = dietPlan?.carbTarget || '240';

  // Get Ayurvedic properties from patient data or localStorage
  const getPatientPrakriti = () => {
    try {
      const savedConstitution = localStorage.getItem('patient_constitution');
      if (savedConstitution) {
        const constitution = JSON.parse(savedConstitution);
        return {
          prakriti: constitution?.constitution || constitution?.prakriti || 'Not Assessed',
          vataState: patientData?.vataState || constitution?.scores?.vata || 0,
          pittaState: patientData?.pittaState || constitution?.scores?.pitta || 0,
          kaphaState: patientData?.kaphaState || constitution?.scores?.kapha || 0
        };
      }
    } catch (error) {
      console.error('Error loading prakriti:', error);
    }
    return {
      prakriti: patientData?.prakriti || 'Not Assessed',
      vataState: patientData?.vataState || 0,
      pittaState: patientData?.pittaState || 0,
      kaphaState: patientData?.kaphaState || 0
    };
  };

  const prakritiData = getPatientPrakriti();

  // Ayurvedic Properties for Diet Plan
  // These would typically come from the diet plan analysis
  const ayurvedicProperties = {
    rasa: {
      sweet: { present: true, description: 'Madhura - Nourishing, grounding, promotes strength' },
      sour: { present: true, description: 'Amla - Stimulates digestion, energizing' },
      salty: { present: true, description: 'Lavana - Enhances taste, aids digestion' },
      pungent: { present: false, description: 'Katu - Heating, stimulates metabolism' },
      bitter: { present: true, description: 'Tikta - Detoxifying, cooling, light' },
      astringent: { present: true, description: 'Kashaya - Drying, cooling, binding' }
    },
    virya: {
      type: 'neutral', // heating, cooling, or neutral
      description: 'Balanced potency suitable for all doshas'
    },
    vipaka: {
      type: 'sweet', // sweet, sour, or pungent
      description: 'Post-digestive effect is sweet, promoting nourishment'
    },
    guna: {
      heavy: false,
      light: true,
      oily: false,
      dry: true,
      hot: false,
      cold: false,
      smooth: true,
      rough: false,
      dense: false,
      liquid: true,
      soft: true,
      hard: false,
      stable: true,
      mobile: false,
      gross: false,
      subtle: true,
      clear: true,
      sticky: false
    },
    doshaEffect: {
      vata: 'Balancing',
      pitta: 'Balancing',
      kapha: 'Balancing'
    },
    prabhava: 'Rasayana - Promotes longevity and vitality, supports overall wellness'
  };

  // Meal plan structure (mock data - should come from actual diet plan)
  const mealPlan = {
    bedTea: ['1 cup Tea + 2Marie/Oats Biscuit'],
    breakfast: [
      'Whole wheat porridge (daliya) /Oats /Ragi/Jowar/Bajra-1 Cup',
      'Or Chapati-1 with Seasonal vegetable',
      'Or Dal chela/Vegetable Besan chela-1',
      'Egg white-2/Egg-1/Paneer- 50 gms',
      'Milk (low fat) -1 cup(150ml)+ Seeds-2 tsp (10 gms)'
    ],
    midMorning: ['Fruit only (200g) + Nuts-15 gms'],
    lunch: [
      'Green salad-100 gms',
      'Chapatti/Roti- 2(medium sized) Or Brown or Parboiled Rice-1 katorie',
      'Pulse/lentils/legume (e.g. Rajma/chole/lobiaetc)-1 Cup',
      'Or Soyabean / Non Veg - 1 serving (50gms)',
      'Seasonal veg- 1.0 katorie',
      'Curd-100 gm (1 cup)'
    ],
    tea: ['1 cup of tea + Roasted chana /Fresh lime water + steamed sprout salad'],
    dinner: [
      'Green salad-100 gms',
      'Chapatti/Roti- 2 (medium sized) Or Brown or Parboiled Rice-1 katorie',
      'Pulse/lentils/legume (e.g. Rajma/chole/lobiaetc)-1 Cup',
      'Or Soyabean / Non Veg - 1 serving (50gms)',
      'Seasonal veg- 1.0 katorie'
    ],
    bedTime: ['Milk-150 ml']
  };

  return (
    <div className="space-y-8 print:space-y-6 bg-background">
      <style>{`
        @media print {
          body { 
            background: white !important; 
            color: #000 !important;
          }
          * {
            color: #000 !important;
            background: white !important;
          }
          .no-print { display: none !important; }
          .print-bg-white { background: white !important; }
          .print-border-0 { border: none !important; }
          .print-p-6 { padding: 1.5rem !important; }
          .print-mb-4 { margin-bottom: 1rem !important; }
          .print-mt-6 { margin-top: 1.5rem !important; }
          .print-space-y-6 > * + * { margin-top: 1.5rem !important; }
          .print-shadow-none { box-shadow: none !important; }
          .text-text-primary,
          .text-text-secondary,
          .text-gray-900,
          .text-gray-700,
          .text-gray-600 {
            color: #000 !important;
          }
          .bg-surface,
          .bg-muted,
          .bg-background {
            background: white !important;
          }
          .border-border,
          .border-gray-300,
          .border-gray-400 {
            border-color: #000 !important;
          }
          table {
            border-collapse: collapse !important;
          }
          table th,
          table td {
            color: #000 !important;
            background: white !important;
            border-color: #000 !important;
          }
          table tr:nth-child(even) {
            background: #f5f5f5 !important;
          }
        }
      `}</style>
      {/* Document Header */}
      <div className="bg-surface rounded-lg border-2 border-border print-bg-white print-border-0 p-8 print-p-6 shadow-lg print-shadow-none">
        <div className="flex items-center justify-between mb-6 print:mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-brand-gradient rounded-lg flex items-center justify-center">
              <Icon name="Leaf" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Ayutra</h1>
              <p className="text-sm text-text-secondary">Department of Nutrition and Dietetics</p>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-6 print-mb-4 border-b-2 border-border pb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-text-primary">Patient:</span> <span className="text-text-secondary">{patientName}</span>
            </div>
            <div>
              <span className="font-semibold text-text-primary">ID:</span> <span className="text-text-secondary">{patientId}</span>
            </div>
            <div>
              <span className="font-semibold text-text-primary">Sex:</span> <span className="text-text-secondary">{patientGender?.charAt(0)?.toUpperCase() || 'M'}</span>
              {patientAge && <span className="ml-2 text-text-secondary"><span className="font-semibold text-text-primary">Age:</span> {patientAge}Y</span>}
            </div>
            <div>
              <span className="font-semibold text-text-primary">Date:</span> <span className="text-text-secondary">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Diet Recommendation Summary */}
        <div className="mb-6 print-mb-4 bg-muted p-4 rounded border border-border">
          <h2 className="text-lg font-bold text-text-primary mb-2">DIET RECOMMENDATION</h2>
          <p className="text-sm text-text-secondary">
            {totalCalories} kcal, {proteinTarget} gm Protein, and {carbTarget} gm Carbohydrate diet
          </p>
        </div>

        {/* When Hungry Snack On */}
        <div className="mb-6 print-mb-4">
          <h3 className="text-base font-bold text-text-primary mb-2">When hungry snack on</h3>
          <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
            <li>Green Salads without oil dressings (Raw or Boiled Vegetables).</li>
            <li>Fresh Lemon water without sugar, Vegetable Soup without Cream/ corn/ starch.</li>
          </ul>
        </div>

        {/* Healthy Tips */}
        <div className="mb-6 print-mb-4">
          <h3 className="text-base font-bold text-text-primary mb-2">Healthy Tips</h3>
          <ul className="list-disc list-inside text-sm text-text-secondary space-y-2">
            <li>Use whole grain cereals, whole grams and pulses, whole wheat porridge, whole wheat bread, millets and oats etc. to incorporate fiber in your diet.</li>
            <li>Supplement wheat with whole chana/ragi/ bajra/ soya to increase fiber content.</li>
            <li>Eat right combination of oils to get the right balance of omega 3 and omega 6 fatty acid- choice of oil should be groundnut/sesame/rice bran+ mustard/canola/soyabean/olive oil. Keep changing the oils.</li>
            <li>Eat healthy seeds like fenugreek, mustard, flax, sesame seeds and nuts like almonds, walnuts and fatty fish such as salmon, herring, mackerel, anchovies, sardines.</li>
            <li>Avoid table salt and restrict processed and preserved food containing sodium.</li>
            <li>Eat at regular intervals to avoid hunger spikes and food cravings.</li>
            <li>Regular walk and exercise for 30-45 minutes every day. Step up gradually and be consistent.</li>
          </ul>
        </div>

        {/* Exchange List Table */}
        <div className="mb-6 print-mb-4 overflow-x-auto">
          <h3 className="text-base font-bold text-text-primary mb-3">EXCHANGE LIST</h3>
          <table className="w-full border-collapse border border-border text-xs">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-2 py-2 text-left font-semibold text-text-primary">Food group</th>
                <th className="border border-border px-2 py-2 text-center font-semibold text-text-primary">gm/ portion</th>
                <th className="border border-border px-2 py-2 text-left font-semibold text-text-primary">Household measure (raw food)</th>
                <th className="border border-border px-2 py-2 text-center font-semibold text-text-primary">Energy (Kcal)</th>
                <th className="border border-border px-2 py-2 text-center font-semibold text-text-primary">Proteins (g)</th>
                <th className="border border-border px-2 py-2 text-center font-semibold text-text-primary">CHO (g)</th>
                <th className="border border-border px-2 py-2 text-center font-semibold text-text-primary">Fat (g)</th>
              </tr>
            </thead>
            <tbody>
              {exchangeList.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-surface' : 'bg-muted/50'}>
                  <td className="border border-border px-2 py-2 text-text-secondary">{item.foodGroup}</td>
                  <td className="border border-border px-2 py-2 text-center text-text-secondary">{item.gmPortion}</td>
                  <td className="border border-border px-2 py-2 text-text-secondary">{item.householdMeasure}</td>
                  <td className="border border-border px-2 py-2 text-center text-text-secondary">{item.energy}</td>
                  <td className="border border-border px-2 py-2 text-center text-text-secondary">{item.proteins}</td>
                  <td className="border border-border px-2 py-2 text-center text-text-secondary">{item.cho}</td>
                  <td className="border border-border px-2 py-2 text-center text-text-secondary">{item.fat}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-text-secondary mt-2">*Tbsp: Tablespoon ; Tsp: Teaspoon</p>
        </div>

        {/* Daily Allowances Table */}
        <div className="mb-6 print-mb-4 overflow-x-auto">
          <h3 className="text-base font-bold text-text-primary mb-3">Daily Allowances of food Group-</h3>
          <table className="w-full border-collapse border border-border text-xs">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-2 py-2 text-left font-semibold text-text-primary">Food group</th>
                <th className="border border-border px-2 py-2 text-center font-semibold text-text-primary">Exchanges</th>
                <th className="border border-border px-2 py-2 text-center font-semibold text-text-primary">Amount (gm/ml)</th>
                <th className="border border-border px-2 py-2 text-left font-semibold text-text-primary">Household measure</th>
              </tr>
            </thead>
            <tbody>
              {dailyAllowances.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-surface' : 'bg-muted/50'}>
                  <td className="border border-border px-2 py-2 text-text-secondary">{item.foodGroup}</td>
                  <td className="border border-border px-2 py-2 text-center text-text-secondary">{item.exchanges}</td>
                  <td className="border border-border px-2 py-2 text-center text-text-secondary">{item.amount}</td>
                  <td className="border border-border px-2 py-2 text-text-secondary">{item.householdMeasure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Food To Avoid */}
        <div className="mb-6 print-mb-4">
          <h3 className="text-base font-bold text-text-primary mb-2 flex items-center">
            <Icon name="X" size={16} className="text-error mr-2" />
            Food To Avoid
          </h3>
          <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
            {foodsToAvoid.map((food, index) => (
              <li key={index}>{food}</li>
            ))}
          </ul>
        </div>

        {/* Ayurvedic Properties Section */}
        <div className="mb-6 print-mb-4">
          <h3 className="text-base font-bold text-text-primary mb-4 flex items-center">
            <Icon name="Leaf" size={16} className="text-success mr-2" />
            Ayurvedic Properties & Constitution Analysis
          </h3>

          {/* Patient Prakriti */}
          <div className="mb-4 p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-text-primary mb-2">Patient Constitution (Prakriti)</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-text-primary">Primary Constitution:</span>
                <span className="ml-2 text-text-secondary">{prakritiData.prakriti}</span>
              </div>
              <div>
                <span className="font-medium text-text-primary">Dosha Balance:</span>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Vata:</span>
                    <span className="text-text-primary font-medium">{prakritiData.vataState || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Pitta:</span>
                    <span className="text-text-primary font-medium">{prakritiData.pittaState || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Kapha:</span>
                    <span className="text-text-primary font-medium">{prakritiData.kaphaState || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rasa (Six Tastes) */}
          <div className="mb-4">
            <h4 className="font-semibold text-text-primary mb-3">Rasa (Six Tastes)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(ayurvedicProperties.rasa).map(([taste, data]) => {
                const sanskritNames = {
                  sweet: 'Madhura',
                  sour: 'Amla',
                  salty: 'Lavana',
                  pungent: 'Katu',
                  bitter: 'Tikta',
                  astringent: 'Kashaya'
                };
                return (
                  <div key={taste} className={`p-3 rounded-lg border ${data.present ? 'border-success bg-success/5' : 'border-border bg-surface'}`}>
                    <div className="font-medium text-text-primary capitalize mb-1">
                      {taste} {data.present && <span className="text-success">✓</span>}
                    </div>
                    <div className="text-xs text-text-secondary mb-1">{sanskritNames[taste]}</div>
                    <div className="text-xs text-text-secondary">{data.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Virya (Potency) */}
          <div className="mb-4">
            <h4 className="font-semibold text-text-primary mb-3">Virya (Potency)</h4>
            <div className="p-4 bg-muted rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={ayurvedicProperties.virya.type === 'heating' ? 'Flame' : ayurvedicProperties.virya.type === 'cooling' ? 'Snowflake' : 'Circle'} 
                  size={20} 
                  className={ayurvedicProperties.virya.type === 'heating' ? 'text-error' : ayurvedicProperties.virya.type === 'cooling' ? 'text-primary' : 'text-text-secondary'} 
                />
                <div>
                  <div className="font-medium text-text-primary capitalize mb-1">
                    {ayurvedicProperties.virya.type === 'heating' ? 'Ushna (Heating)' : 
                     ayurvedicProperties.virya.type === 'cooling' ? 'Shita (Cooling)' : 
                     'Sama (Neutral)'}
                  </div>
                  <div className="text-sm text-text-secondary">{ayurvedicProperties.virya.description}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vipaka (Post-digestive Effect) */}
          <div className="mb-4">
            <h4 className="font-semibold text-text-primary mb-3">Vipaka (Post-digestive Effect)</h4>
            <div className="p-4 bg-muted rounded-lg border border-border">
              <div className="font-medium text-text-primary capitalize mb-1">
                {ayurvedicProperties.vipaka.type === 'sweet' ? 'Madhura Vipaka' : 
                 ayurvedicProperties.vipaka.type === 'sour' ? 'Amla Vipaka' : 
                 'Katu Vipaka'}
              </div>
              <div className="text-sm text-text-secondary">{ayurvedicProperties.vipaka.description}</div>
            </div>
          </div>

          {/* Guna (Qualities) */}
          <div className="mb-4">
            <h4 className="font-semibold text-text-primary mb-3">Guna (Qualities)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(ayurvedicProperties.guna).map(([quality, present]) => (
                <div key={quality} className={`p-2 rounded border text-center text-xs ${present ? 'border-success bg-success/5 text-success' : 'border-border bg-surface text-text-secondary'}`}>
                  <div className="font-medium capitalize">{quality}</div>
                  {present && <span className="text-success">✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Dosha Effects */}
          <div className="mb-4">
            <h4 className="font-semibold text-text-primary mb-3">Dosha Effects</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-border bg-surface text-center">
                <div className="font-medium text-text-primary mb-1">Vata</div>
                <div className="text-sm text-text-secondary capitalize">{ayurvedicProperties.doshaEffect.vata}</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface text-center">
                <div className="font-medium text-text-primary mb-1">Pitta</div>
                <div className="text-sm text-text-secondary capitalize">{ayurvedicProperties.doshaEffect.pitta}</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface text-center">
                <div className="font-medium text-text-primary mb-1">Kapha</div>
                <div className="text-sm text-text-secondary capitalize">{ayurvedicProperties.doshaEffect.kapha}</div>
              </div>
            </div>
          </div>

          {/* Prabhava (Special Effect) */}
          <div className="mb-4">
            <h4 className="font-semibold text-text-primary mb-3">Prabhava (Special Effect)</h4>
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <p className="text-sm text-text-primary">{ayurvedicProperties.prabhava}</p>
            </div>
          </div>
        </div>

        {/* Meal Plan */}
        <div className="mb-6 print-mb-4">
          <h3 className="text-base font-bold text-text-primary mb-3">Daily Meal Plan</h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-text-primary mb-1">Bed Tea:</h4>
              <ul className="list-disc list-inside text-text-secondary ml-4">
                {mealPlan.bedTea.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-1">Breakfast (8.00 am- 9.00 am):</h4>
              <ul className="list-disc list-inside text-text-secondary ml-4">
                {mealPlan.breakfast.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-1">Mid-Morning:</h4>
              <ul className="list-disc list-inside text-text-secondary ml-4">
                {mealPlan.midMorning.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-1">Lunch (1.00 pm-2.00 pm):</h4>
              <ul className="list-disc list-inside text-text-secondary ml-4">
                {mealPlan.lunch.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-1">Tea (4.00-5.00 pm):</h4>
              <ul className="list-disc list-inside text-text-secondary ml-4">
                {mealPlan.tea.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-1">Dinner (7.00 pm-8.00 pm):</h4>
              <ul className="list-disc list-inside text-text-secondary ml-4">
                {mealPlan.dinner.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-1">Bed time:</h4>
              <ul className="list-disc list-inside text-text-secondary ml-4">
                {mealPlan.bedTime.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 print-mt-6 pt-4 border-t border-border flex justify-between text-xs text-text-secondary">
          <div>Generated: {new Date().toLocaleDateString()}</div>
          <div>Ayutra Nutrition & Dietetics</div>
        </div>
      </div>
    </div>
  );
};

export default DietReport;
