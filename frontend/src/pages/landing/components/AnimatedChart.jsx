import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedChart = ({ type, data, labels, colors }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  if (type === 'line') {
    return <LineChart ref={ref} isInView={isInView} data={data} labels={labels} colors={colors} />;
  }
  
  if (type === 'bar') {
    // Handle both array format and object format
    const barData = Array.isArray(data) ? data : (data.values || []);
    return <BarChart ref={ref} isInView={isInView} data={barData} labels={labels} colors={colors} />;
  }

  return null;
};

const LineChart = React.forwardRef(({ isInView, data, labels, colors }, ref) => {
  const matchaData = data.matcha || data.ayutra;
  const otherData = data.other || data.generic;
  const maxValue = Math.max(...matchaData, ...otherData);

  const drawLine = (points, color, delay = 0) => {
    if (!points || points.length === 0) return null;
    const pathLength = points.length;
    return points.map((point, index) => {
      const x = (index / (pathLength - 1)) * 100;
      const y = 100 - (point / maxValue) * 100;
      
      return (
        <motion.circle
          key={index}
          cx={`${x}%`}
          cy={`${y}%`}
          r="4"
          fill={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: delay + index * 0.05, duration: 0.3 }}
        />
      );
    });
  };

  const createPath = (points) => {
    if (!points || points.length === 0) return '';
    let path = `M 0,${100 - (points[0] / maxValue) * 100}`;
    points.forEach((point, index) => {
      if (index > 0) {
        const x = (index / (points.length - 1)) * 100;
        const y = 100 - (point / maxValue) * 100;
        path += ` L ${x},${y}`;
      }
    });
    return path;
  };

  return (
    <div ref={ref} className="relative w-full h-full bg-[#2F4F4F] rounded-lg p-4 md:p-6 lg:p-8">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke={colors.grid || '#4c5a4d'}
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
        
        {/* Ayutra line */}
        <motion.path
          d={createPath(matchaData)}
          fill="none"
          stroke={colors.matcha || colors.ayutra || '#a7d386'}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Generic/Other line */}
        <motion.path
          d={createPath(otherData)}
          fill="none"
          stroke={colors.other || colors.generic || '#f0c383'}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
        />
        
        {/* Fill areas */}
        <motion.path
          d={`${createPath(matchaData)} L 100,100 L 0,100 Z`}
          fill={colors.matcha || colors.ayutra || '#a7d386'}
          fillOpacity="0.2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.5 }}
        />
        
        <motion.path
          d={`${createPath(otherData)} L 100,100 L 0,100 Z`}
          fill={colors.other || colors.generic || '#f0c383'}
          fillOpacity="0.2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.8, duration: 0.5 }}
        />
        
        {/* Data points */}
        {drawLine(matchaData, colors.matcha || colors.ayutra || '#a7d386', 0)}
        {drawLine(otherData, colors.other || colors.generic || '#f0c383', 0.5)}
      </svg>
      
      {/* Labels */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="text-white text-xs">{data.ayutra ? 'Ayutra' : 'Matcha'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-300"></div>
          <span className="text-white text-xs">{data.generic ? 'Generic Diets' : 'Other Energy Sources'}</span>
        </div>
      </div>
      
      {/* Axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1">
        <span className="text-white/70 text-xs">0</span>
        <span className="text-white/70 text-xs font-medium">{data.xAxisLabel || 'WEEKS'}</span>
        <span className="text-white/70 text-xs">{matchaData ? matchaData.length - 1 : 7}</span>
      </div>
      
      {/* Y-axis label */}
      {data.yAxisLabel && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 origin-center">
          <span className="text-white/70 text-xs font-medium">{data.yAxisLabel}</span>
        </div>
      )}
    </div>
  );
});

const BarChart = React.forwardRef(({ isInView, data, labels, colors }, ref) => {
  // Handle both array format and object format with values
  const barData = Array.isArray(data) ? data : (data?.values || []);
  const xAxisLabel = data?.xAxisLabel || 'WEEKS';
  const yAxisLabel = data?.yAxisLabel || 'SCORE';
  
  if (!barData || barData.length === 0) {
    return <div ref={ref} className="relative w-full h-48 bg-[#2F4F4F] rounded-lg p-4"></div>;
  }
  
  const maxValue = Math.max(...barData);
  const baseline = 50;

  return (
    <div ref={ref} className="relative w-full h-48 bg-[#2F4F4F] rounded-lg p-4">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke={colors?.grid || '#4c5a4d'}
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
        
        {/* Baseline */}
        <line
          x1="0"
          y1={baseline}
          x2="100"
          y2={baseline}
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.5"
        />
        
        {/* Bars */}
        {barData.map((value, index) => {
          const barWidth = 100 / barData.length;
          const x = (index * barWidth) + (barWidth * 0.1);
          const width = barWidth * 0.8;
          const normalizedValue = (value / maxValue) * 100;
          const isAbove = normalizedValue > baseline;
          const height = Math.abs(normalizedValue - baseline);
          const y = isAbove ? baseline - height : baseline;
          const barColor = isAbove 
            ? (colors?.positive || '#9DD76F')
            : (colors?.negative || '#f0c383');
          
          return (
            <motion.rect
              key={index}
              x={`${x}%`}
              y={`${y}%`}
              width={`${width}%`}
              height={`${height}%`}
              fill={barColor}
              initial={{ height: 0, y: baseline }}
              animate={isInView ? { height: `${height}%`, y: `${y}%` } : {}}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.8, 
                ease: "easeOut" 
              }}
            />
          );
        })}
      </svg>
      
      {/* Axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1">
        <span className="text-white/70 text-xs">0</span>
        <span className="text-white/70 text-xs font-medium">{xAxisLabel}</span>
        <span className="text-white/70 text-xs">{barData.length - 1}</span>
      </div>
      
      {/* Y-axis label */}
      {yAxisLabel && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 origin-center">
          <span className="text-white/70 text-xs font-medium">{yAxisLabel}</span>
        </div>
      )}
    </div>
  );
});

export default AnimatedChart;
