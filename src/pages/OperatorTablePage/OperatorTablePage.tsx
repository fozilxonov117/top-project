import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { OperatorTable } from 'widgets/OperatorTable';
import { mockOperatorGroups } from 'shared/lib/mock/operatorData';
import { StockChart, GoldMedal, SilverMedal, BronzeMedal } from 'shared/ui';
import type { Operator } from 'shared/types';

// Profile Components (inline)
const ProfileHeader = ({ operator }: { operator: Operator }) => {
  const getPositionSuffix = (rank: number) => {
    if (rank % 10 === 1 && rank % 100 !== 11) return 'st';
    if (rank % 10 === 2 && rank % 100 !== 12) return 'nd';
    if (rank % 10 === 3 && rank % 100 !== 13) return 'rd';
    return 'th';
  };

  const getRankDisplay = () => {
    if (operator.rank === 1) {
      return <GoldMedal className="w-8 h-8" />;
    }
    if (operator.rank === 2) {
      return <SilverMedal className="w-8 h-8" />;
    }
    if (operator.rank === 3) {
      return <BronzeMedal className="w-8 h-8" />;
    }
    return null; // No badge for operators ranked 4+
  };

  return (
    <div className="bg-[#ffffff24] rounded-xl shadow-lg p-6" style={{ boxShadow: 'rgb(0 0 0 / 50%) 0px 2px 15px 0px' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={operator.avatar}
              alt={operator.name}
              className="w-20 h-20 rounded-full border-4 border-white/20 object-cover"
              style={{
                objectPosition: 'center 20%', // Position to show head properly
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
              }}
            />
            <div className="absolute -top-2 -right-2">
              {getRankDisplay()}
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">{operator.name}</h1>
            <p className="text-white/70 text-sm">ID: {operator.id.padStart(7, '0')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-green-600 hover:bg-green-700 transition-colors rounded-lg px-6 py-3 text-white font-semibold">
            <div className="text-center">
              <div className="text-sm opacity-80">Leaderboard</div>
              <div className="text-lg font-bold">
                {operator.rank}{getPositionSuffix(operator.rank)} place
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileStats = ({ operator }: { operator: Operator }) => (
  <div className="bg-[#ffffff24] rounded-xl shadow-lg p-6" style={{ boxShadow: 'rgb(0 0 0 / 50%) 0px 2px 15px 0px' }}>
    <div className="grid grid-cols-4 gap-6">
      <div className="text-center">
        <div className="text-white/70 text-sm font-medium mb-2">Count</div>
        <div className="text-3xl font-bold text-white">{operator.count}</div>
      </div>
      <div className="text-center">
        <div className="text-white/70 text-sm font-medium mb-2">Count</div>
        <div className="text-3xl font-bold text-white">{operator.count}</div>
      </div>
      <div className="text-center">
        <div className="text-white/70 text-sm font-medium mb-2">KPI</div>
        <div className="text-3xl font-bold text-white">{operator.kpi}</div>
      </div>
      <div className="text-center">
        <div className="text-white/70 text-sm font-medium mb-2">Points</div>
        <div className="text-3xl font-bold text-white">{operator.points}</div>
      </div>
    </div>
  </div>
);

const ProfileActivity = ({ operator }: { operator: Operator }) => {
  const getTrend = (): 'up' | 'down' | 'neutral' => {
    const change = operator.rankChange || 0;
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  return (
    <div className="bg-[#ffffff24] rounded-xl shadow-lg p-6" style={{ boxShadow: 'rgb(0 0 0 / 50%) 0px 2px 15px 0px' }}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Activity</h2>
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

export const OperatorTablePage = () => {
  const { groupId, operatorId } = useParams<{ groupId: string; operatorId?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Animation states
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Find the group by ID
  const group = mockOperatorGroups.find(g => g.id === groupId);
  
  // Find the operator if operatorId is provided
  const selectedOperator: Operator | undefined = operatorId 
    ? group?.operators.find(op => op.id === operatorId)
    : undefined;

  // Handle profile panel animations
  useEffect(() => {
    if (selectedOperator && !isProfileVisible) {
      // Opening animation
      setIsAnimating(true);
      setIsProfileVisible(true);
      // Small delay to ensure smooth transition
      setTimeout(() => setIsAnimating(false), 50);
    } else if (!selectedOperator && isProfileVisible) {
      // Closing animation
      setIsAnimating(true);
      setTimeout(() => {
        setIsProfileVisible(false);
        setIsAnimating(false);
      }, 300); // Match the CSS transition duration
    }
  }, [selectedOperator, isProfileVisible]);

  const handleCloseProfile = () => {
    if (groupId) {
      navigate(`/operators/${groupId}`);
    }
  };

  if (!group) {
    return (
      <div 
        className="relative h-screen bg-gray-50 flex flex-col overflow-hidden"
        style={{
          backgroundImage: "url('/assets/background (1)/255/Background 1 (2).png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold mb-4">{t('groupNotFound')}</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('backToDashboard')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen h-screen bg-gray-50 flex flex-col overflow-hidden"
      style={{
        backgroundImage: "url('/assets/background (1)/255/Background 1 (2).png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="flex h-full min-h-0">
        {/* Left side - Main Content (operator table) */}
        <div className={`flex flex-col transition-all duration-300 ease-out min-h-0 ${
          selectedOperator ? 'w-2/3' : 'w-full'
        }`}>
          {/* Header with Navigation */}
          <div className="bg-[#ffffff14] shadow-[0px_2px_15px_0px_rgba(0,0,0,0.5)] px-4 sm:px-8 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                >
                  <span className="text-lg">←</span>
                  <span className="font-medium">{t('back')}</span>
                </button>
                <div className="h-6 w-px bg-white/20" />
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {t('operators')} - {group.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Table Content - Scrollable - Full remaining height */}
          <div className="flex-1 min-h-0 overflow-auto px-4 sm:px-8 py-6">
            <OperatorTable 
              operators={group.operators} 
              groupId={groupId} 
              selectedOperatorId={selectedOperator?.id}
            />
          </div>
        </div>

        {/* Right side - Profile Panel (slide in from right with smooth animation) */}
        {isProfileVisible && selectedOperator && (
          <div 
            className={`w-1/3 flex flex-col min-h-0 bg-[#ffffff14] shadow-[0px_2px_15px_0px_rgba(0,0,0,0.5)] border-l border-white/20 transition-all duration-300 ease-out ${
              selectedOperator && !isAnimating 
                ? 'transform translate-x-0 opacity-100' 
                : 'transform translate-x-full opacity-0'
            }`}
            style={{
              animation: selectedOperator && !isAnimating 
                ? 'slideInFromRight 0.3s ease-out forwards' 
                : isAnimating 
                ? 'slideOutToRight 0.3s ease-in forwards' 
                : undefined
            }}
          >
            {/* Profile Header - Fixed */}
            <div className="bg-[#ffffff14] shadow-[0px_2px_15px_0px_rgba(0,0,0,0.5)] px-4 sm:px-8 py-4 flex-shrink-0 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-white opacity-0 animate-fadeInUp" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                  Profile Info
                </h2>
                <button
                  onClick={handleCloseProfile}
                  className="text-white hover:text-gray-300 transition-all duration-200 text-2xl leading-none hover:scale-110 hover:rotate-90"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Profile Content - Scrollable - Full remaining height */}
            <div className="flex-1 min-h-0 overflow-auto px-4 sm:px-8 py-6">
              <div className="space-y-6">
                <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                  <ProfileHeader operator={selectedOperator} />
                </div>
                <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                  <ProfileStats operator={selectedOperator} />
                </div>
                <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                  <ProfileActivity operator={selectedOperator} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
