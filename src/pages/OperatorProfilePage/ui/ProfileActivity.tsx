import { StockChart } from 'shared/ui/components/StockChart';
import type { Operator } from 'shared/types';

interface ProfileActivityProps {
  operator: Operator;
}

export const ProfileActivity = ({ operator }: ProfileActivityProps) => {
  // Calculate trend based on rank change
  const getTrend = (): 'up' | 'down' | 'neutral' => {
    const change = operator.rankChange || 0;
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="space-y-4">
        {/* Activity Header */}
        <h2 className="text-xl font-bold text-white">Activity</h2>

        {/* Large Stock Chart */}
        <div className="w-full flex justify-center py-8">
          <div 
            className="transform scale-[2.5]"
            style={{ transformOrigin: 'center' }}
          >
            <StockChart
              trend={getTrend()}
              currentRank={operator.rank}
              previousRank={operator.rank + (operator.rankChange || 0)}
              className="w-full"
            />
          </div>
        </div>

        {/* Additional Activity Metrics */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/20">
          <div className="text-center">
            <div className="text-white/70 text-sm font-medium mb-2">Monthly Average</div>
            <div className="text-2xl font-bold text-white">{operator.average}</div>
          </div>
          
          <div className="text-center">
            <div className="text-white/70 text-sm font-medium mb-2">Top 3 Medals</div>
            <div className="text-2xl font-bold text-yellow-400">{operator.topMedalCount || 0}</div>
          </div>
          
          <div className="text-center">
            <div className="text-white/70 text-sm font-medium mb-2">Rank Change</div>
            <div className={`text-2xl font-bold ${
              (operator.rankChange || 0) > 0 ? 'text-green-400' :
              (operator.rankChange || 0) < 0 ? 'text-red-400' :
              'text-gray-400'
            }`}>
              {(operator.rankChange || 0) > 0 ? '+' : ''}{operator.rankChange || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
