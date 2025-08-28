import type { Operator } from 'shared/types';
import { GoldMedal, SilverMedal, BronzeMedal } from 'shared/ui/components/MedalIcons';
import { MedalCounter } from 'features/operator-ranking';
import { cn } from 'shared/lib';

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

  return (
    <div className={cn(
      'flex px-6 py-3 hover:bg-[#ffffff08] transition-colors border-b border-white/5 last:border-b-0',
      getRankRowStyle()
    )}>
      {/* Left side - Operator Info with Rank (takes up more space) */}
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
        
        {/* Operator Name and Rank Change in one line */}
        <div className="flex items-center gap-2">
          <div className="font-medium text-white">{operator.name}</div>
          {operator.rankChange && (
            <div className={cn(
              'text-xs flex items-center gap-1 font-medium',
              operator.rankChange > 0 ? 'text-green-400' : 'text-red-400'
            )}>
              <span>{operator.rankChange > 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(operator.rankChange)}</span>
            </div>
          )}
          {/* Show medal count for top 3 */}
          {operator.rank <= 3 && operator.topMedalCount && operator.topMedalCount > 0 && (
            <div className="ml-2">
              <MedalCounter count={operator.topMedalCount} />
            </div>
          )}
        </div>
      </div>

      {/* Right side - Metrics (compact spacing) */}
      <div className="flex gap-8">
        {/* Count */}
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
          <span className="text-green-400 font-bold text-lg bg-green-500/20 px-3 py-1 rounded-lg">
            {operator.points}
          </span>
        </div>
      </div>
    </div>
  );
};
