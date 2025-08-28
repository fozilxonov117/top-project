import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { MonthFilter, Month, OperatorGroup } from 'shared/types';
import { QuarterTabs, LanguageSwitcher, BackToTop } from 'shared/ui';
import { OperatorGroup as OperatorGroupComponent } from 'widgets/OperatorGroup';
import { OperatorTable } from 'widgets/OperatorTable';
import { mockOperatorGroups } from 'shared/lib/mock/operatorData';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<MonthFilter>('current-month');
  const [selectedMonth, setSelectedMonth] = useState<Month | undefined>(undefined);
  const [selectedGroup, setSelectedGroup] = useState<OperatorGroup | null>(null);
  const [showTable, setShowTable] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = (filter: MonthFilter, month?: Month) => {
    setActiveFilter(filter);
    if (month) {
      setSelectedMonth(month);
    }
    console.log('Filter changed:', filter, month ? `Month: ${month}` : '');
    // TODO: Filter operators data based on the selected month/filter
  };

  const handleSeeAll = (groupId: string) => {
    const group = mockOperatorGroups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
      setShowTable(true);
    }
  };

  const handleBackToGrid = () => {
    setShowTable(false);
    setSelectedGroup(null);
  };

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
      {/* Header - Fixed */}
      <div className="bg-[#ffffff14] border-b border-gray-200/50 px-4 sm:px-8 py-4 flex-shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t('topOperators')}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <QuarterTabs 
              activeFilter={activeFilter} 
              selectedMonth={selectedMonth}
              onFilterChange={handleFilterChange} 
            />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-auto main-content-scroll smooth-scroll scroll-fade scrollable"
      >
        <div className="py-4 px-16  min-h-full">
          {!showTable ? (
            /* Grid View */
            <div
              style={{
                width: '100%',
                maxWidth: '1792px',
                minWidth: '1792px',
                margin: '0 auto'
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-10 auto-rows-max"
            >
              {mockOperatorGroups.map((group) => (
                <OperatorGroupComponent key={group.id} group={group} onSeeAll={() => handleSeeAll(group.id)} />
              ))}
            </div>
          ) : (
            /* Table View */
            <div>
              {/* Back to Grid Button */}
              <div className="mb-3 flex items-center gap-4">
                <button
                  onClick={handleBackToGrid}
                  className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                >
                  <span className="text-lg">←</span>
                  <span className="font-medium">{t('back')}</span>
                </button>
                
                <div className="h-6 w-px bg-white/20" />
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {t('operators')} - {selectedGroup?.title}
                </h1>
              </div>
              {/* Operator Table */}
              {selectedGroup && (
                <OperatorTable operators={selectedGroup.operators} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop targetRef={scrollRef} />
    </div>
  );
};
