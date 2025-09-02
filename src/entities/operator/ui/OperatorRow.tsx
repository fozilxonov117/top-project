import type { Operator } from 'shared/types';
import { GoldMedal, SilverMedal, BronzeMedal } from 'shared/ui/components/MedalIcons';
import { StockChart } from 'shared/ui/components/StockChart';
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
    // rankChange > 0 means position IMPROVED (better rank), so UP trend = GREEN
    // rankChange < 0 means position DECLINED (worse rank), so DOWN trend = RED
    return operator.rankChange > 0 ? 'up' : 'down';
  };

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

        {/* Stock Chart Column */}
        <div className="flex items-center justify-end min-w-[90px]">
          <StockChart 
            trend={getStockTrend()} 
            className="" 
            currentRank={operator.rank}
            previousRank={operator.rank + (operator.rankChange || 0)}
          />
        </div>

        {/* Rank Change Indicator Column */}
        <div className="flex items-center justify-center min-w-[40px]">
          {operator.rankChange !== undefined && operator.rankChange !== null && operator.rankChange !== 0 && (
            <div className={cn(
              'text-xs flex items-center gap-1 font-medium',
              operator.rankChange > 0 ? 'text-green-400' : 'text-red-400'
            )}>
              <span>{operator.rankChange > 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(operator.rankChange)}</span>
            </div>
          )}
          {/* Neutral indicator for no change */}
          {(operator.rankChange === undefined || operator.rankChange === null || operator.rankChange === 0) && (
            <div className="text-xs flex items-center gap-1 font-medium text-gray-400">
              <span>−</span>
            </div>
          )}
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
