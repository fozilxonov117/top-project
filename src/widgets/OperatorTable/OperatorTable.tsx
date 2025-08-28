import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Operator } from 'shared/types';
import { OperatorRow } from 'entities/operator';
import { cn } from 'shared/lib';

interface OperatorTableProps {
  operators: Operator[];
  className?: string;
}

type SortField = 'rank' | 'name' | 'count' | 'kpi' | 'average' | 'points';
type SortDirection = 'asc' | 'desc';

export const OperatorTable = ({ operators, className }: OperatorTableProps) => {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOperators = [...operators].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'count':
        aValue = a.count;
        bValue = b.count;
        break;
      case 'kpi':
        aValue = a.kpi;
        bValue = b.kpi;
        break;
      case 'average':
        aValue = a.average;
        bValue = b.average;
        break;
      case 'points':
        aValue = a.points;
        bValue = b.points;
        break;
      default:
        aValue = a.rank;
        bValue = b.rank;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  }).slice(0, 10); // Limit to top 10 operators

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={cn('bg-[#ffffff08] backdrop-blur-md rounded-xl border border-white/10 overflow-hidden', className)}>
      {/* Table Header */}
      <div className="bg-[#ffffff12] border-b border-white/10">
        <div className="flex px-6 py-2 text-sm font-semibold text-gray-300">
          {/* Left side - Operator Name (takes up more space) */}
          <div className="flex-1">
            <button
              onClick={() => handleSort('name')}
              className="text-left hover:text-white transition-colors flex items-center gap-1"
            >
              {t('operator')}
              <span className="text-xs">{getSortIcon('name')}</span>
            </button>
          </div>
          
          {/* Right side - Metrics (compact spacing) */}
          <div className="flex gap-8">
            <button
              onClick={() => handleSort('count')}
              className="text-center hover:text-white transition-colors flex items-center justify-center gap-1 min-w-[80px]"
            >
              {t('count')}
              <span className="text-xs">{getSortIcon('count')}</span>
            </button>
            <button
              onClick={() => handleSort('kpi')}
              className="text-center hover:text-white transition-colors flex items-center justify-center gap-1 min-w-[80px]"
            >
              {t('kpi')}
              <span className="text-xs">{getSortIcon('kpi')}</span>
            </button>
            <button
              onClick={() => handleSort('average')}
              className="text-center hover:text-white transition-colors flex items-center justify-center gap-1 min-w-[80px]"
            >
              {t('average')}
              <span className="text-xs">{getSortIcon('average')}</span>
            </button>
            <button
              onClick={() => handleSort('points')}
              className="text-center hover:text-white transition-colors flex items-center justify-center gap-1 min-w-[80px]"
            >
              {t('points')}
              <span className="text-xs">{getSortIcon('points')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-white/5">
        {sortedOperators.map((operator, index) => (
          <OperatorRow 
            key={operator.id} 
            operator={operator}
            isEven={index % 2 === 0}
          />
        ))}
      </div>
    </div>
  );
};
