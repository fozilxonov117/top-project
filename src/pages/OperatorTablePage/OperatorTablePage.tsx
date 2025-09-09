import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
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
    <div className="bg-[#ffffff00] rounded-xl shadow-lg p-4" style={{ boxShadow: 'rgb(255 255 255 / 50%) 0px 2px 15px 0px' }}>
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
          <div className="bg-[#ffffff21] shadow-[0px_2px_15px_0px_rgba(0,0,0,0.5)] transition-colors rounded-lg px-6 py-3 text-white font-semibold">
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
  <div className="bg-[#ffffff00] rounded-xl shadow-lg p-4" style={{ boxShadow: 'rgb(255 255 255 / 50%) 0px 2px 15px 0px' }}>
    <div className="grid grid-cols-4 gap-6">
      <div className="text-center">
        <div className="text-white/70 text-sm font-medium mb-2">Count</div>
        <div className="text-3xl font-bold text-white">{operator.count}</div>
      </div>
      <div className="text-center">
        <div className="text-white/70 text-sm font-medium mb-2">Monthly Average</div>
        <div className="text-3xl font-bold text-white">{operator.average}</div>
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

const YesterdayStatsProfile = ({ operator }: { operator: Operator }) => {
  // Generate yesterday's stats (compact version for profile panel)
  const generateYesterdayStats = () => {
    const baseCount = operator.count;
    const baseAverage = operator.average;
    const baseKpi = operator.kpi;
    
    // Generate yesterday's values with slight variations
    const yesterdayCount = Math.max(1, baseCount - Math.floor(Math.random() * 3) + 1);
    
    // Convert average to minutes for calculation
    const avgString = baseAverage.toString();
    const [avgMin, avgSec] = avgString.split(':').map(Number);
    const avgTotalSeconds = avgMin * 60 + avgSec;
    
    // Yesterday's average with variation (±30 seconds)
    const yesterdayAvgSeconds = Math.max(60, avgTotalSeconds + (Math.random() - 0.5) * 60);
    const yesterdayAvgMin = Math.floor(yesterdayAvgSeconds / 60);
    const yesterdayAvgSec = Math.floor(yesterdayAvgSeconds % 60);
    const yesterdayAverage = `${yesterdayAvgMin.toString().padStart(2, '0')}:${yesterdayAvgSec.toString().padStart(2, '0')}`;
    
    // Yesterday's KPI with variation (±2.5)
    const yesterdayKpi = Math.max(60, parseFloat(baseKpi.toString()) + (Math.random() - 0.5) * 5).toFixed(1);
    
    return {
      count: yesterdayCount,
      average: yesterdayAverage,
      kpi: yesterdayKpi
    };
  };

  const yesterdayData = generateYesterdayStats();

  return (
    <div className="bg-[#ffffff00] rounded-xl shadow-lg p-4" style={{ boxShadow: 'rgb(255 255 255 / 50%) 0px 2px 15px 0px' }}>
      <h3 className="text-lg font-bold text-white mb-4">Yesterday's Stats</h3>
      <div className="grid grid-cols-3 gap-4">
        {/* Yesterday's Daily Count */}
        <div className="text-center">
          <div className="text-white/70 text-xs font-medium mb-1">Daily Count</div>
          <div className="text-xl font-bold text-white">{yesterdayData.count}</div>
        </div>

        {/* Yesterday's Daily Average */}
        <div className="text-center">
          <div className="text-white/70 text-xs font-medium mb-1">Daily Average</div>
          <div className="text-xl font-bold text-white">{yesterdayData.average}</div>
        </div>

        {/* Yesterday's KPI */}
        <div className="text-center">
          <div className="text-white/70 text-xs font-medium mb-1">KPI</div>
          <div className="text-xl font-bold text-white">{yesterdayData.kpi}</div>
        </div>
      </div>
    </div>
  );
};

const ProfileActivity = ({ operator }: { operator: Operator }) => {
  const [clickedDay, setClickedDay] = useState<number | null>(null); // Changed from hoveredDay
  
  const getTrend = (): 'up' | 'down' | 'neutral' => {
    const change = operator.rankChange || 0;
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  const handleClickDay = (day: number | null) => { // Changed from handleHoverDay
    setClickedDay(day);
  };

  // Calculate daily statistics based on clicked day or current day
  const getDailyStats = () => {
    const day = clickedDay ?? 22; // Default to current day (last day)
    const currentDay = clickedDay !== null ? clickedDay + 1 : 23; // Display day number (1-23)
    
    // Generate realistic daily statistics based on day progression
    const baseDailyCount = Math.round((operator.count || 104) / 23);
    const dailyCountVariation = Math.sin(day * 0.3) * 2 + Math.cos(day * 0.7) * 1.5;
    const dailyCount = Math.max(1, Math.round(baseDailyCount + dailyCountVariation));
    
    // Calculate daily average (response time) with some variation
    const averageStr = typeof operator.average === 'string' ? operator.average : '1:45';
    const baseMinutes = parseInt(averageStr.split(':')[0] || '1');
    const baseSeconds = parseInt(averageStr.split(':')[1] || '45');
    const baseTotalSeconds = baseMinutes * 60 + baseSeconds;
    const dailyVariation = Math.sin(day * 0.4) * 15 + Math.cos(day * 0.6) * 10; // ±25 seconds variation
    const dailyTotalSeconds = Math.max(30, baseTotalSeconds + dailyVariation);
    const dailyAverage = `${Math.floor(dailyTotalSeconds / 60)}:${String(Math.floor(dailyTotalSeconds % 60)).padStart(2, '0')}`;
    
    return {
      currentDay,
      dailyCount,
      dailyAverage,
      monthlyKpi: operator.kpi, // KPI usually doesn't change daily
      isClicked: clickedDay !== null // Changed from isHovered
    };
  };

  const stats = getDailyStats();

  return (
    <div className="bg-[#ffffff00] rounded-xl shadow-lg p-6" style={{ boxShadow: 'rgb(255 255 255 / 50%) 0px 2px 15px 0px, inset rgba(0, 0, 0, 0.5) 0px 2px 15px 0px', height: '400px' }}>
      <div className="h-full flex flex-col">
        {/* Stock Chart Area - 70% of space */}
        <div className="w-full flex justify-center items-center overflow-hidden" style={{ height: '80%' }}>
          <div 
            className="transform scale-[2.8] flex items-center justify-center h-[90px] "
            style={{ transformOrigin: 'center', maxWidth: '100%', maxHeight: '100%' }}
          >
            <StockChart
              trend={getTrend()}
              currentRank={operator.rank}
              previousRank={operator.rank + (operator.rankChange || 0)}
              className="w-full"
              onClickDay={handleClickDay}
              profileMode={true}
            />
          </div>
        </div>
        {/* Daily Statistics Area - 30% of space */}
        <div className="border-t border-white/20 flex-shrink-0" style={{ height: '20%' }}>
          <div className="grid grid-cols-3 gap-6 pt-3 h-full items-center">
            <div className="text-center">
              <div className="text-white/70 text-xs font-medium mb-1">
                Daily Count {stats.isClicked && <span className="text-xs text-green-400">(Day {stats.currentDay})</span>}
              </div>
              <div className={`text-xl font-bold transition-colors duration-200 ${stats.isClicked ? 'text-green-400' : 'text-white'}`}>
                {stats.dailyCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-white/70 text-xs font-medium mb-1">
                Daily Average {stats.isClicked && <span className="text-xs text-green-400">(Day {stats.currentDay})</span>}
              </div>
              <div className={`text-xl font-bold transition-colors duration-200 ${stats.isClicked ? 'text-green-400' : 'text-white'}`}>
                {stats.dailyAverage}
              </div>
            </div>
            <div className="text-center">
              <div className="text-white/70 text-xs font-medium mb-1">Monthly KPI</div>
              <div className="text-xl font-bold text-blue-400">{stats.monthlyKpi}</div>
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

  // Find the group by ID
  const group = mockOperatorGroups.find(g => g.id === groupId);
  
  // Find the operator if operatorId is provided
  const selectedOperator: Operator | undefined = operatorId 
    ? group?.operators.find(op => op.id === operatorId)
    : undefined;

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
      className="relative h-screen bg-gray-50 flex flex-col overflow-hidden"
      style={{
        backgroundImage: "url('/assets/background (1)/255/Background 1 (2).png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="flex h-full min-h-0 overflow-hidden">
        {/* Left side - Main Content (operator table) with smoother transitions */}
        <div className={`flex flex-col transition-all duration-300 ease-in-out min-h-0 ${
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

        {/* Right side - Profile Panel Wrapper with smooth width animation */}
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            selectedOperator ? 'w-1/3' : 'w-0'
          }`}
        >
          {/* Profile Panel Content */}
          <div className="w-full h-full flex flex-col min-h-0 bg-[#ffffff00] shadow-[0px_2px_15px_0px_rgba(255,255,255,0.5)]" style={{ minWidth: '400px' }}>
            {selectedOperator && (
              <>
                {/* Profile Header - Fixed with smoother animation */}
                <div className="bg-[#ffffff14]  px-4 sm:px-8 py-4 flex-shrink-0 bg-transparent">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold text-white opacity-0 animate-fadeInUp" style={{ animationDelay: '0.05s', animationDuration: '0.8s', animationFillMode: 'forwards' }}>
                      Profile Info
                    </h2>
                    <button
                      onClick={handleCloseProfile}
                      className="text-white hover:text-gray-300 transition-all duration-150 text-2xl leading-none hover:scale-110 hover:rotate-90"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Profile Content - Scrollable with staggered smooth animations */}
                <div className="flex-1 min-h-0 overflow-auto px-4 sm:px-8 py-6">
                  <div className="space-y-6">
                    <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.1s', animationDuration: '0.4s', animationFillMode: 'forwards' }}>
                      <ProfileHeader operator={selectedOperator} />
                    </div>
                    <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.15s', animationDuration: '0.4s', animationFillMode: 'forwards' }}>
                      <ProfileStats operator={selectedOperator} />
                    </div>
                    <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.2s', animationDuration: '0.4s', animationFillMode: 'forwards' }}>
                      <ProfileActivity operator={selectedOperator} />
                    </div>
                    <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.25s', animationDuration: '0.4s', animationFillMode: 'forwards' }}>
                      <YesterdayStatsProfile operator={selectedOperator} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
