import { cn } from 'shared/lib';

interface MedalCounterProps {
  count: number;
  className?: string;
}

export const MedalCounter = ({ count, className }: MedalCounterProps) => {
  if (count === 0) return null;

  return (
    <div className={cn(
      'flex items-center justify-center bg-yellow-500 text-white text-xs font-bold rounded-full h-5 w-5 shadow-sm border border-yellow-600',
      className
    )}>
      {count}
    </div>
  );
};
