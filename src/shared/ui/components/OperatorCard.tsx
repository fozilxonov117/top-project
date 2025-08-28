import { useTranslation } from 'react-i18next';
import type { Operator } from 'shared/types';
import { RankBadge } from './RankBadge';
import { cn } from 'shared/lib';
import { useOperatorTranslations } from 'shared/lib/hooks/useOperatorTranslations';

interface OperatorCardProps {
  operator: Operator;
  className?: string;
}

const getBorderColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'border-yellow-400 '; // Yellow border for 1st place
    case 2:
      return 'border-cyan-400 '; // Light blue border for 2nd place
    case 3:
      return 'border-orange-400 '; // Orange border for 3rd place
    default:
      return 'border-gray-200 ';
  }
};

const getVerticalOffset = (rank: number) => {
  switch (rank) {
    case 1:
      return '-mt-4'; // 1st place higher
    case 2:
      return 'mt-0'; // 2nd place normal
    case 3:
      return 'mt-4'; // 3rd place lower
    default:
      return 'mt-0';
  }
};

const getStatsBoxHeight = (rank: number) => {
  switch (rank) {
    case 1:
      return 'h-44'; // 1st place tallest (reduced from h-48)
    case 2:
      return 'h-40'; // 2nd place medium (reduced from h-44)
    case 3:
      return 'h-36'; // 3rd place shortest (reduced from h-40)
    default:
      return 'h-16';
  }
};

const getPointColors = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-[#f4d725] text-white'; // Gold for 1st place
    case 2:
      return 'bg-gray-100 text-gray-800'; // Silver for 2nd place
    case 3:
      return 'bg-[#feb800] text-amber-800'; // Bronze for 3rd place
    default:
      return 'bg-green-100 text-green-700'; // Default green
  }
};

const getAvatarRingColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'group-hover:ring-[#f4d725]'; // Gold ring for 1st place
    case 2:
      return 'group-hover:ring-gray-400/80'; // Silver ring for 2nd place
    case 3:
      return 'group-hover:ring-amber-500/80'; // Bronze ring for 3rd place
    default:
      return 'group-hover:ring-white/30'; // Default white ring
  }
};

export const OperatorCard = ({ operator, className }: OperatorCardProps) => {
  const { t } = useTranslation();
  const { formatPoints } = useOperatorTranslations();
  return (
    <div
      className={cn(
        'flex flex-col items-center w-[155px] min-w-[155px] max-w-[155px] group cursor-pointer operator-layout',
        'transition-all duration-500 ease-out flex-shrink-0 flex-grow-0',
        'hover:scale-101 hover:-translate-y-2',
        getVerticalOffset(operator.rank),
        className,
      )}>
      {/* Profile Image - OUTSIDE the border box */}
      <div className="flex justify-center mb-1.5 transition-transform duration-300 group-hover:scale-110">
        <img
          src={operator.avatar}
          alt={operator.name}
          loading="lazy"
          className={cn(
            'h-16 w-16 rounded-full object-cover shadow-lg transition-all duration-300 operator-avatar',
            'group-hover:shadow-2xl group-hover:ring-4',
            getAvatarRingColor(operator.rank)
          )}
        />
      </div>

      {/* Name - OUTSIDE the border box */}
      <h3 className="text-sm font-semibold text-white text-center mb-2 leading-tight transition-all duration-300 group-hover:text-blue-200 group-hover:scale-105">
        {operator.name.split(' ').map((name, index) => (
          <div key={index}>{name}</div>
        ))}
      </h3>

      {/* Stats Box - WITH colored border */}
      <div
        className={cn(
          'flex items-center justify-end flex-col gap-1 bg-[#ffffff14] shadow-lg rounded-2xl w-32 p-3 pb-4',
          'transition-all duration-500 ease-out',
          'group-hover:shadow-2xl group-hover:bg-[#ffffff20] group-hover:scale-105',
          'group-hover:rotate-1 group-hover:backdrop-blur-sm',
          'relative overflow-hidden',
          getBorderColor(operator.rank),
          getStatsBoxHeight(operator.rank),
        )}>
        {/* Animated background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl"></div>
        
        {/* Floating particles effect */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-ping"></div>
        <div className="absolute top-6 left-6 w-1.5 h-1.5 bg-blue-200/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 group-hover:animate-pulse"></div>
        <div className="absolute bottom-8 right-6 w-1 h-1 bg-purple-200/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-600 delay-200 group-hover:animate-bounce"></div>

        {/* Rank Badge */}
        <div className="flex flex-col items-center relative z-10 transition-transform duration-300 group-hover:scale-110">
          <span className="text-xs text-white mb-1 transition-all duration-300 group-hover:text-blue-200 group-hover:font-bold">{t('rank')}</span>
          <div className="transition-transform duration-300 ">
            <RankBadge rank={operator.rank} />
          </div>
        </div>

        {/* Divider Line */}
        {/* <div className="h-0.5 w-12 bg-gray-400 my-2"></div> */}

        {/* Points */}
        <div className="flex flex-col items-center relative z-10 transition-transform duration-300 group-hover:scale-101">
          <span className="text-xs text-white mb-1 transition-all duration-300 group-hover:text-blue-200 group-hover:font-bold">{t('point')}</span>
          <div className={cn(
            'text-xs font-bold px-2 py-1 rounded-md transition-all duration-300',
            'group-hover:scale-110 group-hover:shadow-lg group-hover:animate-pulse',
            getPointColors(operator.rank)
          )}>
            {formatPoints(operator.points)}
          </div>
        </div>
      </div>
    </div>
  );
};
