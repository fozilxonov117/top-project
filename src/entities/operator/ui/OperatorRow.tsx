import type { Operator } from 'shared/types';
import { GoldMedal, SilverMedal, BronzeMedal, StockChart } from 'shared/ui';
import { MedalCounter } from 'features/operator-ranking';
import { cn, analyzeRankingHistory } from 'shared/lib';

interface OperatorRowProps {
  operator: Operator;
  isEven?: boolean;
}

export const OperatorRow = ({ operator }: OperatorRowProps) => {
  const getRankDisplay = () => {
    if (operator.rank === 1) {
      return <GoldMedal className="h-8 w-8" />;
    }
    if (operator.rank === 2) {
      return <SilverMedal className="h-8 w-8" />;
    }
    if (operator.rank === 3) {
      return <BronzeMedal className="h-8 w-8" />;
    }
    return (
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-700 text-white text-sm font-semibold">
        {operator.rank}
      </div>
    );
  };

  const getRankRowStyle = () => {
    if (operator.rank === 1) {
      return 'bg-yellow-500/10 border-l-4 border-yellow-400';
    }
    if (operator.rank === 2) {
      return 'bg-gray-500/10 border-l-4 border-gray-400';
    }
    if (operator.rank === 3) {
      return 'bg-orange-500/10 border-l-4 border-orange-400';
    }
    return '';
  };

  const getStockTrend = () => {
    if (!operator.rankChange || operator.rankChange === 0) return 'neutral';
    // rankChange > 0 means position IMPROVED (better rank, lower number), so UP trend = GREEN
    // rankChange < 0 means position DECLINED (worse rank, higher number), so DOWN trend = RED
    return operator.rankChange > 0 ? 'up' : 'down';
  };

  // Calculate the actual rank movement for enhanced indicator
  const getRankMovement = () => {
    const change = operator.rankChange || 0;
    const previousRank = operator.rank + change;
    const currentRank = operator.rank;
    
    return {
      change,
      previousRank,
      currentRank,
      isImprovement: change > 0,
      isDecline: change < 0,
      magnitude: Math.abs(change)
    };
  };

  const rankMovement = getRankMovement();

  // Check if operator ever reached top-3 during the 22-day period
  const rankingHistory = analyzeRankingHistory(
    operator.rank, 
    operator.rank + (operator.rankChange || 0), 
    getStockTrend()
  );

  return (
    <div className={cn(
      'flex px-6 py-3 hover:bg-[#ffffff08] transition-colors border-b border-white/5 last:border-b-0',
      getRankRowStyle()
    )}>
      {/* Left side - Operator Name and Rank Badge/Medal */}
      <div className="flex items-center gap-3 flex-1">
        {/* Rank Circle/Medal */}
        <div className="flex items-center justify-center">
          {getRankDisplay()}
        </div>
        
        {/* Operator Avatar */}
        <img
          src={operator.avatar}
          alt={operator.name}
          className="h-12 w-12 rounded-full object-cover operator-avatar border-2 border-white/20"
        />
        
        {/* Operator Name */}
        <div className="font-medium text-lg text-white">{operator.name}</div>
      </div>

      {/* Right side - Medal Count, Stock Chart, Rank Change, and Metrics (separate columns) */}
      <div className="flex gap-8">
        {/* Medal Count Column - Show for operators who EVER reached top-3 in 22 days */}
        <div className="flex items-center justify-center min-w-[60px]">
          {rankingHistory.everReachedTop3 && (
            <MedalCounter count={rankingHistory.daysInTop3} />
          )}
        </div>

        {/* Stock Chart + Trend Indicator Combined Column */}
        <div className="flex items-center justify-end min-w-[200px] gap-1 relative">
          <StockChart 
            trend={getStockTrend()} 
            className="" 
            currentRank={rankMovement.currentRank}
            previousRank={rankMovement.previousRank}
          />
          
          {/* Connection line between chart and indicator */}
          <div className={cn(
            'w-1 h-6 rounded-full opacity-30 transition-all duration-300',
            rankMovement.isImprovement ? 'bg-green-400' : 
            rankMovement.isDecline ? 'bg-red-400' : 
            'bg-gray-400'
          )}></div>
          
          {/* Rank Change Indicator - positioned right next to stock chart */}
          <div className="flex items-center justify-center min-w-[40px]">
            {rankMovement.change !== 0 && (
              <div className={cn(
                'text-sm flex items-center gap-1 font-bold px-2 py-1 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer',
                rankMovement.isImprovement 
                  ? 'text-green-300 bg-green-500/20 border border-green-500/40 shadow-green-500/20 shadow-md hover:bg-green-500/30' 
                  : 'text-red-300 bg-red-500/20 border border-red-500/40 shadow-red-500/20 shadow-md hover:bg-red-500/30'
              )}
              title={`${rankMovement.isImprovement ? 'Improved' : 'Declined'} by ${rankMovement.magnitude} position${rankMovement.magnitude > 1 ? 's' : ''}`}
            >
                <span className="text-base font-black">{rankMovement.isImprovement ? '↑' : '↓'}</span>
                <span className="font-mono font-bold">{rankMovement.magnitude}</span>
              </div>
            )}
            {/* Enhanced neutral indicator */}
            {rankMovement.change === 0 && (
              <div className="text-sm flex items-center gap-1 font-medium text-gray-400 px-2 py-1 rounded-lg bg-gray-500/10 border border-gray-500/20" title="No change in position">
                <span className="text-gray-500 font-bold">−</span>
              </div>
            )}
          </div>
        </div>

        {/* Count Column */}
        <div className="flex items-center justify-center min-w-[80px]">
          <span className="text-white font-medium">{operator.count}</span>
        </div>

        {/* KPI */}
        <div className="flex items-center justify-center min-w-[80px]">
          <span className="text-white font-medium">{operator.kpi}</span>
        </div>

        {/* Average */}
        <div className="flex items-center justify-center min-w-[80px]">
          <span className="text-white font-medium">{operator.average}</span>
        </div>

        {/* Points */}
        <div className="flex items-center justify-center min-w-[80px]">
          <span className="text-green-400 font-bold text-base bg-green-500/20 px-3 py-1 rounded-lg">
            {operator.points}
          </span>
        </div>
      </div>
    </div>
  );
};
