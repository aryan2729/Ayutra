import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import PrakritiProperties from './PrakritiProperties';

const ProblemCard = ({ title, description, icon, color, properties }) => {
  const ref = useRef(null);
  const cardRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);

  // Handle hover to expand
  const handleMouseEnter = () => {
    if (!isExpanded) {
      setIsHovered(true);
      hoverTimeoutRef.current = setTimeout(() => {
        setIsExpanded(true);
      }, 500); // Delay before expanding
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Don't collapse on mouse leave, only on click outside
  };

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target) && isExpanded) {
        setIsExpanded(false);
        setIsHovered(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (isExpanded) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isExpanded]);

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        animate={isInView ? { opacity: 1, y: 0, rotate: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={!isExpanded ? { scale: 1.05, y: -8, rotate: 2, zIndex: 10 } : {}}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => !isExpanded && setIsExpanded(true)}
        className="bg-card rounded-lg p-6 border border-border shadow-organic hover:shadow-organic-hover transition-all duration-300 relative overflow-hidden cursor-pointer"
      >
        {/* Layered background effect */}
        <div className="absolute -left-2 -bottom-2 w-full h-full bg-green-100 dark:bg-green-900/20 rounded-lg -z-10 opacity-50"></div>
        <div className="absolute -left-1 -bottom-1 w-full h-full bg-green-200 dark:bg-green-800/30 rounded-lg -z-10 opacity-30"></div>
        
        <div className="relative z-10">
          <div className={`w-12 h-12 rounded-full bg-${color.replace('text-', '')}/10 flex items-center justify-center mb-4`}>
            <Icon name={icon} size={24} className={color} />
          </div>
          
          <h3 className="font-heading font-semibold text-xl text-text-primary mb-2">
            {title}
          </h3>
          <p className="text-text-secondary mb-4">
            {description}
          </p>
          
          {/* Prakriti Properties */}
          {properties && (
            <div className="mb-4 bg-[#2F4F4F] rounded-lg p-4 min-h-[200px]">
              <PrakritiProperties properties={properties} isInView={isInView} />
            </div>
          )}
        </div>
      </motion.div>

      {/* Expanded Modal View */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsExpanded(false)}
            >
              {/* Expanded Card */}
              <motion.div
                ref={cardRef}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full bg-${color.replace('text-', '')}/10 flex items-center justify-center`}>
                      <Icon name={icon} size={32} className={color} />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">
                        {title}
                      </h2>
                      <p className="text-text-secondary mt-1">
                        {description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="w-10 h-10 rounded-full bg-muted hover:bg-border flex items-center justify-center transition-colors"
                  >
                    <Icon name="X" size={20} className="text-text-secondary" />
                  </button>
                </div>

                {/* Expanded Prakriti Properties */}
                {properties && (
                  <div className="mb-6 bg-[#2F4F4F] rounded-lg p-6">
                    <PrakritiProperties properties={properties} isInView={true} />
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProblemCard;
