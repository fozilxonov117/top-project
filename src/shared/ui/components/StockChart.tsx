import { cn } from 'shared/lib';
import { useState } from 'react';

interface StockChartProps {
  trend: 'up' | 'down' | 'neutral';
  className?: string;
  currentRank?: number;
  previousRank?: number;
}

export const StockChart = ({ trend, className, currentRank = 5, previousRank = 8 }: StockChartProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<{x: number, y: number, rank: number, day: number} | null>(null);
  // Generate 23-day rank progression data
  const generateRankData = () => {
    const days = 23;
    const width = 150; // Enhanced width for 23 days
    const height = 35; // Enhanced height
    const data: Array<{x: number, y: number, rank: number, color: string, day: number}> = [];
    
    // Start from previous rank and ENSURE we end at exact current rank
    const startRank = previousRank;
    const endRank = currentRank; // This MUST be the final point
    const totalChange = endRank - startRank;
    
    for (let day = 0; day < days; day++) {
      const x = 15 + (day / (days - 1)) * (width - 30); // Account for margins
      
      let dayRank: number;
      
      // CRITICAL: Ensure the LAST day (day 22) is EXACTLY the current rank
      if (day === days - 1) {
        dayRank = currentRank; // Force exact current position
      } else {
        // Calculate base rank progression with movements
        const progressRatio = day / (days - 1);
        dayRank = startRank + (totalChange * progressRatio);
        
        // Add more realistic fluctuations for position tracking
        const volatility = Math.sin(day * 0.6) * 2.5 + Math.cos(day * 0.3) * 1.8;
        const trendWave = Math.sin(day * 0.8) * 1.5;
        
        if (trend === 'up') {
          dayRank += volatility;
          // Simulate temporary setbacks during improvement
          if (day >= 5 && day <= 8) dayRank += 3; // Temporary decline
          if (day >= 12 && day <= 15) dayRank += 2;
          if (day >= 18 && day <= 20) dayRank -= 1; // Final push
        } else if (trend === 'down') {
          dayRank += volatility;
          // Simulate temporary improvements during decline
          if (day >= 6 && day <= 9) dayRank -= 2; // Temporary improvement
          if (day >= 13 && day <= 16) dayRank -= 1;
          if (day >= 19 && day <= 21) dayRank += 2.5; // Final decline
        } else {
          dayRank = currentRank + volatility + trendWave;
        }
        
        // Constrain ranks to realistic range (1-25) but allow final adjustment
        dayRank = Math.max(1, Math.min(25, dayRank));
      }
      
      // Convert rank to Y position with 0.5 cell spacing (10 positions in 5 cells)
      // Positions 1-2 = cell 1, positions 3-4 = cell 2, etc.
      const cellPosition = Math.ceil(Math.min(dayRank, 10) / 2); // Groups: 1-2, 3-4, 5-6, 7-8, 9-10
      const midlinePosition = 0.83; // Midline at bottom for top 10 (5 cells)
      
      let y;
      if (dayRank <= 10) {
        // Top 10: Use 5 cells (positions 1-10 mapped to cells 1-5)
        y = 3 + ((cellPosition - 1) / 5) * (height * midlinePosition - 3);
      } else {
        // Below top 10: compressed space
        y = (height * midlinePosition) + ((dayRank - 10) / 15) * (height * (1 - midlinePosition) - 3);
      }
      
      // Determine color based on movement and top-10 status
      const isInTop10 = dayRank <= 10;
      let color = '#666666'; // default gray
      
      if (day > 0) {
        const prevRank = data[day - 1].rank;
        const wasInTop10 = prevRank <= 10;
        const rankChange = dayRank - prevRank;
        
        // Enhanced color coding for movements
        if (isInTop10 && !wasInTop10) {
          color = '#00ff88'; // Bright green - entered top-10
        } else if (!isInTop10 && wasInTop10) {
          color = '#ff3366'; // Bright red - left top-10
        } else if (Math.abs(rankChange) >= 2) {
          color = rankChange < 0 ? '#44ff66' : '#ff4466'; // Green for improvement, red for decline
        } else if (Math.abs(rankChange) >= 1) {
          color = rankChange < 0 ? '#66ff88' : '#ff6666'; // Lighter colors for smaller changes
        } else {
          color = isInTop10 ? '#88ff88' : '#888888'; // Steady state colors
        }
      } else {
        color = isInTop10 ? '#00ff88' : '#ff6666';
      }
      
      data.push({ x, y, rank: dayRank, color, day });
    }
    
    return data;
  };

  const rankData = generateRankData();

  return (
    <div className={cn('flex items-center justify-center relative', className)}>
      <div className={cn(
        'bg-[#0000001f] rounded-sm p-1 border transition-all duration-300',
        trend === 'up' ? 'border-green-500/50 shadow-green-500/20 shadow-sm' :
        trend === 'down' ? 'border-red-500/50 shadow-red-500/20 shadow-sm' :
        'border-gray-800/50'
      )}>
        <svg width="150" height="35" className="overflow-visible">
          {/* Background */}
          <rect width="150" height="35" fill="#ffffff0e" rx="2" />
          
          {/* Position labels on the left (1-10) */}
          {Array.from({ length: 5 }, (_, i) => {
            const position1 = i * 2 + 1;  // 1, 3, 5, 7, 9
            const position2 = i * 2 + 2;  // 2, 4, 6, 8, 10
            const y = 3 + (i / 5) * (35 * 0.83 - 3);
            
            return (
              <g key={`positions-${i}`}>
                <text
                  x={2}
                  y={y + 2}
                  fontSize="6"
                  fill="#ffffff88"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {position1}
                </text>
                <text
                  x={8}
                  y={y + 2}
                  fontSize="6"
                  fill="#ffffff66"
                  fontFamily="monospace"
                >
                  {position2}
                </text>
              </g>
            );
          })}
          
          {/* Grid lines for 5 cells (0.5 spacing for 10 positions) */}
          {Array.from({ length: 6 }, (_, i) => (
            <line
              key={`grid-${i}`}
              x1={15}
              y1={3 + (i / 5) * (35 * 0.83 - 3)}
              x2={148}
              y2={3 + (i / 5) * (35 * 0.83 - 3)}
              stroke="#ffffff08"
              strokeWidth="0.3"
            />
          ))}
          
          {/* Top-10 boundary line */}
          <line
            x1={15}
            y1={35 * 0.83}
            x2={148}
            y2={35 * 0.83}
            stroke="#ffff00"
            strokeWidth="1"
            strokeDasharray="3,2"
            opacity="0.8"
          />
          
          {/* TOP 10 label */}
          <text
            x={17}
            y={35 * 0.83 - 2}
            fontSize="6"
            fill="#ffff00"
            opacity="0.8"
            fontFamily="monospace"
            fontWeight="bold"
          >
            TOP 10
          </text>
          
          {/* Multi-colored line segments */}
          {rankData.slice(1).map((point, index) => {
            const prevPoint = rankData[index];
            return (
              <line
                key={index}
                x1={prevPoint.x}
                y1={prevPoint.y}
                x2={point.x}
                y2={point.y}
                stroke={point.color}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
          
          {/* Interactive hover points for precise position tracking */}
          {rankData.map((point, index) => (
            <g key={`hover-point-${index}`}>
              {/* Invisible large circle for easier hovering */}
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              
              {/* Small visible dot that shows on hover */}
              <circle
                cx={point.x}
                cy={point.y}
                r="1.5"
                fill={point.color}
                stroke="#ffffff"
                strokeWidth="0.5"
                opacity="0.4"
                className="hover:opacity-100 hover:r-3 transition-all duration-200 pointer-events-none"
              />
            </g>
          ))}
          
          {/* Highlight point when hovered */}
          {hoveredPoint && (
            <g>
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="3"
                fill="#ffff00"
                stroke="#000000"
                strokeWidth="1"
                opacity="0.9"
              />
              {/* Pulsing ring around hovered point */}
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="5"
                fill="none"
                stroke="#ffff00"
                strokeWidth="1"
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  values="3;7;3"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0.1;0.5"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )}
          
          {/* Starting position indicator with number */}
          <g>
            <circle
              cx={rankData[0]?.x || 15}
              cy={rankData[0]?.y || 15}
              r="3"
              fill={rankData[0]?.color || '#666666'}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <text
              x={rankData[0]?.x || 15}
              y={(rankData[0]?.y || 15) - 6}
              fontSize="6"
              fill="#ffffff"
              textAnchor="middle"
              fontFamily="monospace"
              fontWeight="bold"
            >
              #{previousRank}
            </text>
            {/* "START" label */}
            <text
              x={rankData[0]?.x || 15}
              y={(rankData[0]?.y || 15) + 10}
              fontSize="4"
              fill="#888888"
              textAnchor="middle"
              fontFamily="monospace"
              fontWeight="bold"
              opacity="0.7"
            >
              START
            </text>
          </g>
          
          {/* Current position indicator with number - EXACT current rank */}
          <g>
            <circle
              cx={rankData[rankData.length - 1]?.x || 145}
              cy={rankData[rankData.length - 1]?.y || 15}
              r="4"
              fill={rankData[rankData.length - 1]?.color || '#666666'}
              stroke="#ffffff"
              strokeWidth="2"
              className="drop-shadow-lg"
            />
            {/* Enhanced pulsing ring with trend colors */}
            <circle
              cx={rankData[rankData.length - 1]?.x || 145}
              cy={rankData[rankData.length - 1]?.y || 15}
              r="6"
              fill="none"
              stroke={
                trend === 'up' ? '#00ff88' : 
                trend === 'down' ? '#ff3366' : 
                rankData[rankData.length - 1]?.color || '#666666'
              }
              strokeWidth="1"
              opacity="0.5"
            >
              <animate
                attributeName="r"
                values="4;8;4"
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
              x={rankData[rankData.length - 1]?.x || 145}
              y={(rankData[rankData.length - 1]?.y || 15) - 8}
              fontSize="7"
              fill="#ffffff"
              textAnchor="middle"
              fontFamily="monospace"
              fontWeight="bold"
              className="drop-shadow-sm"
            >
              #{currentRank}
            </text>
            {/* Enhanced "CURRENT" label with trend colors */}
            <text
              x={rankData[rankData.length - 1]?.x || 145}
              y={(rankData[rankData.length - 1]?.y || 15) + 12}
              fontSize="4"
              fill={
                trend === 'up' ? '#00ff88' : 
                trend === 'down' ? '#ff3366' : 
                '#ffff00'
              }
              textAnchor="middle"
              fontFamily="monospace"
              fontWeight="bold"
              opacity="0.8"
            >
              CURRENT
            </text>
          </g>
          
          {/* Highlight significant position changes with arrows */}
          {rankData.map((point, index) => {
            if (index === 0 || index < 5) return null;
            
            const prevPoint = rankData[index - 5]; // Compare with 5 days ago
            const rankChange = prevPoint.rank - point.rank; // Negative = worse, positive = better
            
            if (Math.abs(rankChange) >= 3) { // Show significant changes
              return (
                <g key={`change-${index}`}>
                  <text
                    x={point.x}
                    y={point.y + 3}
                    fontSize="7"
                    fill={rankChange > 0 ? '#00ff88' : '#ff3366'}
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {rankChange > 0 ? '↑' : '↓'}
                  </text>
                </g>
              );
            }
            return null;
          })}
        </svg>
      </div>
      
      {/* CSS-based tooltip positioned ABOVE the hovered point */}
      {hoveredPoint && (
        <div 
          className="absolute z-50 pointer-events-none"
          style={{
            left: `${hoveredPoint.x - 25}px`,
            top: `${hoveredPoint.y - 45}px`, // 45px ABOVE the point
          }}
        >
          <div className="bg-black border border-yellow-400 rounded-md px-2 py-1 shadow-lg opacity-95 min-w-[80px]">
            <div className="text-white text-[10px] font-mono text-center leading-tight">
              Day {hoveredPoint.day + 1}
            </div>
            <div className="text-yellow-400 text-[11px] font-mono font-bold text-center leading-tight">
              Position #{Math.round(hoveredPoint.rank)}
            </div>
          </div>
          {/* Arrow pointing down to the data point */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 -bottom-1"
            style={{
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid rgb(234, 179, 8)', // yellow-400
            }}
          />
        </div>
      )}
    </div>
  );
};
