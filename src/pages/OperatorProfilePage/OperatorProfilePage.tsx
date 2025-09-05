import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { BackToTop } from 'shared/ui';
import { mockOperatorGroups } from 'shared/lib/mock/operatorData';
import { ProfileHeader } from './ui/ProfileHeader';
import { ProfileStats } from './ui/ProfileStats';
import type { Operator } from 'shared/types';
import { cn } from 'shared/lib';





// Dedicated StockChart component for Profile Page
const ProfileStockChart = ({ trend, className, currentRank = 5, previousRank = 8, onClickDay }: {
  trend: 'up' | 'down' | 'neutral';
  className?: string;
  currentRank?: number;
  previousRank?: number;
  onClickDay?: (day: number | null) => void;
}) => {
  const [clickedPoint, setClickedPoint] = useState<{x: number, y: number, rank: number, day: number} | null>(null);
  const [clickedDay, setClickedDay] = useState<number | null>(null);
  
  // Generate rank progression data optimized for profile page
  const generateRankData = () => {
    const days = 23;
    const width = 600; // Much wider for profile
    const height = 300; // Increased height for taller lines between dots
    const data: Array<{x: number, y: number, rank: number, color: string, day: number}> = [];
    
    const startRank = previousRank;
    const endRank = currentRank;
    const totalChange = endRank - startRank;
    
    for (let day = 0; day < days; day++) {
      const x = 50 + (day / (days - 1)) * (width - 100);
      
      let dayRank: number;
      
      if (day === days - 1) {
        dayRank = currentRank;
      } else {
        const progressRatio = day / (days - 1);
        dayRank = startRank + (totalChange * progressRatio);
        
        const volatility = Math.sin(day * 0.9) * 4 + Math.cos(day * 0.5) * 2.5;
        const cryptoWave = Math.sin(day * 1.3) * 2;
        
        if (trend === 'up') {
          dayRank += volatility;
          if (day >= 2 && day <= 3) dayRank += 5;
          if (day >= 5 && day <= 6) dayRank += 2;
          if (day >= 7 && day <= 8) dayRank -= 2;
        } else if (trend === 'down') {
          dayRank += volatility;
          if (day >= 2 && day <= 4) dayRank -= 3;
          if (day >= 8 && day <= 10) dayRank += 1.5;
          if (day >= 12 && day <= 14) dayRank -= 1;
        } else {
          dayRank += volatility * 0.5;
        }
        
        dayRank += cryptoWave;
      }
      
      dayRank = Math.max(1, Math.min(10, dayRank));
      
      const y = 20 + ((dayRank - 1) / 9) * (height - 40);
      
      let color = '#10b981';
      if (dayRank > 5) color = '#ef4444';
      else if (dayRank > 3) color = '#f59e0b';
      
      data.push({
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        rank: Math.round(dayRank * 10) / 10,
        color,
        day: day + 1
      });
    }
    
    return { data, width, height };
  };

  const { data, width, height } = generateRankData();

  const handlePointClick = (point: typeof data[0]) => {
    setClickedPoint(point);
    setClickedDay(point.day);
    onClickDay?.(point.day);
  };

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center", className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      >
        <defs>
          <linearGradient id="profileChartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="profileGridGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {Array.from({ length: 10 }, (_, i) => (
          <line
            key={`grid-${i}`}
            x1={50}
            y1={20 + (i / 9) * (height - 40)}
            x2={width - 50}
            y2={20 + (i / 9) * (height - 40)}
            stroke="url(#profileGridGradient)"
            strokeWidth="1"
            className="animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '3s'
            }}
          />
        ))}
        
        {/* Y-axis rank labels 1-10 in single column */}
        {Array.from({ length: 10 }, (_, i) => {
          const position = i + 1;
          const y = 20 + (i / 9) * (height - 40);
          
          return (
            <text
              key={`position-${i}`}
              x={15}
              y={y + 6}
              fontSize="16"
              fill="#e2e8f0"
              fontFamily="JetBrains Mono, Consolas, monospace"
              fontWeight="600"
              className="drop-shadow-sm"
              textAnchor="middle"
            >
              {position}
            </text>
          );
        })}

        {/* Chart line */}
        <path
          d={`M ${data.map(point => `${point.x},${point.y}`).join(' L ')}`}
          fill="none"
          stroke="url(#profileChartGradient)"
          strokeWidth="3"
          className="drop-shadow-lg"
        />

        {/* Data points */}
        {data.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={clickedDay === point.day ? "8" : "6"}
            fill={clickedDay === point.day ? "#fbbf24" : point.color}
            stroke="#ffffff"
            strokeWidth="2"
            className="cursor-pointer hover:r-8 transition-all duration-200 drop-shadow-lg"
            onClick={() => handlePointClick(point)}
          >
            <animate
              attributeName="r"
              values={clickedDay === point.day ? "8;10;8" : "6;8;6"}
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Current rank indicator */}
        {data.length > 0 && (
          <>
            <circle
              cx={data[data.length - 1].x}
              cy={data[data.length - 1].y}
              r="12"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              className="animate-pulse"
            />
            <text
              x={data[data.length - 1].x}
              y={data[data.length - 1].y - 20}
              fontSize="12"
              fill="#ffffff"
              fontWeight="bold"
              textAnchor="middle"
              className="drop-shadow-lg"
            >
              #{Math.round(currentRank)}
            </text>
          </>
        )}
      </svg>

      {/* Click indicator */}
      {clickedPoint && (
        <div 
          className="absolute bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-mono border border-white/20"
          style={{
            left: `${(clickedPoint.x / width) * 100}%`,
            top: `${(clickedPoint.y / height) * 100 - 10}%`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          Day {clickedPoint.day}: #{Math.round(clickedPoint.rank)}
        </div>
      )}
    </div>
  );
};

export const OperatorProfilePage = () => {
  const { operatorId } = useParams<{ operatorId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Find the operator across all groups
  const findOperator = (): Operator | undefined => {
    for (const group of mockOperatorGroups) {
      const operator = group.operators.find(op => op.id === operatorId);
      if (operator) return operator;
    }
    return undefined;
  };

  const operator = findOperator();

  if (!operator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">{t('operatorNotFound')}</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('backToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div 
      ref={scrollRef}
      className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black"
    >
      <div className="container mx-auto px-4 py-6">
        <div 
          style={{
            width: '100%',
            maxWidth: '1792px',
            minWidth: '1200px',
            margin: '0 auto'
          }}
          className="space-y-6"
        >
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-6"
          >
            <span className="text-lg">←</span>
            <span className="font-medium">{t('back')}</span>
          </button>

          {/* Profile Header */}
          <ProfileHeader operator={operator} />

          {/* Profile Stats */}
          <ProfileStats operator={operator} />

          {/* Activity Section with Dedicated Profile Stock Chart */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ">
            <h3 className="text-xl font-bold text-white mb-6">Activity Chart</h3>
            <div className="w-full h-[500px]">
              <ProfileStockChart
                trend={(() => {
                  const change = operator.rankChange || 0;
                  if (change > 0) return 'up';
                  if (change < 0) return 'down';
                  return 'neutral';
                })()}
                currentRank={operator.rank}
                previousRank={operator.rank + (operator.rankChange || 0)}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop targetRef={scrollRef} />
    </div>
  );
};
