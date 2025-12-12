import React from 'react';
import Icon from '../../../components/AppIcon';
import { motion } from 'framer-motion';

const PrakritiProperties = ({ properties, isInView }) => {
  if (!properties) return null;

  const rasaNames = {
    sweet: 'Madhura',
    sour: 'Amla',
    salty: 'Lavana',
    pungent: 'Katu',
    bitter: 'Tikta',
    astringent: 'Kashaya'
  };

  const viryaIcons = {
    heating: 'Flame',
    cooling: 'Snowflake',
    neutral: 'Circle'
  };

  const viryaColors = {
    heating: 'text-error',
    cooling: 'text-primary',
    neutral: 'text-text-secondary'
  };

  const viryaLabels = {
    heating: 'Ushna (Heating)',
    cooling: 'Shita (Cooling)',
    neutral: 'Sama (Neutral)'
  };

  const vipakaLabels = {
    sweet: 'Madhura Vipaka',
    sour: 'Amla Vipaka',
    pungent: 'Katu Vipaka'
  };

  return (
    <div className="space-y-4">
      {/* Rasa (Tastes) */}
      {properties.rasa && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Leaf" size={16} className="text-green-400" />
            <span className="text-sm font-semibold text-white">Rasa (Tastes)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(properties.rasa)
              .filter(([_, present]) => present)
              .map(([taste, _]) => (
                <motion.span
                  key={taste}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2 }}
                  className="px-2 py-1 bg-green-500/20 text-green-300 rounded border border-green-400/30 text-xs"
                >
                  {taste} ({rasaNames[taste]})
                </motion.span>
              ))}
          </div>
        </motion.div>
      )}

      {/* Virya (Potency) */}
      {properties.virya && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg border border-white/10"
        >
          <Icon
            name={viryaIcons[properties.virya] || 'Circle'}
            size={18}
            className={viryaColors[properties.virya] || 'text-text-secondary'}
          />
          <div>
            <div className="text-xs font-medium text-white">Virya (Potency)</div>
            <div className="text-xs text-green-200">
              {viryaLabels[properties.virya] || properties.virya}
            </div>
          </div>
        </motion.div>
      )}

      {/* Vipaka */}
      {properties.vipaka && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg border border-white/10"
        >
          <Icon name="Activity" size={18} className="text-green-400" />
          <div>
            <div className="text-xs font-medium text-white">Vipaka (Post-digestive)</div>
            <div className="text-xs text-green-200 capitalize">
              {vipakaLabels[properties.vipaka] || properties.vipaka}
            </div>
          </div>
        </motion.div>
      )}

      {/* Guna (Qualities) */}
      {properties.guna && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Star" size={16} className="text-green-400" />
            <span className="text-sm font-semibold text-white">Guna (Qualities)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(properties.guna)
              .filter(([_, present]) => present)
              .slice(0, 6)
              .map(([quality, _]) => (
                <motion.span
                  key={quality}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6 }}
                  className="px-2 py-1 bg-green-500/10 text-green-300 rounded border border-green-400/20 text-xs text-center capitalize"
                >
                  {quality}
                </motion.span>
              ))}
          </div>
        </motion.div>
      )}

      {/* Dosha Effects */}
      {properties.doshaEffect && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-2 mt-3"
        >
          {Object.entries(properties.doshaEffect).map(([dosha, effect]) => (
            <motion.div
              key={dosha}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="p-2 bg-white/5 rounded border border-white/10 text-center"
            >
              <div className="text-xs font-medium text-white capitalize">{dosha}</div>
              <div className="text-xs text-green-300 mt-1">{effect}</div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PrakritiProperties;
