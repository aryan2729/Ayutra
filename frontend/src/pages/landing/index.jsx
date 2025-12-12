import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProblemCard from './components/ProblemCard';
import CircularProgress from './components/CircularProgress';
import PrakritiProperties from './components/PrakritiProperties';

const Landing = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  // Add smooth scrolling behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Smooth scroll animations
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Trust badges data
  const trustBadges = [
    { icon: 'Star', text: 'AI-Powered Recommendations' },
    { icon: 'Leaf', text: 'Ayurvedic Wisdom' },
    { icon: 'Shield', text: 'Science-Backed Plans' }
  ];

  // Problem cards data with Prakriti properties
  const problems = [
    {
      title: 'Rasa (Six Tastes)',
      description: 'Understanding the six tastes and their effects on your dosha balance.',
      icon: 'Leaf',
      color: 'text-success',
      properties: {
        rasa: {
          sweet: true,
          sour: true,
          salty: true,
          pungent: false,
          bitter: true,
          astringent: true
        },
        virya: 'neutral',
        vipaka: 'sweet',
        guna: {
          heavy: false,
          light: true,
          oily: false,
          dry: true,
          smooth: true,
          stable: true
        },
        doshaEffect: {
          vata: 'Balancing',
          pitta: 'Balancing',
          kapha: 'Balancing'
        }
      }
    },
    {
      title: 'Virya & Vipaka',
      description: 'Potency and post-digestive effects that determine food\'s impact on your constitution.',
      icon: 'Flame',
      color: 'text-warning',
      properties: {
        rasa: {
          sweet: true,
          sour: false,
          salty: false,
          pungent: true,
          bitter: false,
          astringent: false
        },
        virya: 'heating',
        vipaka: 'pungent',
        guna: {
          hot: true,
          light: true,
          dry: true,
          rough: true,
          mobile: true,
          subtle: true
        },
        doshaEffect: {
          vata: 'Aggravating',
          pitta: 'Aggravating',
          kapha: 'Balancing'
        }
      }
    },
    {
      title: 'Guna (Qualities)',
      description: 'The inherent qualities of foods that affect digestion and dosha balance.',
      icon: 'Star',
      color: 'text-primary',
      properties: {
        rasa: {
          sweet: true,
          sour: false,
          salty: false,
          pungent: false,
          bitter: true,
          astringent: true
        },
        virya: 'cooling',
        vipaka: 'sweet',
        guna: {
          heavy: true,
          light: false,
          oily: true,
          dry: false,
          cold: true,
          smooth: true,
          dense: true,
          stable: true,
          gross: true,
          clear: false
        },
        doshaEffect: {
          vata: 'Balancing',
          pitta: 'Balancing',
          kapha: 'Aggravating'
        }
      }
    },
    {
      title: 'Dosha Effects',
      description: 'How foods influence Vata, Pitta, and Kapha doshas in your body.',
      icon: 'Activity',
      color: 'text-secondary',
      properties: {
        rasa: {
          sweet: true,
          sour: true,
          salty: true,
          pungent: true,
          bitter: true,
          astringent: true
        },
        virya: 'neutral',
        vipaka: 'sweet',
        guna: {
          heavy: false,
          light: true,
          oily: false,
          dry: false,
          hot: false,
          cold: false,
          smooth: true,
          stable: true
        },
        doshaEffect: {
          vata: 'Balancing',
          pitta: 'Balancing',
          kapha: 'Balancing'
        }
      }
    }
  ];

  // Benefits data
  const benefits = [
    { text: 'Personalized Plans', icon: 'User' },
    { text: 'Dosha Balance', icon: 'Activity' },
    { text: 'AI-Powered', icon: 'Brain' },
    { text: 'Science-Backed', icon: 'Flask' }
  ];

  // Features data
  const features = [
    { text: 'Prakriti Assessment', icon: 'User' },
    { text: 'AI Diet Generator', icon: 'Brain' },
    { text: 'Progress Tracking', icon: 'TrendingUp' },
    { text: 'Food Explorer', icon: 'Search' },
    { text: 'Remedies Guide', icon: 'Leaf' },
    { text: 'Compliance Monitor', icon: 'CheckCircle' },
    { text: 'Health Analytics', icon: 'BarChart' },
    { text: 'Expert Support', icon: 'Users' }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Priya Sharma',
      text: 'Discovering my Vata-Pitta constitution changed everything. The personalized diet plan has improved my digestion and energy levels significantly!',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      text: 'The AI-powered recommendations are spot-on. My dosha balance has improved, and I feel more aligned with my body\'s natural needs.',
      rating: 5
    },
    {
      name: 'Anita Patel',
      text: 'As a practitioner, Ayutra has revolutionized how I create diet plans for my patients. The Prakriti assessment is incredibly accurate.',
      rating: 5
    },
    {
      name: 'Dr. Vikram Singh',
      text: 'Bridging Ayurvedic wisdom with modern science - this is exactly what healthcare needs. The compliance tracking features are excellent.',
      rating: 5
    },
    {
      name: 'Meera Desai',
      text: 'The food explorer and remedies section have been invaluable. I finally understand which foods work best for my Kapha constitution.',
      rating: 5
    },
    {
      name: 'Arjun Mehta',
      text: 'My health journey has transformed since using Ayutra. The progress analytics help me stay motivated and track my improvements.',
      rating: 5
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: 'What is Prakriti and how is it determined?',
      answer: 'Prakriti is your unique Ayurvedic constitution, determined by the balance of three doshas: Vata, Pitta, and Kapha. Our comprehensive assessment analyzes your physical, mental, and physiological characteristics to identify your constitution type.'
    },
    {
      question: 'How does the AI diet generator work?',
      answer: 'Our AI-powered system combines your Prakriti assessment, health goals, dietary preferences, and medical conditions to generate personalized meal plans. It uses machine learning models trained on Ayurvedic principles and nutritional science.'
    },
    {
      question: 'Can practitioners use this platform?',
      answer: 'Yes! Ayutra is designed for both patients and practitioners. Practitioners can create profiles for their patients, generate diet plans, track progress, and manage patient records all in one platform.'
    },
    {
      question: 'How accurate is the Prakriti assessment?',
      answer: 'Our assessment is based on traditional Ayurvedic principles combined with modern psychological and physiological indicators. It includes detailed questions about body frame, skin, hair, digestion, and more to ensure accuracy.'
    },
    {
      question: 'Can I track my progress over time?',
      answer: 'Absolutely! The Progress Analytics section provides comprehensive tracking of compliance, health metrics, dosha balance, and goal achievement. You can generate detailed reports and see your health journey visualized.'
    },
    {
      question: 'What if I have specific health conditions?',
      answer: 'The system automatically accounts for conditions like diabetes, celiac disease, CKD, and acid reflux. It filters out unsafe foods and provides appropriate warnings and modifications to your diet plan.'
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-brand-gradient rounded-full flex items-center justify-center">
                <Icon name="Leaf" size={20} color="white" />
              </div>
              <span className="font-heading font-bold text-xl text-text-primary">Ayutra</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#benefits" 
                className="text-text-secondary hover:text-primary transition-colors font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Benefits
              </a>
              <a 
                href="#formula" 
                className="text-text-secondary hover:text-primary transition-colors font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('formula')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Formula
              </a>
              <a 
                href="#reviews" 
                className="text-text-secondary hover:text-primary transition-colors font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Reviews
              </a>
              <a 
                href="#faq" 
                className="text-text-secondary hover:text-primary transition-colors font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                FAQ
              </a>
            </div>
            <Button
              onClick={() => navigate('/login')}
              variant="default"
              className="bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Ayurvedic Background Pattern Overlay */}
        <div className="absolute inset-0 z-[1] opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 Q60 30 50 50 Q40 30 50 10' fill='%234a7c2a' opacity='0.3'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat'
            }}
          />
        </div>
          {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Primary Ayurvedic Background */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.85, 1, 0.85],
              x: [0, -20, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Secondary Ayurvedic texture overlay */}
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'multiply'
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          {/* Tertiary overlay for depth */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'screen'
            }}
            animate={{
              opacity: [0.15, 0.25, 0.15],
              x: [0, 15, 0],
              y: [0, 10, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
          
          {/* Animated Ayurvedic floating particles */}
          {[...Array(40)].map((_, i) => {
            const size = Math.random() * 6 + 3;
            const delay = Math.random() * 10;
            return (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  background: `radial-gradient(circle, rgba(${Math.random() * 50 + 100}, ${Math.random() * 100 + 150}, ${Math.random() * 50 + 100}, 0.8), rgba(${Math.random() * 50 + 100}, ${Math.random() * 100 + 150}, ${Math.random() * 50 + 100}, 0.2))`,
                  boxShadow: `0 0 ${size * 2}px rgba(100, 200, 100, 0.6)`
                }}
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                  y: (typeof window !== 'undefined' ? window.innerHeight : 1080) + 100,
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  y: -100,
                  opacity: [0, 1, 0.9, 0],
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                  scale: [0, 1, 1.3, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: Math.random() * 18 + 18,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut"
                }}
              />
            );
          })}
          
          {/* Floating Ayurvedic leaf particles */}
          {[...Array(20)].map((_, i) => {
            const size = Math.random() * 25 + 20;
            return (
              <motion.div
                key={`leaf-${i}`}
                className="absolute pointer-events-none"
                style={{
                  fontSize: `${size}px`,
                  filter: `drop-shadow(0 0 ${size / 2}px rgba(100, 200, 100, 0.5))`
                }}
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                  y: (typeof window !== 'undefined' ? window.innerHeight : 1080) + 50,
                  opacity: 0,
                  rotate: Math.random() * 360
                }}
                animate={{
                  y: -50,
                  opacity: [0, 0.7, 0.5, 0],
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                  rotate: [0, Math.random() * 360, Math.random() * 720],
                  scale: [0.8, 1, 1.1, 0.8]
                }}
                transition={{
                  duration: Math.random() * 25 + 25,
                  repeat: Infinity,
                  delay: Math.random() * 12,
                  ease: "easeInOut"
                }}
              >
                🍃
              </motion.div>
            );
          })}
          
          {/* Floating herb/spice particles */}
          {[...Array(15)].map((_, i) => {
            const herbs = ['🌿', '🌱', '🍃', '🌾', '🌿'];
            return (
              <motion.div
                key={`herb-${i}`}
                className="absolute pointer-events-none"
                style={{
                  fontSize: `${Math.random() * 18 + 12}px`,
                  filter: `drop-shadow(0 0 4px rgba(150, 200, 150, 0.4))`
                }}
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                  y: (typeof window !== 'undefined' ? window.innerHeight : 1080) + 50,
                  opacity: 0,
                  rotate: Math.random() * 360
                }}
                animate={{
                  y: -50,
                  opacity: [0, 0.6, 0.4, 0],
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                  rotate: [0, Math.random() * 180, Math.random() * 360],
                  scale: [0.7, 1, 1.2, 0.7]
                }}
                transition={{
                  duration: Math.random() * 22 + 22,
                  repeat: Infinity,
                  delay: Math.random() * 15,
                  ease: "easeInOut"
                }}
              >
                {herbs[Math.floor(Math.random() * herbs.length)]}
              </motion.div>
            );
          })}
        </div>

        {/* Content */}
        <motion.div
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
          >
            Transform Your Health with{' '}
            <span className="text-green-400">Personalized Ayurvedic Diet Plans</span>
          </motion.h1>
          
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Discover your unique Ayurvedic constitution (Prakriti) and receive personalized diet plans powered by AI. 
            Bridge the gap between ancient Ayurvedic wisdom and modern science for optimal health and wellness.
          </motion.p>

          <motion.div
            variants={scaleIn}
            className="flex justify-center mb-12"
          >
            <Button
              onClick={() => navigate('/login')}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              iconName="ArrowRight"
              iconPosition="right"
            >
              Get Started
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center items-center gap-6 md:gap-8"
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center space-x-2 text-white"
              >
                <Icon name={badge.icon} size={20} className="text-green-400" />
                <span className="text-sm md:text-base">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Problem Section */}
      <section id="benefits" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-4"
            >
              Understanding Prakriti Properties
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-secondary max-w-3xl mx-auto"
            >
              Every food in Ayurveda has unique properties that affect your dosha balance. Understanding Rasa (taste), 
              Guna (qualities), Virya (potency), and Vipaka (post-digestive effect) helps create personalized diets 
              that restore harmony to your constitution.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem, index) => (
              <ProblemCard
                key={index}
                title={problem.title}
                description={problem.description}
                icon={problem.icon}
                color={problem.color}
                properties={problem.properties}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Ayurvedic Properties Overview Section */}
      <section className="py-20 bg-[#2F4F4F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading font-bold text-3xl md:text-4xl text-white mb-4"
            >
              Understanding Ayurvedic Properties
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-green-100 max-w-3xl mx-auto"
            >
              Every food in Ayurveda is characterized by its unique properties: Rasa (taste), Guna (qualities), 
              Virya (potency), and Vipaka (post-digestive effect). Understanding these helps create balanced diets.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Core Principles</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Icon name="Leaf" size={20} className="text-green-400 mt-1" />
                    <div>
                      <div className="font-medium text-white">Rasa (Six Tastes)</div>
                      <div className="text-sm text-green-100">Sweet, Sour, Salty, Pungent, Bitter, Astringent</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="Flame" size={20} className="text-orange-400 mt-1" />
                    <div>
                      <div className="font-medium text-white">Virya (Potency)</div>
                      <div className="text-sm text-green-100">Heating (Ushna), Cooling (Shita), or Neutral (Sama)</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="Activity" size={20} className="text-green-400 mt-1" />
                    <div>
                      <div className="font-medium text-white">Vipaka (Post-digestive)</div>
                      <div className="text-sm text-green-100">Sweet, Sour, or Pungent effect after digestion</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Guna (Qualities)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Heavy/Light', 'Oily/Dry', 'Hot/Cold', 'Smooth/Rough', 'Dense/Liquid', 'Soft/Hard', 'Stable/Mobile', 'Gross/Subtle', 'Clear/Sticky'].map((quality, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="px-3 py-2 bg-white/10 rounded border border-white/20 text-center"
                    >
                      <span className="text-sm text-green-200">{quality}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="formula" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-4"
            >
              Why <span className="text-green-500">Ayutra</span> Is the Right Choice For You
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-secondary max-w-3xl mx-auto mb-8"
            >
              Ayutra bridges ancient Ayurvedic wisdom with modern AI technology to provide personalized diet plans 
              that respect your unique constitution. Experience balanced doshas, improved digestion, and optimal health 
              through science-backed Ayurvedic principles.
            </motion.p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800 text-center"
              >
                <Icon name={benefit.icon} size={32} className="text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="font-medium text-text-primary">{benefit.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Features Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.1, rotate: 2 }}
                className="bg-card rounded-lg p-4 border border-border text-center hover:shadow-organic transition-all duration-300"
              >
                <Icon name={feature.icon} size={24} className="text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-text-primary">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits with Circular Progress */}
      <section className="py-20 bg-[#2F4F4F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading font-bold text-3xl md:text-4xl mb-4"
            >
              How Ayutra Gives You Better <span className="text-yellow-300">Health</span> and More <span className="text-yellow-300">Benefits</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-green-100 max-w-3xl mx-auto mb-8"
            >
              Ayutra combines AI-powered analysis with Ayurvedic principles to create personalized diet plans. 
              Our system understands your dosha balance, recommends foods that restore harmony, and tracks your progress 
              for optimal health outcomes.
            </motion.p>
            <motion.div variants={scaleIn} className="flex justify-center mb-12">
              <Button
                onClick={() => navigate('/login')}
                className="bg-green-400 hover:bg-green-500 text-green-900 font-semibold"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Get Started with Ayutra
              </Button>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { percentage: 85, label: 'Dosha Balance', icon: 'Activity' },
              { percentage: 90, label: 'Plan Compliance', icon: 'CheckCircle' },
              { percentage: 80, label: 'Health Improvement', icon: 'TrendingUp' },
              { percentage: 75, label: 'Patient Satisfaction', icon: 'Heart' }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <CircularProgress
                  percentage={benefit.percentage}
                  label={benefit.label}
                  color="#A0D995"
                  size={200}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {[
              { url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80', title: 'Ayurvedic Herbs' },
              { url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80', title: 'Healthy Meals' },
              { url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', title: 'Wellness Journey' },
              { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', title: 'Balanced Nutrition' },
              { url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80', title: 'Natural Ingredients' },
              { url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', title: 'Holistic Health' }
            ].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="relative overflow-hidden rounded-lg aspect-square group cursor-pointer"
              >
                <motion.img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-semibold">{image.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Section */}
      <section className="py-20 bg-gradient-to-b from-background to-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-organic overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div variants={fadeInUp}>
                <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  AI-Powered
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} name="Star" size={20} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-text-secondary">Trusted by 1000+ users</span>
                </div>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-4">
                  Personalized Ayurvedic Diet Plans
                </h2>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  Get AI-powered diet plans tailored to your unique Prakriti (constitution). Our system analyzes your 
                  dosha balance, health goals, and dietary preferences to create meal plans that restore harmony and 
                  promote optimal wellness. Based on 5000+ years of Ayurvedic wisdom, enhanced with modern science.
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-text-primary">Free</span>
                  <span className="text-xl text-text-secondary line-through">Premium Plans Available</span>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <Icon name="Check" size={16} className="text-green-500" />
                    <span>Comprehensive Prakriti Assessment</span>
                  </div>
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <Icon name="Check" size={16} className="text-green-500" />
                    <span>AI-Powered Diet Generation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <Icon name="Check" size={16} className="text-green-500" />
                    <span>Progress Tracking & Analytics</span>
                  </div>
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <Icon name="Check" size={16} className="text-green-500" />
                    <span>Food Explorer & Remedies Guide</span>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/login')}
                  size="lg"
                  className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white"
                  iconName="ArrowRight"
                  iconPosition="left"
                >
                  Start Your Health Journey
                </Button>
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-text-secondary">
                  <div className="flex items-center space-x-2">
                    <Icon name="Shield" size={16} className="text-green-500" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} className="text-green-500" />
                    <span>Expert Practitioner Support</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                variants={scaleIn}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="aspect-square rounded-lg overflow-hidden relative group"
                >
                  <motion.img
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80"
                    alt="Ayurvedic Wellness"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent" />
                  
                  {/* Floating elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
                  >
                    <Icon name="Leaf" size={32} className="text-green-600" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                    className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
                  >
                    <Icon name="Star" size={24} className="text-yellow-400" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-4"
            >
              Why People Love Ayutra
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-secondary max-w-3xl mx-auto"
            >
              Patients and practitioners worldwide are experiencing the power of personalized Ayurvedic nutrition.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-lg p-6 border border-border shadow-organic hover:shadow-organic-hover transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-text-secondary mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-text-primary">— {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-4"
            >
              Questions? We've Got Answers.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-secondary"
            >
              We've got answers to help you get started with Ayutra.
            </motion.p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-lg border border-border overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-text-primary">{faq.question}</span>
                  <Icon
                    name={expandedFaq === index ? "ChevronUp" : "ChevronDown"}
                    size={20}
                    className="text-text-secondary flex-shrink-0 ml-4"
                  />
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4">
                        <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading font-bold text-3xl md:text-4xl mb-6"
            >
              Transform Your Health with Personalized Ayurvedic Nutrition
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-green-100 mb-8 max-w-2xl mx-auto"
            >
              Experience the power of personalized diet plans based on your unique constitution. Bridge ancient 
              Ayurvedic wisdom with modern AI technology for optimal health and wellness.
            </motion.p>
            <motion.div variants={scaleIn}>
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Get Started with Ayutra
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Go to Top Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Icon name="ArrowUp" size={24} />
      </motion.button>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-brand-gradient rounded-full flex items-center justify-center">
                <Icon name="Leaf" size={20} color="white" />
              </div>
              <span className="font-heading font-bold text-xl text-text-primary">Ayutra</span>
            </div>
            <div className="flex items-center space-x-6 text-text-secondary">
              <a 
                href="#benefits" 
                className="hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Benefits
              </a>
              <a 
                href="#formula" 
                className="hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('formula')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Formula
              </a>
              <a 
                href="#reviews" 
                className="hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Reviews
              </a>
              <a 
                href="#faq" 
                className="hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                FAQ
              </a>
            </div>
            <p className="text-text-secondary text-sm mt-4 md:mt-0">
              © 2025 Ayutra. All rights reserved. Bridging Science and Ayurvedic Wisdom.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
