import { cn } from 'shared/lib';
import { useState } from 'react';

interface StockChartProps {
  trend: 'up' | 'down' | 'neutral';
  className?: string;
  currentRank?: number;
  previousRank?: number;
  onClickDay?: (day: number | null) => void;
  fullSize?: boolean; // New prop for Profile Info usage
  profileMode?: boolean; // New prop to enable single-column layout for profile
}

export const StockChart = ({ trend, className, currentRank = 5, previousRank = 8, onClickDay, fullSize = false, profileMode = false }: StockChartProps) => {
  const [clickedPoint, setClickedPoint] = useState<{x: number, y: number, rank: number, day: number} | null>(null);
  const [clickedDay, setClickedDay] = useState<number | null>(null);
  
  // Chart styling configuration based on profileMode
  const chartStyles = profileMode ? {
    containerHeight: 86,
    labelFontSize: "5",
    strokeWidth: "2.5",
    dotRadius: "1",
    backgroundClass: "",
    borderRadiusClass: "rounded-xl",
    labelColor: "#e8d5ff",
    spacingMultiplier: 0.9,
    boxShadow: "inset rgba(255, 255, 255, 0.7) 0px 2px 15px 0px"
  } : {
    containerHeight: 30,
    labelFontSize: "5", 
    strokeWidth: "2.5",
    dotRadius: "1",
    backgroundClass: "bg-white/10",
    borderClass: "border border-white/20",
    borderRadiusClass: "rounded-lg",
    labelColor: "#e2e8f0",
    spacingMultiplier: 0.75,
    boxShadow: undefined
  };
  
  // Generate cryptocurrency-style rank progression data
  const generateRankData = () => {
    const days = 23; // Back to 23 days as requested
    const width = 180; // Keep compact width
    const height = chartStyles.containerHeight; // Use dynamic height from chartStyles
    const heightMultiplier = chartStyles.spacingMultiplier; // Use dynamic spacing from chartStyles
    const data: Array<{x: number, y: number, rank: number, color: string, day: number}> = [];
    
    const startRank = previousRank;
    const endRank = currentRank;
    const totalChange = endRank - startRank;
    
    for (let day = 0; day < days; day++) {
      const x = 20 + (day / (days - 1)) * (width - 40); // Smaller spacing
      
      let dayRank: number;
      
      if (day === days - 1) {
        dayRank = currentRank;
      } else {
        const progressRatio = day / (days - 1);
        dayRank = startRank + (totalChange * progressRatio);
        
        // Same volatility structure for both modes - only rendering differs
        const volatility = Math.sin(day * 0.9) * 4 + Math.cos(day * 0.5) * 2.5;
        const cryptoWave = Math.sin(day * 1.3) * 2;
        
        if (trend === 'up') {
          dayRank += volatility;
          if (day >= 2 && day <= 3) dayRank += 5; // Dramatic dip
          if (day >= 5 && day <= 6) dayRank += 2;
          if (day >= 7 && day <= 8) dayRank -= 2; // Final surge
        } else if (trend === 'down') {
          dayRank += volatility;
          if (day >= 2 && day <= 4) dayRank -= 3; // Temporary rally
          if (day >= 6 && day <= 7) dayRank -= 1;
          if (day >= 8 && day <= 9) dayRank += 4; // Final crash
        } else {
          dayRank = currentRank + volatility + cryptoWave;
        }
        
        dayRank = Math.max(1, Math.min(25, dayRank));
      }
      
      // Convert rank to Y position
      const cellPosition = Math.ceil(Math.min(dayRank, 10) / 2);
      const midlinePosition = heightMultiplier;
      
      let y;
      if (dayRank <= 10) {
        y = 4 + ((cellPosition - 1) / 5) * (height * midlinePosition - 4);
      } else {
        y = (height * midlinePosition) + ((dayRank - 10) / 15) * (height * (1 - midlinePosition) - 4);
      }
      
      // Default green color (since green path connects all)
      let color = '#00d4aa';
      
      data.push({ x, y, rank: dayRank, color, day });
    }
    
    return data;
  };

  const rankData = generateRankData();

  // Generate ultra-smooth flowing curves like professional financial charts
  const generateSmoothPath = (points: Array<{x: number, y: number}>) => {
    if (points.length < 2) return '';
    
    if (!profileMode) {
      // Use straight lines for table mode
      let path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`;
      }
      return path;
    }
    
    // Create ultra-smooth flowing curves for profile mode using enhanced spline interpolation
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      // Get extended surrounding points for ultra-smooth interpolation
      const prev = points[i - 1] || points[i];
      const nextNext = points[i + 2] || points[i + 1];
      
      // Enhanced smoothing parameters for maximum naturalness
      const smoothness = 0.35; // Optimal smoothness factor
      const curvature = 0.25;   // Controls curve intensity
      
      // Calculate direction vectors for natural flow
      const prevVector = {
        x: current.x - prev.x,
        y: current.y - prev.y
      };
      
      const nextVector = {
        x: nextNext.x - next.x,
        y: nextNext.y - next.y
      };
      
      // Enhanced control points using weighted averaging for natural curves
      const cp1x = current.x + (next.x - current.x) * smoothness + prevVector.x * curvature;
      const cp1y = current.y + (next.y - current.y) * smoothness + prevVector.y * curvature;
      
      const cp2x = next.x - (next.x - current.x) * smoothness - nextVector.x * curvature;
      const cp2y = next.y - (next.y - current.y) * smoothness - nextVector.y * curvature;
      
      // Create ultra-smooth cubic bezier curves
      path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${next.x} ${next.y}`;
    }
    
    return path;
  };

  // Generate ultra-smooth flowing red curves for downward trends
  const generateRedCurveSegments = (points: Array<{x: number, y: number, rank: number}>) => {
    const segments = [];
    
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const rankChange = current.rank - previous.rank;
      
      // Only create red segments for significant downward trends
      if (rankChange > 0.5) {
        // Use the same ultra-smooth approach as the main curve
        const prev = points[i - 2] || previous;
        const next = points[i + 1] || current;
        
        // Enhanced smoothing for red segments
        const smoothness = 0.35;
        const curvature = 0.25;
        
        // Calculate direction vectors for natural red curve flow
        const prevVector = {
          x: previous.x - prev.x,
          y: previous.y - prev.y
        };
        
        const nextVector = {
          x: next.x - current.x,
          y: next.y - current.y
        };
        
        // Ultra-smooth control points for red segments
        const cp1x = previous.x + (current.x - previous.x) * smoothness + prevVector.x * curvature;
        const cp1y = previous.y + (current.y - previous.y) * smoothness + prevVector.y * curvature;
        
        const cp2x = current.x - (current.x - previous.x) * smoothness - nextVector.x * curvature;
        const cp2y = current.y - (current.y - previous.y) * smoothness - nextVector.y * curvature;
        
        const path = `M ${previous.x} ${previous.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${current.x} ${current.y}`;
        
        segments.push(
          <path
            key={`red-curve-${i}`}
            d={path}
            fill="none"
            stroke="#ff6b6b"
            strokeWidth={chartStyles.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
            filter="url(#cryptoGlow)"
            className="transition-all duration-300"
          />
        );
      }
    }
    
    return segments;
  };

  return (
    <div className={cn(
      'flex items-center justify-center relative',
      fullSize ? 'w-full h-full' : 'group',
      className
    )}>
      <div 
        className={cn(
          chartStyles.backgroundClass,
          'overflow-hidden relative',
          chartStyles.borderRadiusClass,
          chartStyles.borderClass,
          fullSize ? 'w-full  h-full  flex items-center justify-center min-h-[300px]' : 'p-2.5 transition-all  duration-500 transform-gpu',
          !fullSize && (trend === 'up' ? 'hover:border-emerald-400/30' :
          trend === 'down' ? 'hover:border-red-400/30' :
          'hover:border-cyan-400/30')
        )}
        style={{
          ...(chartStyles.boxShadow && { boxShadow: chartStyles.boxShadow })
        }}
      >
        {/* Subtle animated background shimmer - only for table usage */}
        {!fullSize && (
          <div className="absolute  inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-2000"></div>
        )}
        
        <svg 
          width={fullSize ? "100%" : "180"} 
          height={fullSize ? "100%" : chartStyles.containerHeight.toString()} 
          viewBox={fullSize ? `0 0 180 ${chartStyles.containerHeight}` : undefined}
          preserveAspectRatio={fullSize ? "xMidYMid meet" : undefined}
          className="overflow-visible relative z-10 "
        >
          {/* Advanced gradient definitions */}
          <defs>
            <linearGradient id="cryptoGridGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#26d0ce" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00d4aa" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="chartBgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={
                trend === 'up' ? '#00d4aa' : 
                trend === 'down' ? '#ff6b6b' : 
                '#26d0ce'
              } stopOpacity="0.15" />
              <stop offset="100%" stopColor={
                trend === 'up' ? '#00d4aa' : 
                trend === 'down' ? '#ff6b6b' : 
                '#26d0ce'
              } stopOpacity="0.03" />
            </linearGradient>
            <filter id="cryptoGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Crypto-style background - transparent for profile mode */}
          <rect width="180" height="90" fill={profileMode ? "transparent" : "url(#chartBgGradient)"} rx="6" />
          
          {/* Animated grid lines */}
          {Array.from({ length: 5 }, (_, i) => (
            <line
              key={`grid-${i}`}
              x1={20}
              y1={4 + (i / 4) * (chartStyles.containerHeight * chartStyles.spacingMultiplier - 4)}
              x2={160}
              y2={4 + (i / 4) * (chartStyles.containerHeight * chartStyles.spacingMultiplier - 4)}
              stroke="url(#cryptoGridGradient)"
              strokeWidth="0.5"
              className="animate-pulse"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: '3s'
              }}
            />
          ))}
          
          {/* Position labels - conditional rendering based on profileMode */}
          {profileMode ? (
            // Single column layout for profile mode (1-10) with increased spacing
            Array.from({ length: 10 }, (_, i) => {
              const position = i + 1;
              const y = 4 + (i / 9) * (chartStyles.containerHeight * chartStyles.spacingMultiplier - 4);
              
              return (
                <text
                  key={`position-${i}`}
                  x={3}
                  y={y + 2}
                  fontSize={chartStyles.labelFontSize}
                  fill={chartStyles.labelColor}
                  fontFamily="JetBrains Mono, Consolas, monospace"
                  fontWeight="600"
                  className="drop-shadow-sm"
                >
                  {position}
                </text>
              );
            })
          ) : (
            // Compact two-column layout for table mode
            Array.from({ length: 5 }, (_, i) => {
              const position1 = i * 2 + 1;
              const position2 = i * 2 + 2;
              const y = 4 + (i / 4) * (chartStyles.containerHeight * chartStyles.spacingMultiplier - 4);
              
              return (
                <g key={`positions-${i}`}>
                  <text
                    x={3}
                    y={y + 2}
                    fontSize={chartStyles.labelFontSize}
                    fill={chartStyles.labelColor}
                    fontFamily="JetBrains Mono, Consolas, monospace"
                    fontWeight="600"
                    className="drop-shadow-sm"
                  >
                    {position1}
                  </text>
                  <text
                    x={9}
                    y={y + 2}
                    fontSize="4"
                    fill="#94a3b8"
                    fontFamily="JetBrains Mono, Consolas, monospace"
                    fontWeight="400"
                  >
                    {position2}
                  </text>
                </g>
              );
            })
          )}
          
          {/* Compact Top 10 boundary */}
          <line
            x1={20}
            y1={chartStyles.containerHeight * chartStyles.spacingMultiplier}
            x2={160}
            y2={chartStyles.containerHeight * chartStyles.spacingMultiplier}
            stroke="#fbbf24"
            strokeWidth="1"
            strokeDasharray="3,2"
            opacity="0.7"
            filter="url(#cryptoGlow)"
          />
          
          {/* Compact TOP 10 label */}
          <text
            x={22}
            y={chartStyles.containerHeight * chartStyles.spacingMultiplier - 2}
            fontSize="4"
            fill="#fbbf24"
            opacity="0.8"
            fontFamily="JetBrains Mono, Consolas, monospace"
            fontWeight="700"
            className="drop-shadow-sm"
          >
            TOP 10
          </text>
          
          {/* Continuous path connecting all dots - smooth curves for profile mode */}
          <path
            d={profileMode ? generateSmoothPath(rankData) : `M ${rankData[0]?.x} ${rankData[0]?.y} ${rankData.slice(1).map(point => 
              `L ${point.x} ${point.y}`
            ).join(' ')}`}
            fill="none"
            stroke="#00d4aa"
            strokeWidth={chartStyles.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="1"
            filter="url(#cryptoGlow)"
            className="transition-all duration-300"
          />
          
          {/* Individual line segments - only for table mode */}
          {!profileMode && rankData.slice(1).map((point, index) => {
            const prevPoint = rankData[index];
            return (
              <line
                key={`green-${index}`}
                x1={prevPoint.x}
                y1={prevPoint.y}
                x2={point.x}
                y2={point.y}
                stroke="#00d4aa"
                strokeWidth={chartStyles.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
                filter="url(#cryptoGlow)"
                className="transition-all duration-300"
              />
            );
          })}
          
          {/* Red segments for downward trends - both modes */}
          {profileMode ? (
            // Smooth curved red segments for profile mode
            generateRedCurveSegments(rankData)
          ) : (
            // Straight line red segments for table mode
            rankData.slice(1).map((point, index) => {
              const prevPoint = rankData[index];
              const rankChange = point.rank - prevPoint.rank;
              
              // Only show red for significant downward trends
              if (rankChange > 0.5) {
                return (
                  <line
                    key={`red-${index}`}
                    x1={prevPoint.x}
                    y1={prevPoint.y}
                    x2={point.x}
                    y2={point.y}
                    stroke="#ff6b6b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.95"
                    filter="url(#cryptoGlow)"
                    className="transition-all duration-300"
                  />
                );
              }
              return null;
            })
          )}
          
          {/* Minimized dots for 23 days */}
          {rankData.map((point, index) => (
            <g key={`crypto-point-${index}`}>
              {/* Clickable area */}
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="transparent"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (clickedDay === point.day) {
                    setClickedPoint(null);
                    setClickedDay(null);
                    onClickDay?.(null);
                  } else {
                    setClickedPoint(point);
                    setClickedDay(point.day);
                    onClickDay?.(point.day);
                  }
                }}
              />
              
              {/* Very small dot that sits on the line */}
              <circle
                cx={point.x}
                cy={point.y}
                r={chartStyles.dotRadius}
                fill={point.color}
                stroke="#ffffff"
                strokeWidth="0.5"
                opacity="0.9"
                filter="url(#cryptoGlow)"
                className={fullSize ? "pointer-events-none" : "hover:opacity-100 hover:r-1.5 transition-all duration-200 pointer-events-none"}
              />
              
              {/* Subtle hover ring - only for table usage */}
              {!fullSize && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="2"
                  fill="none"
                  stroke={point.color}
                  strokeWidth="0.5"
                  opacity="0"
                  className="hover:opacity-40 transition-all duration-200 pointer-events-none"
                >
                  <animate
                    attributeName="r"
                    values="1;4;1"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          ))}
          
          {/* Enhanced click indicator with Bitcoin-style animations */}
          {clickedDay !== null && (
            <g>
              {(() => {
                const clickedDayPoint = rankData[clickedDay];
                if (!clickedDayPoint) return null;
                return (
                  <>
                    <circle
                      cx={clickedDayPoint.x}
                      cy={clickedDayPoint.y}
                      r="5"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="3"
                      opacity="0.9"
                      filter="url(#strongGlow)"
                    />
                    <circle
                      cx={clickedDayPoint.x}
                      cy={clickedDayPoint.y}
                      r="8"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="r"
                        values="5;15;5"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.6;0.1;0.6"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                );
              })()}
            </g>
          )}
          
          {/* Compact starting position */}
          <g>
            <circle
              cx={rankData[0]?.x || 20}
              cy={rankData[0]?.y || 15}
              r="2"
              fill={rankData[0]?.color || '#64748b'}
              stroke="#ffffff"
              strokeWidth="1"
              filter="url(#cryptoGlow)"
            />
            <text
              x={rankData[0]?.x || 20}
              y={(rankData[0]?.y || 15) - 5}
              fontSize="4"
              fill="#e2e8f0"
              textAnchor="middle"
              fontFamily="JetBrains Mono, Consolas, monospace"
              fontWeight="600"
              className="drop-shadow-sm"
            >
              #{previousRank}
            </text>
          </g>
          
          {/* Compact current position */}
          <g>
            <circle
              cx={rankData[rankData.length - 1]?.x || 160}
              cy={rankData[rankData.length - 1]?.y || 15}
              r="2.5"
              fill={rankData[rankData.length - 1]?.color || '#64748b'}
              stroke="#ffffff"
              strokeWidth="1"
              filter="url(#cryptoGlow)"
              className="drop-shadow-md"
            />
            <circle
              cx={rankData[rankData.length - 1]?.x || 160}
              cy={rankData[rankData.length - 1]?.y || 15}
              r="4"
              fill="none"
              stroke={
                trend === 'up' ? '#00d4aa' : 
                trend === 'down' ? '#ff6b6b' : 
                '#26d0ce'
              }
              strokeWidth="1"
              opacity="0.5"
            >
              <animate
                attributeName="r"
                values="3;6;3"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0.1;0.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <text
              x={rankData[rankData.length - 1]?.x || 160}
              y={(rankData[rankData.length - 1]?.y || 15) - 6}
              fontSize="5"
              fill="#e2e8f0"
              textAnchor="middle"
              fontFamily="JetBrains Mono, Consolas, monospace"
              fontWeight="600"
              className="drop-shadow-sm"
            >
              #{currentRank}
            </text>
          </g>
        </svg>
      </div>
      
      {/* Compact tooltip with transparent styling */}
      {clickedPoint && (
        <div 
          className="absolute z-[999999999999999999] pointer-events-none"
          style={{
            left: `${clickedPoint.x - 15}px`,
            top: `${clickedPoint.y - 25}px`,
          }}
        >
          <div className="bg-black/70 backdrop-blur-sm border border-white/30 rounded px-1.5 py-1 shadow-lg min-w-[30px] text-center">
            <div className="text-white text-[6px] font-semibold leading-none mb-0.5 font-mono">
              Day {clickedPoint.day + 1}
            </div>
            <div className="text-amber-300 text-[6px] font-bold leading-none font-mono">
              #{Math.round(clickedPoint.rank)}
            </div>
          </div>
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 top-full"
            style={{
              width: 0,
              height: 0,
              borderLeft: '2px solid transparent',
              borderRight: '2px solid transparent',
              borderTop: '2px solid rgba(0, 0, 0, 0.7)',
            }}
          />
        </div>
      )}
    </div>
  );
};
