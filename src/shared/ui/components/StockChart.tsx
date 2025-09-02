import { cn } from 'shared/lib';

interface StockChartProps {
  trend: 'up' | 'down' | 'neutral';
  className?: string;
  currentRank?: number;
  previousRank?: number;
}

export const StockChart = ({ trend, className, currentRank = 5, previousRank = 8 }: StockChartProps) => {
  // Generate 22-day rank progression with dramatic 3-4 position movements
  const generateRankData = () => {
    const width = 80; // Slightly wider to accommodate 22 days
    const height = 30; // Taller for better midline visibility
    const days = 22;
    const data: Array<{x: number, y: number, rank: number, color: string}> = [];
    
    // Start from previous rank and progress to current rank
    const startRank = previousRank;
    const endRank = currentRank;
    const totalChange = endRank - startRank;
    
    for (let day = 0; day < days; day++) {
      const x = 2 + (day / (days - 1)) * (width - 4);
      
      // Calculate base rank progression with DRAMATIC movements (3-4 positions)
      const progressRatio = day / (days - 1);
      let dayRank = startRank + (totalChange * progressRatio);
      
      // Add LARGE fluctuations to simulate 3-4 position moves
      const bigVolatility = Math.sin(day * 0.6) * 3.5 + Math.cos(day * 0.3) * 2.8; // Large swings
      const trendWave = Math.sin(day * 0.8) * 2.5; // Additional trend waves
      
      if (trend === 'up') {
        // Strong improving trend with big swings
        dayRank += bigVolatility;
        // Create dramatic improvement phases
        if (day >= 5 && day <= 8) {
          dayRank -= 4; // Big jump up (better rank = lower number)
        }
        if (day >= 12 && day <= 15) {
          dayRank -= 3; // Another improvement wave
        }
        if (day >= 18 && day <= 20) {
          dayRank += 2; // Small pullback
        }
      } else if (trend === 'down') {
        // Strong declining trend with big drops
        dayRank += bigVolatility;
        // Create dramatic decline phases  
        if (day >= 6 && day <= 9) {
          dayRank += 4; // Big drop (worse rank = higher number)
        }
        if (day >= 13 && day <= 16) {
          dayRank += 3; // Another decline wave
        }
        if (day >= 19 && day <= 21) {
          dayRank -= 1.5; // Small recovery
        }
      } else {
        // Neutral with dramatic swings around current position
        dayRank = currentRank + bigVolatility + trendWave;
        
        // Create crossing patterns for testing
        if (day >= 4 && day <= 7) {
          dayRank += currentRank < 10 ? 3 : -3; // Move 3 positions
        }
        if (day >= 11 && day <= 14) {
          dayRank += currentRank < 10 ? -2.5 : 2.5; // Move back 2-3 positions
        }
        if (day >= 17 && day <= 20) {
          dayRank += currentRank < 10 ? 2 : -2; // Final movement
        }
      }
      
      // Constrain ranks to realistic range but allow bigger swings (1-30)
      dayRank = Math.max(1, Math.min(30, dayRank));
      
      // Convert rank to Y position with midline at bottom for more upward space
      // Midline at rank 10.5 should be near bottom (80% down from top)
      const midlinePosition = 0.8; // 80% down from top gives more space above
      const y = dayRank <= 10.5 
        ? 2 + ((dayRank - 1) / 9.5) * (height * midlinePosition - 2) // Top 80% for ranks 1-10
        : (height * midlinePosition) + ((dayRank - 10.5) / 19.5) * (height * (1 - midlinePosition) - 2); // Bottom 20% for ranks 11-30
      
      // Determine color based on movement and top-10 status
      const isInTop10 = dayRank <= 10;
      let color = '#666666'; // default gray
      
      if (day > 0) {
        const prevRank = data[day - 1].rank;
        const wasInTop10 = prevRank <= 10;
        const rankChange = dayRank - prevRank;
        
        // Strong color coding for dramatic movements
        if (isInTop10 && !wasInTop10) {
          color = '#00ff88'; // Bright green - entered top-10
        } else if (!isInTop10 && wasInTop10) {
          color = '#ff3366'; // Bright red - left top-10
        } else if (Math.abs(rankChange) >= 2) {
          // Big movements (2+ positions)
          color = rankChange < 0 ? '#00ff88' : '#ff3366'; // Green for improvement, red for decline
        } else if (Math.abs(rankChange) >= 1) {
          // Medium movements (1+ positions)
          color = rankChange < 0 ? '#66ff88' : '#ff6666'; // Lighter colors
        } else {
          // Small movements
          color = isInTop10 ? '#44ff44' : '#888888';
        }
      } else {
        color = isInTop10 ? '#00ff88' : '#ff3366';
      }
      
      data.push({ x, y, rank: dayRank, color });
    }
    
    return data;
  };

  const rankData = generateRankData();
  
  // Calculate midline position at bottom (80% down from top) for rank 10.5
  const midlineY = 30 * 0.8; // 80% down from top of 30px height

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="bg-[#0000001f] rounded-sm p-1 border border-gray-800/50">
        <svg width="80" height="30" className="overflow-visible">
          {/* Background */}
          <rect width="80" height="30" fill="#ffffff0e" rx="2" />
          
          {/* Top-10 boundary midline - positioned at bottom for more upward space */}
          <line
            x1="2"
            y1={midlineY}
            x2="78"
            y2={midlineY}
            stroke="#ffff00"
            strokeWidth="0.8"
            strokeDasharray="2,1"
            opacity="0.8"
          />
          
          {/* Label for midline */}
          <text
            x="4"
            y={midlineY - 2}
            fontSize="6"
            fill="#ffff00"
            opacity="0.7"
            fontFamily="monospace"
          >
            Top 10
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
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
          
          {/* Data points for boundary crossings */}
          {rankData.map((point, index) => {
            if (index === 0) return null;
            
            const prevPoint = rankData[index - 1];
            const crossedMidline = (prevPoint.rank <= 10) !== (point.rank <= 10);
            
            if (crossedMidline) {
              return (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="1.5"
                  fill={point.color}
                  stroke="#000"
                  strokeWidth="0.5"
                />
              );
            }
            return null;
          })}
          
          {/* Current position indicator */}
          <circle
            cx={rankData[rankData.length - 1]?.x || 78}
            cy={rankData[rankData.length - 1]?.y || 15}
            r="2"
            fill={rankData[rankData.length - 1]?.color || '#666666'}
            stroke="#000"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
};
