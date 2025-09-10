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
      return 'bg-transparent text-yellow-400 border border-yellow-400/50'; // Transparent with gold border for 1st place
    case 2:
      return 'bg-transparent text-gray-300 border border-gray-400/50'; // Transparent with silver border for 2nd place
    case 3:
      return 'bg-transparent text-amber-400 border border-amber-500/50'; // Transparent with bronze border for 3rd place
    default:
      return 'bg-transparent text-green-400 border border-green-500/50'; // Transparent with green border
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
        'transition-all duration-300 ease-out flex-shrink-0 flex-grow-0',
        'hover:-translate-y-1',
        getVerticalOffset(operator.rank),
        className,
      )}>
      {/* Profile Image - OUTSIDE the border box */}
      <div className="flex justify-center mb-1.5 transition-all duration-300">
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
      <h3 className="text-sm font-semibold text-white text-center mb-2 leading-tight transition-all duration-300 group-hover:text-blue-200">
        {operator.name.split(' ').map((name, index) => (
          <div key={index}>{name}</div>
        ))}
      </h3>

      {/* Stats Box - WITH colored border */}
      <div
        className={cn(
          'flex items-center justify-end flex-col gap-1 bg-[#ffffff14] shadow-lg rounded-2xl w-32 p-3 pb-4',
          'transition-all duration-300 ease-out',
          'group-hover:shadow-xl group-hover:bg-[#ffffff20]',
          'relative overflow-hidden',
          getBorderColor(operator.rank),
          getStatsBoxHeight(operator.rank),
        )}>
        {/* Simple background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl"></div>

        {/* Rank Badge */}
        <div className="flex flex-col items-center relative z-10 transition-all duration-300">
          <span className="text-xs text-white mb-1 transition-all duration-300 group-hover:text-blue-200">{t('rank')}</span>
          <div className="transition-all duration-300">
            <RankBadge rank={operator.rank} />
          </div>
        </div>

        {/* Points */}
        <div className="flex flex-col items-center relative z-10 transition-all duration-300">
          <span className="text-xs text-white mb-1 transition-all duration-300 group-hover:text-blue-200">{t('point')}</span>
          <div className={cn(
            'text-xs font-bold px-2 py-1 rounded-md transition-all duration-300',
            'group-hover:shadow-lg',
            getPointColors(operator.rank)
          )}>
            {formatPoints(operator.points)}
          </div>
        </div>
      </div>
    </div>
  );
};
